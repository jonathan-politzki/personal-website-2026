const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(process.cwd(), 'src/content/writing');
const OUTPUT_FILE = path.join(process.cwd(), 'src/data/graph-data.json');
const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAJ2rvTsjyPE651ysAVKab3Ixi1zZAqPpg'; 

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- MATH UTILS FOR PCA ---
function dot(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
    return sum;
}

function normalize(v) {
    const mag = Math.sqrt(dot(v, v));
    return v.map(x => x / (mag || 1));
}

function sub(a, b) {
    return a.map((x, i) => x - b[i]);
}

function computePCA(vectors) {
    const N = vectors.length;
    if (N === 0) return [];
    const D = vectors[0].length;

    // 1. Center
    const mean = new Array(D).fill(0);
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < D; j++) mean[j] += vectors[i][j];
    }
    for (let j = 0; j < D; j++) mean[j] /= N;
    const centered = vectors.map(v => sub(v, mean));

    // 2. Gram Matrix
    const K = Array(N).fill(0).map(() => Array(N).fill(0));
    for (let i = 0; i < N; i++) {
        for (let j = i; j < N; j++) {
            const val = dot(centered[i], centered[j]);
            K[i][j] = val;
            K[j][i] = val;
        }
    }

    // 3. Power Iteration (Eigenvector 1)
    function getEigenvector(matrix, iterations = 20) {
        const size = matrix.length;
        let v = Array(size).fill(0).map(() => Math.random() - 0.5);
        v = normalize(v);
        for (let iter = 0; iter < iterations; iter++) {
            const nextV = Array(size).fill(0);
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    nextV[i] += matrix[i][j] * v[j];
                }
            }
            v = normalize(nextV);
        }
        return v;
    }

    const ev1 = getEigenvector(K);
    
    // Deflate
    let lambda1 = 0;
    for(let i=0; i<N; i++) {
        let rowSum = 0;
        for(let j=0; j<N; j++) rowSum += K[i][j] * ev1[j];
        lambda1 += ev1[i] * rowSum;
    }

    const K2 = K.map((row, i) => row.map((val, j) => val - lambda1 * ev1[i] * ev1[j]));
    const ev2 = getEigenvector(K2);
    
    let lambda2 = 0;
    for(let i=0; i<N; i++) {
        let rowSum = 0;
        for(let j=0; j<N; j++) rowSum += K2[i][j] * ev2[j];
        lambda2 += ev2[i] * rowSum;
    }

    const scale1 = Math.sqrt(Math.abs(lambda1));
    const scale2 = Math.sqrt(Math.abs(lambda2));

    return centered.map((_, i) => ({
        x: ev1[i] * scale1,
        y: ev2[i] * scale2
    }));
}


// --- API CALLS ---

async function getEmbedding(text) {
    for (let i = 0; i < 5; i++) { // More retries
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: { parts: [{ text: text.slice(0, 8000) }] }
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            return data.embedding.values;
        } catch (e) {
            console.log(`  Embedding error (attempt ${i+1}): ${e.message}`);
            // Exponential backoff: 5s, 10s, 20s, 40s...
            await sleep(5000 * Math.pow(2, i));
        }
    }
    return null;
}

async function getAttributes(text) {
    const prompt = `
    Analyze this essay. Return a JSON object with these scores (0.0 to 1.0).
    Be critical and precise.
    - technicality: (1.0 = code/math/hard-engineering, 0.0 = pure prose)
    - abstraction: (1.0 = philosophical/meta, 0.0 = concrete/anecdotal)
    - futurism: (1.0 = sci-fi/predictions, 0.0 = history/present)
    - personal: (1.0 = vulnerable/diary, 0.0 = objective/analysis)
    - optimism: (1.0 = utopian/hopeful, 0.0 = critical/dystopian)
    - density: (1.0 = concise/packed, 0.0 = rambling)

    ESSAY START:
    ${text.slice(0, 3000)}
    `;

    for (let i = 0; i < 5; i++) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            });
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            return JSON.parse(data.candidates[0].content.parts[0].text);
        } catch (e) {
            console.log(`  Attribute error (attempt ${i+1}): ${e.message}`);
            await sleep(5000 * Math.pow(2, i));
        }
    }
    // Fallback only if absolutely necessary, but try hard not to use it
    return null; 
}

// --- MAIN ---

async function generateGraphData() {
    console.log('Starting robust graph generation...');
    if (!fs.existsSync(CONTENT_DIR)) return;

    // Load existing data if any to resume
    let existingData = [];
    if (fs.existsSync(OUTPUT_FILE)) {
        try {
            existingData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
            console.log(`Loaded ${existingData.length} existing records.`);
        } catch (e) {
            console.log('Could not read existing file, starting fresh.');
        }
    }

    const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.mdx'));
    let essays = [];

    // Read all files
    for (const file of files) {
        const content = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
        const { data, content: body } = matter(content);
        
        // Find if we already have data for this file
        const slug = file.replace('.mdx', '');
        const existing = existingData.find(e => e.slug === slug);

        essays.push({
            slug,
            title: data.title,
            date: data.publishedAt,
            summary: data.summary,
            content: body,
            // Preserve existing expensive data
            embedding: existing?.embedding || null,
            attributes: existing?.attributes || null,
            pca: existing?.pca || null
        });
    }

    console.log(`Processing ${essays.length} essays...`);

    // Process sequentially
    for (let i = 0; i < essays.length; i++) {
        const essay = essays[i];
        let needsSave = false;

        // 1. Get Embedding if missing
        if (!essay.embedding) {
            console.log(`[${i+1}/${essays.length}] Fetching embedding for "${essay.title}"...`);
            const emb = await getEmbedding(essay.content);
            if (emb) {
                essay.embedding = emb;
                needsSave = true;
            }
            // Strict rate limit pacing
            await sleep(4000); 
        }

        // 2. Get Attributes if missing
        if (!essay.attributes) {
            console.log(`[${i+1}/${essays.length}] Fetching attributes for "${essay.title}"...`);
            const attrs = await getAttributes(essay.content);
            if (attrs) {
                essay.attributes = attrs;
                needsSave = true;
            }
            await sleep(4000);
        }

        // Save progress periodically
        if (needsSave) {
             // We save the WHOLE array with the new data
             // Note: We keep 'embedding' in the file during processing, but remove it for the final client build usually.
             // Here we keep it so we can resume. We can strip it in the client component or a separate build step.
             fs.writeFileSync(OUTPUT_FILE, JSON.stringify(essays, null, 2));
        }
    }

    // 3. Compute PCA (always recompute to account for new data)
    console.log('Computing PCA...');
    const validEssays = essays.filter(e => e.embedding);
    const validEmbeddings = validEssays.map(e => e.embedding);
    
    if (validEmbeddings.length > 2) {
        const coords = computePCA(validEmbeddings);
        
        // Normalize
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        coords.forEach(c => {
            minX = Math.min(minX, c.x);
            maxX = Math.max(maxX, c.x);
            minY = Math.min(minY, c.y);
            maxY = Math.max(maxY, c.y);
        });

        // Map PCA back to essays
        validEssays.forEach((essay, idx) => {
            const c = coords[idx];
            essay.pca = {
                x: 5 + ((c.x - minX) / (maxX - minX)) * 90,
                y: 5 + ((c.y - minY) / (maxY - minY)) * 90
            };
        });

        // Save final result with PCA
        
        // 1. Save Server-Side Vector Store (Full Data)
        const vectorStorePath = path.join(process.cwd(), 'src/data/vector-store.json');
        fs.writeFileSync(vectorStorePath, JSON.stringify(validEssays, null, 2));
        console.log(`Saved full vector store to ${vectorStorePath}`);

        // 2. Save Client-Side Graph Data (Stripped)
        const clientData = essays.map(e => ({
            slug: e.slug,
            title: e.title,
            date: e.date,
            summary: e.summary,
            attributes: e.attributes,
            pca: e.pca
            // Omit embedding and content
        }));

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(clientData, null, 2));
        console.log(`Saved client-ready graph data to ${OUTPUT_FILE}`);
    } else {
        console.log('Not enough embeddings to compute PCA.');
    }
}

generateGraphData();

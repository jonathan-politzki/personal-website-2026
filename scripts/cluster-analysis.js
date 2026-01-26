const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(process.cwd(), 'src/data/graph-data.json');
const VECTOR_STORE_FILE = path.join(process.cwd(), 'src/data/vector-store.json');
const API_KEY = 'AIzaSyAJ2rvTsjyPE651ysAVKab3Ixi1zZAqPpg'; 

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- MATH UTILS FOR K-MEANS ---

function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function kMeans(points, k, iterations = 50) {
    // 1. Initialize centroids randomly
    let centroids = [];
    for (let i = 0; i < k; i++) {
        centroids.push(points[Math.floor(Math.random() * points.length)]);
    }

    let clusters = Array(points.length).fill(0);

    for (let iter = 0; iter < iterations; iter++) {
        // 2. Assign points to nearest centroid
        let hasChanged = false;
        for (let i = 0; i < points.length; i++) {
            let minDist = Infinity;
            let bestCluster = 0;
            
            for (let j = 0; j < k; j++) {
                const d = distance(points[i], centroids[j]);
                if (d < minDist) {
                    minDist = d;
                    bestCluster = j;
                }
            }
            
            if (clusters[i] !== bestCluster) {
                clusters[i] = bestCluster;
                hasChanged = true;
            }
        }

        if (!hasChanged) break;

        // 3. Update centroids
        for (let j = 0; j < k; j++) {
            let sumX = 0, sumY = 0, count = 0;
            for (let i = 0; i < points.length; i++) {
                if (clusters[i] === j) {
                    sumX += points[i].x;
                    sumY += points[i].y;
                    count++;
                }
            }
            if (count > 0) {
                centroids[j] = { x: sumX / count, y: sumY / count };
            }
        }
    }

    return { clusters, centroids };
}

// --- LLM LABELING ---

async function labelCluster(essaysInCluster) {
    // Take top 5 titles to represent the cluster
    const titles = essaysInCluster.slice(0, 8).map(e => `"${e.title}"`).join(", ");
    
    const prompt = `
    Analyze this group of essay titles that were clustered together based on semantic similarity.
    
    Titles: ${titles}
    
    Task: Provide a highly specific, thematic label for this cluster (e.g., "AI Infrastructure", "Personal Philosophy", "Biotech Ventures").
    Avoid generic terms like "Technology" or "Miscellaneous".
    Return ONLY the label text (max 3 words).
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }] // Simplified request
            })
        });
        const data = await response.json();
        
        if (data.error) {
             throw new Error(data.error.message);
        }
        
        return data.candidates[0].content.parts[0].text.trim();
    } catch (e) {
        console.error("Labeling failed:", e.message);
        return "Unlabeled Cluster";
    }
}

// --- MAIN ---

async function generateClusters() {
    console.log('Reading graph data...');
    if (!fs.existsSync(OUTPUT_FILE)) {
        console.error("Graph data not found!");
        return;
    }

    const essays = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    
    // Extract points for K-Means (using PCA coordinates)
    // We filter out any that might be missing PCA data
    const points = essays.filter(e => e.pca).map(e => e.pca);
    
    if (points.length < 5) {
        console.error("Not enough data points for clustering.");
        return;
    }

    // Determine K (Number of Clusters)
    // Heuristic: sqrt(N/2) usually works okay for small N
    const K = Math.max(3, Math.min(6, Math.floor(Math.sqrt(points.length / 2))));
    console.log(`Clustering ${points.length} items into ${K} clusters...`);

    const { clusters, centroids } = kMeans(points, K);

    // Group essays by cluster to generate labels
    let clusterGroups = Array(K).fill().map(() => []);
    essays.forEach((essay, i) => {
        if (essay.pca) {
            essay.cluster = clusters[i];
            clusterGroups[clusters[i]].push(essay);
        }
    });

    // Generate Labels
    console.log("Generating cluster labels with Gemini...");
    let clusterLabels = [];
    
    // Process sequentially with robust backoff
    for (let i = 0; i < K; i++) {
        if (clusterGroups[i].length > 0) {
            let label = `Cluster ${i+1}`; // Default fallback
            
            // Retry loop
            for(let attempt = 0; attempt < 5; attempt++) {
                try {
                    const result = await labelCluster(clusterGroups[i]);
                    if (result && !result.includes("Unlabeled")) {
                        label = result;
                        break; // Success
                    }
                } catch(e) {
                    console.log(`Retry ${attempt+1} for Cluster ${i}...`);
                    // Very aggressive backoff for free tier
                    await sleep(30000 * (attempt + 1)); 
                }
            }
            
            clusterLabels[i] = label;
            console.log(`Cluster ${i} (${clusterGroups[i].length} items): ${label}`);
            await sleep(15000); // Standard spacing between successful calls
        } else {
            clusterLabels[i] = "Empty";
        }
    }

    // Save Updated Data
    // We update BOTH the client graph file AND the vector store so they stay in sync
    
    // 1. Update Client Graph Data
    const updatedGraphData = essays.map(e => ({
        ...e,
        clusterLabel: clusterLabels[e.cluster]
    }));
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(updatedGraphData, null, 2));
    console.log(`Updated ${OUTPUT_FILE}`);

    // 2. Update Vector Store (if it exists)
    if (fs.existsSync(VECTOR_STORE_FILE)) {
        const vectorStore = JSON.parse(fs.readFileSync(VECTOR_STORE_FILE, 'utf8'));
        const updatedVectorStore = vectorStore.map(e => {
            // Find matching essay in updatedGraphData to get cluster info
            const match = updatedGraphData.find(g => g.slug === e.slug);
            if (match) {
                return {
                    ...e,
                    cluster: match.cluster,
                    clusterLabel: match.clusterLabel
                };
            }
            return e;
        });
        fs.writeFileSync(VECTOR_STORE_FILE, JSON.stringify(updatedVectorStore, null, 2));
        console.log(`Updated ${VECTOR_STORE_FILE}`);
    }
}

generateClusters();

import fs from 'fs';
import path from 'path';
import WritingGraphClient from "@/components/writing-graph-client";

export default function WritingGraphPage() {
  // Read the pre-computed graph data
  const dataPath = path.join(process.cwd(), 'src/data/graph-data.json');
  let posts = [];
  
  if (fs.existsSync(dataPath)) {
    try {
        const fileContent = fs.readFileSync(dataPath, 'utf8');
        posts = JSON.parse(fileContent);
    } catch (e) {
        console.error("Failed to parse graph data", e);
    }
  }

  // Fallback if data is missing (e.g. during first build)
  if (!posts.length) {
     // ... fallback logic or empty state
  }

  return <WritingGraphClient posts={posts} />;
}

import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src/content/projects');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!content.includes('status:')) {
    let status = 'concluded';
    if (file === 'pool-of-madness.md' || file === 'scribble-app.md') {
      status = 'active';
    }
    
    // Insert status after the first ---
    content = content.replace(/^---\n/, `---\nstatus: "${status}"\n`);
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file} with status: ${status}`);
  }
}

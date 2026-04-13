const fs = require('fs');
const path = require('path');

const repos = [
  { file: 'article-recognition.md', repo: 'nukeknurs/Article_recognition' },
  { file: 'castle-stalker.md', repo: 'nukeknurs/Castle-Stalker' },
  { file: 'dark-window.md', repo: 'nukeknurs/Dark-Window' },
  { file: 'wearos-skin-scaler.md', repo: 'Saderius/WearOS-Skin-Scaler' }
];

async function run() {
  for (const { file, repo } of repos) {
    console.log(`Checking ${repo}...`);
    let readme = null;
    let branch = 'main';
    
    try {
      let res = await fetch(`https://raw.githubusercontent.com/${repo}/main/README.md`, { signal: AbortSignal.timeout(5000) });
      if (res.ok) {
        readme = await res.text();
      } else {
        res = await fetch(`https://raw.githubusercontent.com/${repo}/master/README.md`, { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          readme = await res.text();
          branch = 'master';
        }
      }
    } catch (e) {
      console.error(`Error fetching ${repo}: ${e.message}`);
    }
    
    if (readme) {
      // Look for ![alt](url) or <img src="url">
      const mdImgRegex = /!\[.*?\]\((.*?)\)/;
      const htmlImgRegex = /<img.*?src="(.*?)".*?>/;
      
      let match = readme.match(mdImgRegex);
      if (!match) match = readme.match(htmlImgRegex);
      
      if (match) {
        let imgUrl = match[1];
        // Handle relative URLs
        if (!imgUrl.startsWith('http')) {
          if (imgUrl.startsWith('./')) imgUrl = imgUrl.slice(2);
          if (imgUrl.startsWith('/')) imgUrl = imgUrl.slice(1);
          imgUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${imgUrl}`;
        }
        console.log(`Found image for ${repo}: ${imgUrl}`);
        
        // Update the markdown file
        const filePath = path.join(__dirname, 'src/content/projects', file);
        let content = fs.readFileSync(filePath, 'utf8');
        if (!content.includes('imageUrl:')) {
          content = content.replace('---', `---\nimageUrl: "${imgUrl}"`);
          fs.writeFileSync(filePath, content);
          console.log(`Updated ${file}`);
        } else {
          content = content.replace(/imageUrl:.*?\n/, `imageUrl: "${imgUrl}"\n`);
          fs.writeFileSync(filePath, content);
          console.log(`Updated ${file} (replaced existing)`);
        }
      } else {
        console.log(`No image found in README for ${repo}`);
      }
    } else {
      console.log(`Could not fetch README for ${repo}`);
    }
  }
}

run();

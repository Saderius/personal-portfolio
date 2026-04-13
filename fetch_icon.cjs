const https = require('https');

https.get('https://play.google.com/store/apps/details?id=com.twentyminCode.scribble', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const matches = data.match(/https:\/\/play-lh\.googleusercontent\.com\/[^"]*/g);
    if (matches) {
      // Print unique matches
      const unique = [...new Set(matches)];
      console.log(unique.slice(0, 10).join('\n'));
    }
  });
}).on('error', (err) => {
  console.error(err);
});

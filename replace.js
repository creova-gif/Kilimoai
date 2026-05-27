const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('app');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const orig = content;
  content = content.replace(/fontFamily:\s*'\s*Inter_900Black\s*'/g, "fontFamily: 'InstrumentSerif_400Regular'");
  
  if (orig !== content) {
    fs.writeFileSync(file, content);
  }
});
console.log('Replaced fonts.');

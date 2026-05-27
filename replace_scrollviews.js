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
let modifiedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const orig = content;
  
  // Replace <ScrollView ...> by injecting showsVerticalScrollIndicator={false}
  content = content.replace(/<ScrollView(\s+[^>]*?)>/g, (match, attrs) => {
    let newAttrs = attrs;
    if (!newAttrs.includes('showsVerticalScrollIndicator')) {
      newAttrs = ' showsVerticalScrollIndicator={false}' + newAttrs;
    }
    if (newAttrs.includes('horizontal') && !newAttrs.includes('showsHorizontalScrollIndicator')) {
      newAttrs = ' showsHorizontalScrollIndicator={false}' + newAttrs;
    }
    return `<ScrollView${newAttrs}>`;
  });

  // Replace <FlatList ...> by injecting showsVerticalScrollIndicator={false}
  content = content.replace(/<FlatList(\s+[^>]*?)>/g, (match, attrs) => {
    let newAttrs = attrs;
    if (!newAttrs.includes('showsVerticalScrollIndicator')) {
      newAttrs = ' showsVerticalScrollIndicator={false}' + newAttrs;
    }
    if (newAttrs.includes('horizontal') && !newAttrs.includes('showsHorizontalScrollIndicator')) {
      newAttrs = ' showsHorizontalScrollIndicator={false}' + newAttrs;
    }
    return `<FlatList${newAttrs}>`;
  });

  if (orig !== content) {
    fs.writeFileSync(file, content);
    modifiedCount++;
  }
});
console.log(`Modified ${modifiedCount} files for scrollviews.`);

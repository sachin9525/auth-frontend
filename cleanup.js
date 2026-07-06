const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  content = content.replace(/dark:text-slate-500 dark:text-slate-400/g, 'dark:text-slate-400');
  content = content.replace(/dark:hover:text-slate-900 dark:hover:text-white/g, 'dark:hover:text-white');
  content = content.replace(/dark:hover:text-slate-900 dark:text-white/g, 'dark:hover:text-white');
  content = content.replace(/dark:hover:text-slate-900/g, 'dark:hover:text-white');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Cleaned up:', file);
  }
});
console.log('Cleanup Done.');

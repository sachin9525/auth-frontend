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

const replacements = [
  { regex: /\btext-white\b/g, replacement: 'text-slate-900 dark:text-white' },
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, (match) => {
      // Avoid "dark:text-white" being replaced into "dark:text-slate-900 dark:text-white"
      return replacement;
    });
  });
  
  // Fix double replacements
  content = content.replace(/text-slate-900 dark:text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white');
  content = content.replace(/dark:text-slate-900 dark:text-white/g, 'dark:text-white');
  
  // Fix specific cases where we want text-white:
  // 1. Dashboard active tab: "bg-brand text-slate-900 dark:text-white shadow-lg"
  content = content.replace(/"bg-brand text-slate-900 dark:text-white shadow-lg"/g, '"bg-brand text-white shadow-lg"');
  // 2. UI Logo: <ShieldCheck className="w-4 h-4 text-slate-900 dark:text-white" />
  content = content.replace(/<ShieldCheck className="w-4 h-4 text-slate-900 dark:text-white" \/>/g, '<ShieldCheck className="w-4 h-4 text-white" />');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
});
console.log('Done.');

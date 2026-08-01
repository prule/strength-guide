const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configure marked to not sanitize, we trust our own markdown
marked.setOptions({
  gfm: true,
  breaks: true,
});

const siteDir = path.join(__dirname, 'site');
if (!fs.existsSync(siteDir)) {
  fs.mkdirSync(siteDir);
}

const contentDir = path.join(__dirname, 'content');

// Read all content files
const files = fs.readdirSync(contentDir);
const mdFiles = files.filter(f => f.endsWith('.md'));

const template = (title, content, nextProgram) => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="style.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=Archivo:wght@400..700&display=swap" rel="stylesheet">
<script src="support.js"></script>
</head>
<body>
<x-dc>
<div class="layout-container">
<div class="layout-inner">

<header>
  <a href="index.html" class="title">The Strength Archive</a>
  <nav>
    <a href="index.html#programs">&larr; All Programs</a>
  </nav>
</header>

<article data-screen-label="${title}">
  ${content}
</article>

<footer class="page-footer">
  <a href="index.html">
    <span class="label">&larr; Back to</span>
    <span class="title">Program Directory</span>
  </a>
  ${nextProgram ? `
  <a href="${nextProgram.href}" style="text-align:right">
    <span class="label">Next Program &rarr;</span>
    <span class="title">${nextProgram.title}</span>
  </a>` : '<div></div>'}
</footer>

</div>
</div>
</x-dc>
</body>
</html>`;

const order = [
  { id: 'starting_strength', title: 'Starting Strength', subtitle: 'Novice Barbell Program · No. 01' },
  { id: 'stronglifts_5x5', title: 'StrongLifts 5x5', subtitle: 'Novice Barbell Program · No. 02' },
  { id: 'texas_method', title: 'The Texas Method', subtitle: 'Intermediate Barbell Program · No. 03' },
  { id: 'horn_strength', title: 'Horn Strength', subtitle: 'Intermediate Barbell Program · No. 04' },
  { id: 'barbell_prescription', title: 'The Barbell Prescription', subtitle: 'Masters Barbell Program · No. 05' },
  { id: 'calisthenics_workout', title: 'Calisthenics', subtitle: 'Bodyweight Program · No. 06' },
  { id: 'low_impact_hiit', title: 'Low-Impact HIIT', subtitle: 'Conditioning · No. 07' }
];

mdFiles.forEach(file => {
  const id = path.basename(file, '.md');
  const program = order.find(p => p.id === id);
  if (!program) return;

  const currentIndex = order.indexOf(program);
  const nextProgram = currentIndex < order.length - 1 ? {
    href: order[currentIndex + 1].id + '.html',
    title: order[currentIndex + 1].title
  } : null;

  const markdown = fs.readFileSync(path.join(contentDir, file), 'utf8');
  
  // Custom pre-processing for title/subtitle
  // We'll strip the first # Header and replace it with our own branded header
  let processedMd = markdown.replace(/^# (.*)\n+/, `<p class="article-label">${program.subtitle}</p>\n<h1>$1</h1>\n\n`);
  
  let html = marked.parse(processedMd);

  // Convert Community & Resources into an aside/blockquote
  html = html.replace(/<h2[^>]*>Community &amp; Resources<\/h2>\s*<ul>([\s\S]*?)<\/ul>/g, '<blockquote><p>Community &amp; Resources</p><ul>$1</ul></blockquote>');

  // Convert Technique and Breathing into an aside/blockquote
  html = html.replace(/<h2[^>]*>Technique and Breathing<\/h2>\s*([\s\S]*?)(?=<h2)/g, '<blockquote><p>Technique and Breathing</p>$1</blockquote>');

  // Convert bold titles + lists into tables for workout grids
  html = html.replace(/<p><strong>([^<]+):?<\/strong><\/p>\s*<ul>([\s\S]*?)<\/ul>/g, (match, title, listItems) => {
    const rows = [];
    const itemRegex = /<li>(.*?)<\/li>/g;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(listItems)) !== null) {
      const itemContent = itemMatch[1]; 
      // If there's a colon, split it into exercise and reps
      const parts = itemContent.split(':');
      if (parts.length > 1) {
        const exercise = parts[0].trim();
        const reps = parts.slice(1).join(':').trim();
        rows.push(`<tr><td>${exercise}</td><td>${reps}</td></tr>`);
      } else {
        rows.push(`<tr><td>${itemContent}</td><td></td></tr>`);
      }
    }
    return `<table>
  <thead>
    <tr><th>${title.replace(/:$/, '')}</th><th></th></tr>
  </thead>
  <tbody>
    ${rows.join('\n    ')}
  </tbody>
</table>`;
  });

  // Group consecutive tables into workout-grids
  html = html.replace(/(<table[\s\S]*?<\/table>\s*)+/g, match => {
    const tableCount = (match.match(/<table/g) || []).length;
    if (tableCount > 1) {
      let gridClass = tableCount === 3 ? 'three-col' : '';
      return `<div class="workout-grid ${gridClass}">${match}</div>`;
    }
    return match;
  });

  const finalHtml = template(program.title, html, nextProgram);
  fs.writeFileSync(path.join(siteDir, id + '.html'), finalHtml);
  console.log(`Built ${id}.html`);
});

// Update index.html to include style.css instead of inline <style> block
const indexPath = path.join(siteDir, 'index.html');
if (fs.existsSync(indexPath)) {
  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  if (!indexHtml.includes('<link rel="stylesheet" href="style.css">')) {
    indexHtml = indexHtml.replace(/<style>.*?<\/style>/s, '<link rel="stylesheet" href="style.css">');
    fs.writeFileSync(indexPath, indexHtml);
    console.log('Updated index.html to use style.css');
  }
}

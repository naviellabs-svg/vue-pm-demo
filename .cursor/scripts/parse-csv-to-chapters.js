const fs = require('fs');
const path = require('path');

// Read CSV file
const csvPath = path.join(__dirname, '../docs/Masterclass_2024 - Steps (3).csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV (simple parser - handles quoted fields)
function parseCSV(content) {
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const row = {};
    let currentField = '';
    let inQuotes = false;
    let fieldIndex = 0;
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row[headers[fieldIndex]] = currentField.trim();
        currentField = '';
        fieldIndex++;
      } else {
        currentField += char;
      }
    }
    
    // Add last field
    if (fieldIndex < headers.length) {
      row[headers[fieldIndex]] = currentField.trim();
    }
    
    if (Object.keys(row).length > 0) {
      rows.push(row);
    }
  }
  
  return rows;
}

const rows = parseCSV(csvContent);

// Group by phase and step
const chapters = {};
for (const row of rows) {
  const phase = parseInt(row.phase);
  const step = parseInt(row.step);
  
  if (!phase || !step) continue;
  
  if (!chapters[phase]) {
    chapters[phase] = {
      name: row.phase_name || `Chapter ${phase}`,
      lessons: {}
    };
  }
  
  if (!chapters[phase].lessons[step]) {
    chapters[phase].lessons[step] = {
      title: row.phase_name || `Lesson ${phase}.${step}`,
      tasks: []
    };
  }
  
  chapters[phase].lessons[step].tasks.push({
    location: row.location,
    task: row.Task,
    note: row.Note
  });
}

// Generate markdown files
const docsDir = path.join(__dirname, '../docs');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

for (const [phaseNum, chapter] of Object.entries(chapters)) {
  const chapterNum = parseInt(phaseNum);
  let content = `# Chapter ${chapterNum}: ${chapter.name}\n\n`;
  
  // Sort lessons by step number
  const lessonNumbers = Object.keys(chapter.lessons).map(Number).sort((a, b) => a - b);
  
  for (const stepNum of lessonNumbers) {
    const lesson = chapter.lessons[stepNum];
    
    // Get unique lesson title (first non-empty phase_name for this lesson)
    const lessonTitle = lesson.tasks[0]?.task || `Lesson ${chapterNum}.${stepNum}`;
    
    content += `## Lesson ${chapterNum}.${stepNum} - ${lessonTitle}\n\n`;
    content += `> **Purpose:** [To be filled from lesson content]\n\n`;
    content += `### Overview\n\n`;
    content += `[Summary of what this lesson covers]\n\n`;
    content += `---\n\n`;
    
    // Group tasks by location
    const tasksByLocation = {};
    for (const task of lesson.tasks) {
      const loc = task.location || 'General';
      if (!tasksByLocation[loc]) {
        tasksByLocation[loc] = [];
      }
      tasksByLocation[loc].push(task);
    }
    
    let stepCounter = 1;
    for (const [location, tasks] of Object.entries(tasksByLocation)) {
      content += `### Step ${stepCounter}: ${location}\n\n`;
      
      if (location && !location.includes('Terminal') && !location.includes('vscode') && !location.includes('Chrome') && !location.includes('supbase') && !location.includes('Console') && !location.includes('Github') && !location.includes('vueschool')) {
        content += `**File:** \`${location}\`\n\n`;
      }
      
      content += `> **Purpose:** [What this step achieves]\n\n`;
      content += `#### Tasks\n\n`;
      
      for (const task of tasks) {
        content += `- [ ] ${task.task}\n`;
        if (task.note && task.note.trim()) {
          // Check if note contains code
          if (task.note.includes('<script') || task.note.includes('import') || task.note.includes('const ') || task.note.includes('export ')) {
            content += `\n\`\`\`typescript\n${task.note}\n\`\`\`\n\n`;
          } else {
            content += `  - ${task.note}\n`;
          }
        }
      }
      
      content += `\n---\n\n`;
      stepCounter++;
    }
  }
  
  const filename = `chapter-${chapterNum}.md`;
  const filepath = path.join(docsDir, filename);
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`Created ${filename}`);
}

console.log(`\nGenerated ${Object.keys(chapters).length} chapter files`);

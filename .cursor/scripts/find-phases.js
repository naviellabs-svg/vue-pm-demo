const fs = require('fs');
const path = require('path');

// Read CSV file
const csvPath = path.join(__dirname, '../docs/masterclass-steps-full.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV and extract unique phases
const lines = csvContent.split('\n');
const phases = new Set();

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  
  // Simple CSV parsing - find phase number (second column)
  const parts = lines[i].split(',');
  if (parts.length >= 2) {
    const phase = parts[1].trim();
    // Check if it's a number
    if (/^\d+$/.test(phase)) {
      phases.add(parseInt(phase));
    }
  }
}

const sortedPhases = Array.from(phases).sort((a, b) => a - b);

console.log('Unique phases found:', sortedPhases);
console.log('Total number of phases:', sortedPhases.length);

// Also get phase names
const phaseNames = {};
for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  
  const parts = lines[i].split(',');
  if (parts.length >= 2) {
    const phase = parts[1].trim();
    const phaseName = parts[0].trim().replace(/^"|"$/g, '');
    
    if (/^\d+$/.test(phase)) {
      const phaseNum = parseInt(phase);
      if (!phaseNames[phaseNum] && phaseName && phaseName !== '') {
        phaseNames[phaseNum] = phaseName;
      }
    }
  }
}

console.log('\nPhase names:');
sortedPhases.forEach(phase => {
  console.log(`Phase ${phase}: ${phaseNames[phase] || 'Unknown'}`);
});

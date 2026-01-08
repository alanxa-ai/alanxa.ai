const fs = require('fs');
const p = 'e:/Alanxa/client/src/pages/AdminDashboard.jsx';

try {
    let content = fs.readFileSync(p, 'utf8');
    const lines = content.split('\n');
    let fixed = false;

    // Look for the orphan )} around line 726
    for (let i = 720; i < 740; i++) {
        const line = lines[i];
        if (line && line.trim() === ')}') {
            // Verify context - previous line should be a button closing
            const prevLine = lines[i - 1];
            if (prevLine && prevLine.trim().endsWith('</button>')) {
                console.log(`Found orphan brace at line ${i + 1}: "${line}"`);
                lines.splice(i, 1); // Remove lines[i]
                fixed = true;
                break;
            }
        }
    }

    if (fixed) {
        fs.writeFileSync(p, lines.join('\n'));
        console.log('Successfully removed orphan brace.');
    } else {
        console.log('Orphan brace not found in expected range.');
        // Debug output
        for (let i = 720; i < 740; i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
    }
} catch (e) {
    console.error('Error:', e);
}

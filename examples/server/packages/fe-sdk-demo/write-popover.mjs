import fs from 'fs';

const mainContent = fs.readFileSync('./docs/assets/main.js', 'utf8');
const popoverContent = fs.readFileSync('./popover.js', 'utf8');

fs.writeFileSync('./docs/assets/main.js', `${mainContent}\n;${popoverContent}`);

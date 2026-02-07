const fs = require('fs');
const { execSync } = require('child_process');

// 1. Get the Current Version and Date
const packageJson = require('../package.json');
const version = packageJson.version;
const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

// 2. Get the Git Log (Commit history since last tag)
let changelog = "";
try {
  // Get the last tag before the current one to diff against
  const lastTag = execSync('git describe --tags --abbrev=0 HEAD^').toString().trim();
  // Get messages from that tag to now
  changelog = execSync(`git log ${lastTag}..HEAD --pretty=format:"* %s"`).toString();
} catch (e) {
  changelog = "* Initial release or no changes detected.";
}

// 3. Construct the Markdown Content
// (This matches the exact format you asked for)
const notes = `
<img width="192" height="192" alt="ic_launcher" src="https://github.com/user-attachments/assets/34d7a81b-b50a-46b8-93f9-137ad3d9991b" />

# Changelog

## [${version}] - ${date}

### 🚀 Added and Fixed
${changelog}
`;

// 4. Write to file
fs.writeFileSync('release-notes.md', notes);
console.log("✅ release-notes.md generated successfully!");
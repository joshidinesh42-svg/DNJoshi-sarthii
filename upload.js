const { execSync } = require('child_process');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

const remoteUrl = "https://github.com/joshidinesh42-svg/DNJoshi-sarthii.git";
const portableGitPath = "C:\\Users\\rnfle\\.gemini\\antigravity-ide\\brain\\086937a0-182f-49e1-872e-d0d77b8552de\\scratch\\git\\cmd\\git.exe";

// Determine which Git binary to use
let gitBin = "git";
try {
  execSync('git --version', { stdio: 'ignore' });
} catch (e) {
  if (fs.existsSync(portableGitPath)) {
    gitBin = `"${portableGitPath}"`;
  } else {
    console.error("Git is not installed on this system, and the portable version was not found.");
    process.exit(1);
  }
}

console.log(`Using Git client: ${gitBin}`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("\n=======================================================");
console.log("    Sarthii Travels GitHub Repository Uploader         ");
console.log("=======================================================\n");

rl.question('Please enter your GitHub Personal Access Token (PAT): ', (token) => {
  if (!token.trim()) {
    console.log('Token cannot be empty.');
    rl.close();
    process.exit(1);
  }

  try {
    // 1. Initialize repository if not done
    console.log("\n1. Initializing Git repository...");
    execSync(`${gitBin} init`, { stdio: 'inherit' });

    // 2. Set user credentials locally for this commit
    console.log("\n2. Configuring local Git identity...");
    execSync(`${gitBin} config user.name "Sarthii Travels Deployer"`, { stdio: 'inherit' });
    execSync(`${gitBin} config user.email "deployer@sarthiitravels.com"`, { stdio: 'inherit' });

    // 3. Set authenticated remote origin
    const authenticatedUrl = remoteUrl.replace("https://", `https://${token.trim()}@`);
    console.log("\n3. Configuring authenticated remote origin...");
    
    let remotes = "";
    try {
      remotes = execSync(`${gitBin} remote`).toString();
    } catch (e) {}

    if (remotes.includes("origin")) {
      execSync(`${gitBin} remote set-url origin "${authenticatedUrl}"`, { stdio: 'inherit' });
    } else {
      execSync(`${gitBin} remote add origin "${authenticatedUrl}"`, { stdio: 'inherit' });
    }

    // 4. Add all files
    console.log("\n4. Staging files...");
    execSync(`${gitBin} add -A`, { stdio: 'inherit' });

    // 5. Commit changes
    console.log("\n5. Creating commit...");
    try {
      execSync(`${gitBin} commit -m "Configure static file server for Hostinger deployment, remove secondary header banner, and beautify FAQ page"`, { stdio: 'inherit' });
    } catch (e) {
      console.log("Nothing to commit or commit already up to date.");
    }

    // 6. Rename branch to main
    execSync(`${gitBin} branch -M main`, { stdio: 'inherit' });

    // 7. Push to remote
    console.log("\n6. Pushing files to GitHub repository...");
    execSync(`${gitBin} push -u origin main --force`, { stdio: 'inherit' });
    
    console.log("\n=======================================================");
    console.log("SUCCESS! All files have been uploaded to your GitHub repository.");
    console.log("You can now connect this repository to Hostinger for automatic deployment!");
    console.log("=======================================================");

  } catch (error) {
    console.error("\nAn error occurred during upload:");
    console.error(error.message);
  } finally {
    rl.close();
  }
});

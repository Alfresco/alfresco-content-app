#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const [ version ] = args;

if (!version || args.length < 1) {
  console.error('Error: missing version parameter');
  process.exit(1);
}

function updateProjectVersion(packageFile, targetVersion) {
  if (fs.existsSync(packageFile) && targetVersion) {
    const packageJson = JSON.parse(fs.readFileSync(packageFile));

    if (packageJson['version'] !== targetVersion) {
      packageJson['version'] = targetVersion;

      console.log('updating:', packageFile);
      fs.writeFileSync(packageFile, JSON.stringify(packageJson, null, 2));
    }
  }
}

const appRootPackage = path.resolve(__dirname, '..', 'package.json');
updateProjectVersion(appRootPackage, version);

const projectsRoot = path.resolve(__dirname, '..', 'projects');
const folderEntries = fs.readdirSync(projectsRoot);

folderEntries.forEach(entryName => {
  const entryPath = path.join(projectsRoot, entryName);
  const entryInfo = fs.statSync(entryPath);

  if (entryInfo.isDirectory()) {
    const packagePath = path.join(entryPath, 'package.json');
    updateProjectVersion(packagePath, version);
  }
});

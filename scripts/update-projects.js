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

// Update root app.json
const appRootPackage = path.resolve(__dirname, '../package.json');
updateProjectVersion(appRootPackage, version);

// Update all projects
const projectsRoot = path.resolve(__dirname, '../projects');
const folderEntries = fs.readdirSync(projectsRoot);

folderEntries.forEach(entryName => {
  const entryPath = path.join(projectsRoot, entryName);
  const entryInfo = fs.statSync(entryPath);

  if (entryInfo.isDirectory()) {
    const packagePath = path.join(entryPath, 'package.json');
    updateProjectVersion(packagePath, version);
  }
});

// Update app.config.json
const appConfigPath = path.resolve(__dirname, '../src/app.config.json');
const appConfigJson = JSON.parse(fs.readFileSync(appConfigPath));

if (appConfigJson['application']['version'] !== version) {
  appConfigJson['application']['version'] = version;
  console.log('updating:', appConfigPath);
  fs.writeFileSync(appConfigPath, JSON.stringify(appConfigJson, null, 2));
}

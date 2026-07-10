function inDays(d1, d2) {
  return Math.floor((d2.getTime() - d1.getTime()) / (24 * 3600 * 1000));
}

module.exports = async ({ dependencyName, tag }) => {
  tag = tag || 'alpha';
  const organization = 'alfresco';
  const dependencyFullName = `@${organization}/${dependencyName}`;
  const pkg = require('../../../package.json');

  const localVersion = pkg.dependencies[dependencyFullName];

  const response = await fetch(`https://registry.npmjs.org/${dependencyFullName}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${dependencyFullName} from npm registry: ${response.status}`);
  }
  const metadata = await response.json();

  const matchedPkgVersion = metadata['dist-tags']?.[tag];
  const times = metadata.time || {};

  if (!matchedPkgVersion || localVersion === matchedPkgVersion) {
    return { hasNewVersion: 'false' };
  }

  let rangeInDays = 'N/A';
  if (times[localVersion] && times[matchedPkgVersion]) {
    rangeInDays = inDays(new Date(times[localVersion]), new Date(times[matchedPkgVersion]));
  }
  return { hasNewVersion: 'true', remoteVersion: { name: matchedPkgVersion, rangeInDays }, localVersion };
};

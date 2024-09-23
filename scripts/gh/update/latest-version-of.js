function inDays(d1, d2) {
  return Math.floor((d2.getTime() - d1.getTime()) / (24 * 3600 * 1000));
}

module.exports = async ({ exec, github, dependencyName, tag }) => {
  tag = tag || 'alpha';
  const organization = 'alfresco';
  const dependencyFullName = `@${organization}/${dependencyName}`;
  const pkg = require('../../../package.json');

  const localVersion = pkg.dependencies[dependencyFullName];

  const { data: availablePackages } = await github.rest.packages.getAllPackageVersionsForPackageOwnedByOrg({
    package_type: 'npm',
    package_name: dependencyName,
    org: organization
  });

  const options = {};
  let packageDistTag = '';
  options.listeners = {
    stdout: (data) => {
      packageDistTag += data.toString();
    }
  };
  await exec.exec(`npm dist-tag ls @alfresco/${dependencyName}`, [], options);
  let matchedPkgVersion = '';
  const tagsType = packageDistTag.split('\n');
  for (const tagType of tagsType) {
    const tagSplit = tagType.split(':');
    if (tagSplit[0].trim() === tag) {
      matchedPkgVersion = tagSplit[1].trim();
      break;
    }
  }

  const latestPkgToUpdate = availablePackages.find((package) => package.name === matchedPkgVersion);

  if (localVersion === latestPkgToUpdate?.name) {
    return { hasNewVersion: 'false' };
  } else {
    const findLocalVersionOnRemote = availablePackages.find((package) => package.name === localVersion);
    let rangeInDays = 'N/A';
    if (findLocalVersionOnRemote !== undefined) {
      const creationLocal = new Date(findLocalVersionOnRemote.created_at);
      const creationLatest = new Date(latestPkgToUpdate.created_at);
      rangeInDays = inDays(creationLocal, creationLatest);
    }
    return { hasNewVersion: 'true', remoteVersion: { name: latestPkgToUpdate?.name, rangeInDays }, localVersion };
  }
};

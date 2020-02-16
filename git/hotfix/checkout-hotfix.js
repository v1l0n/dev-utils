const vln = require('../../node/functions');

let options = {};
let updateVersion;

/**
 * Create a new hotfix branch.
 */
vln.selectProject()
    .then(projectName => {
        options.cwd = `../${projectName}`;
        updateVersion = vln.updateVersion('patch', options);
        return vln.execPromise(`git checkout -b hotfix/v${updateVersion} master`, options);
    })
    .then(() => vln.execPromise(`npm version patch --no-git-tag-version`, options))
    .then(() => vln.execPromise(`git commit -a -m 'v${updateVersion}'`, options))
    .catch(error => vln.err(error));

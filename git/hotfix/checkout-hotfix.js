const { prompt } = require('inquirer');
const vln = require('../../node/functions');

let updateVersion;

/**
 * Create a new hotfix branch.
 */
vln.selectProject()
    .then(projectName => vln.execPromise(`cd ../${projectName}`))
    .then(() => {
        updateVersion = vln.updateVersion('patch');
        return vln.execPromise(`git checkout -b hotfix/v${updateVersion} master`)
    })
    .then(() => vln.execPromise(`npm version patch --no-git-tag-version`))
    .then(() => vln.execPromise(`git commit -a -m 'v${updateVersion}'`))
    .catch(error => vln.err(error));

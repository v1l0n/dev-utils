const packageJson = require('../../package.json');
const vln = require('../../node/functions');

let activeBranch;
let selectedBranch;

/**
 * Merge a feature branch into the 'develop' branch.
 */
vln.selectProject()
    .then(projectName => vln.execPromise(`cd ../${projectName}`))
    .then(() => vln.getActiveBranchName())
    .then(activeBranchName => {
        activeBranch = activeBranchName;
        return vln.selectBranch(activeBranchName, 'hotfix');
    })
    .then(selectedBranchName => {
        selectedBranch = selectedBranchName;
        return vln.execPromise('git checkout develop');
    })
    .then(() => vln.execPromise(`git merge --no-ff ${selectedBranch}`))
    .then(() => vln.execPromise('git checkout master'))
    .then(() => vln.execPromise(`git merge --no-ff ${selectedBranch}`))
    .then(() => vln.execPromise(`git tag -a v${packageJson.version} -m 'v${packageJson.version}'`))
    .then(() => vln.execPromise(`git checkout ${activeBranch}`))
    .catch(error => vln.err(error));

const vln = require('../../node/functions');

let options = {};
let activeBranch;
let selectedBranch;

/**
 * Merge a feature branch into the 'develop' branch.
 */
vln.selectProject()
    .then(projectName => {
        options.cwd = `../${projectName}`;
        return vln.getActiveBranchName(options);
    })
    .then(activeBranchName => {
        activeBranch = activeBranchName;
        return vln.selectBranch(activeBranchName, 'hotfix', options);
    })
    .then(selectedBranchName => {
        selectedBranch = selectedBranchName;
        return vln.execPromise('git checkout develop', options);
    })
    .then(() => vln.execPromise(`git merge --no-ff ${selectedBranch}`, options))
    .then(() => vln.execPromise('git checkout master', options))
    .then(() => vln.execPromise(`git merge --no-ff ${selectedBranch}`, options))
    .then(() => {
        const packageJson = require(`${options.cwd}/package.json`);
        return vln.execPromise(`git tag -a v${packageJson.version} -m 'v${packageJson.version}'`, options);
    })
    .then(() => vln.execPromise(`git checkout ${activeBranch}`, options))
    .catch(error => vln.err(error));

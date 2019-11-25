const { prompt } = require('inquirer');
const vln = require('../../node/functions');

let activeBranch;
let selectedBranch;

vln.selectProject()
    .then(projectName => vln.execPromise(`cd ../${projectName}`))
    .then(() => vln.getActiveBranchName())
    .then(activeBranchName => {
        activeBranch = activeBranchName;
        return vln.selectBranch(activeBranchName, 'feature');
    })
    .then(selectedBranchName => {
        selectedBranch = selectedBranchName;
        return vln.execPromise('git checkout develop')
    })
    .then(() => vln.execPromise(`git merge --no-ff ${selectedBranch}`))
    .then(() => prompt([{
        type: 'confirm',
        name: 'pushDevelop',
        message: `push 'develop' branch to remote origin`
    }]))
    .then(answer => (answer.pushDevelop) ? vln.execPromise('git push') : null)
    .then(() => vln.execPromise(`git checkout ${activeBranch}`))
    .catch(error => vln.err(error));

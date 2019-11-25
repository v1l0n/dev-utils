const { exec } = require('child_process');
const { readdirSync } = require('fs');
const { prompt } = require('inquirer');
const chalk = require('chalk');

exports.log = function log(message, type='info') {
    let logHeader = chalk.blue('[VLN] ');

    switch (type) {
        case 'error':
            logHeader += chalk.red('ERR!');
            break;
        case 'warning':
            logHeader += chalk.yellow('WARN');
            break;
        default:
            logHeader += chalk.black.bgWhite('INFO');
            break;
    }

    console.log(`${logHeader} ${message}`);
}

exports.warn = (message) => this.log(message, 'waring');

exports.err = (message) => this.log(message, 'error');

exports.selectProject = () => {
    const projectList = readdirSync('../', { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    switch(projectList.length) {
        case 0:
            this.err('No project available');
            return new Promise ((resolve, reject) => reject('No project available in the directory'));
        case 1:
            return prompt([{
                type: 'confirm',
                name: 'useSingleProject',
                message: `Use '${projectList[0]}'`
            }])
                .then(answer => new Promise ((resolve, reject) => {
                    return (answer.useSingleProject) ? resolve(projectList[0]) : reject('No project selected');
                }));
        default:
            return prompt([{
                type: 'list',
                name: 'project',
                message: 'Select project',
                choices: projectList
            }]).then(answer => answer.project);
    }
}

exports.getActiveBranchName = () => new Promise((resolve, reject) => {
    exec('git rev-parse --abbrev-ref HEAD', (error, stdout, stderr) => {

        if (error) {
            this.err(stderr);
            reject(stderr);
        }

        resolve(stdout);
    });
});

exports.selectBranch = (activeBranchName, filter) => getBranchList(filter).then(branchList => {

    if (filter == null || activeBranchName.startsWith(filter)) {
        return prompt([{
            type: 'confirm',
            name: 'useActiveBranch',
            message: `Use '${activeBranchName}'`
        }])
            .then(answer => {
                if (answer.useActiveBranch) {
                    return new Promise((resolve, reject) => resolve(activeBranchName));
                } else {

                    if(branchList.length > 1) {
                        return vln.promptBranches(branchList);
                    } else {
                        return new Promise((resolve, reject) => reject('No branch selected'));
                    }
                }
            });
    } else {
        return vln.promptBranches(branchList)
    }
});

exports.selectFeatureBranch = () => this.selectBranch('feature');

exports.execPromise = (command) => new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {

        if (error) {
            this.err(stderr);
            reject(stderr);
        }

        resolve(stdout);
    });
});

getBranchList = (filter) => this.execPromise('git branch -a')
    .then(stdout => stdout
        .split('\n')
        .map(branch => (branch.substring(0, 2) == '* ') ? 
            branch.slice(- branch.length + 2) : 
            branch.trim()
        )
    );
// getBranchList = (filter) => new Promise((resolve, reject) => {
//     exec('git branch -a', (error, stdout, stderr) => {

//         if (error) {
//             this.err(stderr);
//             reject(stderr);
//         }

//         const branchList = stdout.split('\n').map(branch => (branch.substring(0, 2) == '* ') ? branch.slice(- branch.length + 2) : branch.trim());
//         resolve((filter == null) ? branchList : branchList.filter(branch => branch.startsWith(filter)))
//     });
// });

promptBranches = (branchList) => {

    switch(branchList.length) {
        case 0:
            this.err('No branch available');
            return new Promise ((resolve, reject) => reject('No branch available in the repository'));
        case 1:
            return prompt([{
                type: 'confirm',
                name: 'useSingleBranch',
                message: `Use '${branchList[0]}'`
            }])
                .then(answer => new Promise ((resolve, reject) => {
                    return (answer.useSingleBranch) ? resolve(branchList[0]) : reject('No branch selected');
                }));
        default:
            return prompt([{
                type: 'list',
                name: 'branch',
                message: 'Select branch',
                choices: branchList
            }]).then(answer => answer.branch);
    }
}

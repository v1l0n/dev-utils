const { prompt } = require('inquirer');
const vln = require('../../node/functions');

let updateType;
let updateVersion;

/**
 * Create a new release branch.
 */
vln.selectProject()
    .then(projectName => vln.execPromise(`cd ../${projectName}`))
    .then(() => prompt([{
        type: 'input',
        name: 'version',
        message: '(M)ajor or (m)inor version? [M/m]'
    }]))
    .then(answer => {

        switch (answer.version) {
            case 'M':
                updateType = 'major';
                break;
            case 'm':
                updateType = 'minor';
                break;
            default:
                return new Promise((resolve, reject) => reject('Not a version'))
        }

        updateVersion = vln.updateVersion(updateType);
        return vln.execPromise(`git checkout -b release/v${updateVersion} develop`);
    })
    .then(() => vln.execPromise(`npm version ${updateType} --no-git-tag-version`))
    .then(() => vln.execPromise(`git commit -a -m 'v${updateVersion}'`))
    .catch(error => vln.err(error));

const { exec } = require('child_process');
const { prompt } = require('inquirer');
const vln = require('../../node/functions');

/**
 * Create a new feature branch.
 */
vln.selectProject()
    .then(projectName => vln.execPromise(`cd ../${projectName}`))
    .then(() => prompt([{
            type: 'input',
            name: 'feature',
            message: 'Name your feature'
    }]))
    .then(answer => vln.execPromise(`git checkout -b feature/${answer.feature} develop`))
    .catch(error => vln.err(error));

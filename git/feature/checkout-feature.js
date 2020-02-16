const { exec } = require('child_process');
const { prompt } = require('inquirer');
const vln = require('../../node/functions');

let options = {};

/**
 * Create a new feature branch.
 */
vln.selectProject()
        .then(projectName => {
                options.cwd = `../${projectName}`;
                return prompt([{
                        type: 'input',
                        name: 'feature',
                        message: 'Name your feature'
                }])
        })
        .then(answer => vln.execPromise(`git checkout -b feature/${answer.feature} develop`, options))
        .catch(error => vln.err(error));

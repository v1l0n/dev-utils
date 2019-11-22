const { exec } = require('child_process');
const { existsSync, readdirSync } = require('fs');
const { prompt } = require('inquirer');
const vln = require('../node/functions');
const chalk = require('chalk');

/**
 * Create a new feature branch for the selected project.
 */

prompt([
    {
        type: 'list',
        name: 'project',
        message: 'Select project',
        choices: readdirSync('../', { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
    },
    {
        type: 'input',
        name: 'feature',
        message: 'Name your feature'
    },
])
    .then(answers => {

        exec(`cd ../${answers.project}`, (err, stdout, stderr) => {

            prompt([{
                type: 'confirm',
                name: 'checkout',
                message: `Create branch 'feature/${answers.feature}' for '${answers.project}' project`
            }])
                .then(answer => {

                    if (answer.checkout) {

                        exec(`git checkout -b feature/${answers.feature} develop`, (err, stdout, stderr) => {
            
                            if (stderr) {
                                vln.err(stderr);
                                return;
                            }

                            vln.log(`Branch 'feature/${answers.feature}' created.`);
                        });
                    } else {
                        vln.log(`Feature 'feature/${answers.feature}' checkout canceled.`);
                    }
                });
            // exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
            //     const activeBranch = stdout;

            //     exec('git checkout develop', (err, stdout, stderr) => {

            //         if (stderr) {
            //             console.log(chalk.blue('[VLN] ') + chalk.red('ERR! ') + 'Tasks | No \'develop\' branch.');
            //             return;
            //         }

            //         exec('git status --porcelain', (err, stdout, stderr) => {
    
            //             if (stdout) {
            //                 console.log(chalk.blue('[VLN] ') + chalk.red('ERR! ') + 'Tasks | \'develop\' branch unclean.');
            //                 exec(`git checkout ${activeBranch}`);
            //                 return;
            //             }

            //             console.log(chalk.blue('[VLN] ') + chalk.black.bgWhite('INFO ') + 'Tasks | \'develop\' branch unclean.');

            //         });
            //     });
            // });
        });
    });

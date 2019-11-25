const { exec } = require('child_process');
const { readdirSync } = require('fs');
const { prompt } = require('inquirer');
const vln = require('../../node/functions');

/**
 * Create a new feature branch for the selected project.
 */
vln.promptProjects().then(answer => {
    const projectName = answer.project;

    prompt([
        {
            type: 'input',
            name: 'feature',
            message: 'Name your feature'
        },
    ])
        .then(answer => {
            const featureName = answer.feature;

            exec(`cd ../${projectName}`, (err, stdout, stderr) => {

                prompt([{
                    type: 'confirm',
                    name: 'checkout',
                    message: `Create branch 'feature/${featureName}' for '${projectName}' project`
                }])
                    .then(answer => {

                        if (answer.checkout) {

                            exec(`git checkout -b feature/${featureName} develop`, (err, stdout, stderr) => {
                
                                if (err) {
                                    vln.err(stderr);
                                    return;
                                }

                                vln.log(stdout);
                            });
                        } else {
                            vln.log(`Checkout for branch 'feature/${featureName}' canceled.`);
                        }
                    });
            });
        });
});
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const csv = require('fast-csv');
require('dotenv').config();

const path = 'migration/csv/';

const csvToDB = async file => new Promise(resolve => {
  const answers = [];
  csv.parseFile(path + file, { headers: true, ignoreEmpty: true })
    .on('error', error => console.error(error))
    .on('data', row => {
      const answer = {
        ecosystem_name: row.ECOSYSTEM,
        skill_name: row.SKILL,
        skill_value: row.RATING,
        interested: row['I\'D LIKE TO LEARN'].toLowerCase(),
        comments: row.COMMENTS,
        skill_subvalue: 'neutral',
      };
      answers.push(answer);
    })
    .on('end', rowCount => {
      console.log(`Parsed ${rowCount} rows`);
      return resolve(answers);
    });
});

const userMigration = async email => new Promise(resolve => {
  fs.readdir(path, async (err, files) => {
    for await (const file of files) {
      const emailFile = file.split('.csv').join('');
      if (email.toLowerCase() === emailFile.toLowerCase()) {
        await csvToDB(file)
          .then(answers => {
            fs.unlinkSync(path + file);
            resolve(answers);
          })
          .catch(e => console.error(e));
        break;
      }
    }
  });
});

module.exports = userMigration;

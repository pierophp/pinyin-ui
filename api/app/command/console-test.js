const program = require('commander');
const RepositoryManager = require('../repository/database/RepositoryManager');
const Test = require('./test');

program.parse(process.argv);
console.log('manage 02');
console.log(RepositoryManager.getTransaction());
console.log('manage');
console.log(Test.getTest());
process.exit();




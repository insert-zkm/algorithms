const {join, parse, resolve} = require('path');
const { Test } = require('./utils.js');

const BASE = 'C:\\Users\\pqp\\Desktop\\prct\\laaksonen';

const norm = process.argv.slice(2);
const path_obj = parse(norm[0]);
if(path_obj.ext !== '.js') {
    throw new Error('File is not a .js');
}


const task = require(resolve(process.argv[1], join(BASE, norm[0])));

const t1 = new Test(task.solution, path_obj.name, task.parseIn, task.parseOut);
t1.runAllTests();
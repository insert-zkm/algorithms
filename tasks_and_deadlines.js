const {Test} = require('./utils.js');

/** 
 * https://cses.fi/problemset/task/1630
 * @param {[number, number][]} dds - tuple of durations and deadline 
 * @returns {number} - maximal revard for tasks */
function solution(dds) {
    dds.sort((atp, btp) => (atp[0] - btp[0]));

    return dds.reduce((reward, v, i) => 
        (reward + v[1] - (dds.length - i) * v[0]), 0);
}


function parse_in(rawStr) {
    const lines = rawStr.split('\n').map((ln) => ln.trim());
    lines.shift();
    const dds = lines.reduce((dt, v) => {
        const dds = v.split(' ');
        if(dds.length === 2) {
            dt.push(dds.map(Number));
        }

        return dt;
    },[]);
    return [dds];
}

const test = new Test(
    solution,
    __filename.slice(__dirname.length + 1, -3), 
    parse_in,
    (data) => {
        return Number(data);
    }
);

test.runAllTests();

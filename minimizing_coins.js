const { Test } = require("./utils");
const FILE_NAME = __filename.slice(__dirname.length + 1, -3);

/**
 * TODO: Rewrite to loops. Recursion cause call exced!!!
 * @param {number} target_sum - desired sum of money
 * @param {number[]} coins - distinct value of each coin
 * @returns {number} - minimum number of coins to get `target_sum`.
 * If sum it is not possible to reach returns -1
 */
function solution(target_sum, coins) {
    const table = Array.from({length: target_sum + 1}, () => (Infinity));
    table[0] = 0;
    for(let i = 0; i < coins.length; i++)
        for(let i_table = coins[i]; i_table <= target_sum; i_table++)
            table[i_table] = Math.min(table[i_table], table[i_table - coins[i]] + 1);
    return isFinite(table[target_sum]) ? table[target_sum] : -1;
}

function parse_in(rawStr) {
    const lines = rawStr.split('\n').map((ln) => ln.trim());
    const target_sum = Number(lines[0].split(' ').pop());
    const coins = lines[1].split(' ').map(Number);
    return [target_sum, coins];
}
function parse_out(rawStr) {
    return Number(rawStr);
}

const ts = new Test(solution, FILE_NAME, parse_in, parse_out);
ts.runAllTests();
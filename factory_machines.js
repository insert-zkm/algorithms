const { Test } = require("./utils");
const FILE_NAME = __filename.slice(__dirname.length + 1, -3);
/**
 * https://cses.fi/problemset/task/1620
 * @param {BigInt} total_products 
 * @param {BigInt[]} machines_capacity 
 * @returns {BigInt} - minimum time to make total_protucts
 */
function solution_v2(total_products, machines_capacity) {

    function valid(time) {
        let product_amount = 0n;
        for(let i = 0; i < machines_capacity.length; i++) {
            product_amount += time / machines_capacity[i];
            if(product_amount >= total_products) {
                return true;
            }
        }
        return false;
    }

    let time = 0n;
    let step = BigInt(machines_capacity[0] * total_products);
    while (step >= 1) {
        while (!valid(time + step)) time += step;
        
        step = step / 2n;
    }

    return time + 1n;
}


/**
 * @param {string} rawStr
 * @returns {[number, number[]]} - iterable
 */
function parse_in(rawStr) {
    const lines = rawStr.split('\n').map((ln) => ln.trim());
    const total_products = BigInt(lines[0].split(' ').pop());
    const machines_capacity = lines[1].split(' ').map(BigInt);
    return [total_products, machines_capacity];
}

function parse_out(rawStr) {
    return BigInt(rawStr);
}

const ts2 = new Test(solution_v2, FILE_NAME, parse_in, parse_out);

ts2.runAllTests();
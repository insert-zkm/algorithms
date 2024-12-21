
const assert = require('node:assert/strict');
const fs = require('node:fs');

const LOG_FILE = './test.log';
const SOLUTIONS_FILE = './solutions.txt';
const IN_FILE_EXTENSION = '.in';
const OUT_FILE_EXTENSION = '.out';
process.env.NO_COLOR=true;

class Test {
    /**
     * @param {function} solution 
     * @param {string} testDir 
     * @param {function} parseIn 
     * @param {function} parseOut 
     */
    constructor(solution, testDir, parseIn, parseOut) {
        this.testDir = testDir + '/';
        this.parseIn = parseIn;
        this.parseOut = parseOut;
        this.solution = solution;
        this.testFileNames = this.getTestCases();
        addTestedSolution(testDir);
    }

    getTestCases() {
        const files = fs.readdirSync(this.testDir);
        const testCases = new Set();

        files.forEach((file) => {
            if (file.endsWith(IN_FILE_EXTENSION)) {
                const baseName = file.slice(0, -3); // Remove the .in extension
                testCases.add(this.testDir + baseName);
            }
        });

        var collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
        return Array.from(testCases).sort(collator.compare);
    }

    runTestName(testName) {
        // console.info(`test case: ${testName}`);
        const inRawData = fs.readFileSync(testName + IN_FILE_EXTENSION);
        const expectedRaw = fs.readFileSync(testName + OUT_FILE_EXTENSION);

        const inData = this.parseIn(inRawData.toString().trim());
        const expectedOut = this.parseOut(expectedRaw.toString().trim());

        const start = process.hrtime();
        const actualOut = this.solution(...inData);
        const diff = process.hrtime(start);

        try {
            assert.deepEqual(actualOut, expectedOut);
        } catch (error) {
            console.error(`\x1b[31;1m\u2717 failed\x1b[0m  |${' - '.padEnd(35, ' ')} case: ${testName}`);
            Logger.log('ERROR', `TEST CASE: ${testName}`, error)
            return false;
        }
        console.info(
            `\x1b[33m\u2713 succeed\x1b[0m | ` + 
            `exec time: ${diff[0]}s ${Math.floor(diff[1] / 1_000_000) }ms ${diff[1] % 1_000_000}ns `.padEnd(35, ' ') + 
            `case: ${testName}`
        );
        return true;
    }

    /** @param {function} solution */
    runAllTests() {
        Logger.clear(this.testDir.toUpperCase() + '\n\n');
        let status = true;
        this.testFileNames.forEach((f) => {
            status &= this.runTestName(f);
        });
        this.testStatuses = {};
        if (status) {
            console.info('\x1b[33m\u2713\x1b[0m All Test Cases Passed');
        }
    }

    /* TODO: The method's logic needs to be further developed.
     * The hardcoded value `stack[3]` feels wrong. 
     * Main idea of this method is to define fileName where Test instance created
     * (^_^)/ */
    _todo_getCallerFile() {
        const err = new Error();
        const stack = err.stack.split('\n');
        
        // The caller's information is typically in the third line
        const callerLine = stack[3]; // Adjust index based on your needs

        // Extract the file name from the caller line
        const match = callerLine.match(/\((.*):\d+:\d+\)/);
        if (match) {
            return match[1].match(/(?<=\\)[^\\.]*(?=(\.js))/)[0]; // Return the file name
        }
        return null; // Return null if the file name could not be determined
    }
}

class Logger {
    static log(type, ...args) {
        const timestamp = new Date().toISOString();
        const logMessage = `${timestamp} - ${type}: ${args.join('\n')}\n`;
        fs.appendFileSync(LOG_FILE, logMessage,'utf8');
    }
    static clear(mess) {
        fs.writeFileSync(LOG_FILE, mess || '', 'utf8');
    }
}

function addTestedSolution(testName) {
    let already = '';
    if(fs.existsSync(SOLUTIONS_FILE)) {
        already = fs.readFileSync(SOLUTIONS_FILE, 'ascii')
    }
    const set = new Set(
        already.toString().split('\n').map((vl) => vl.trim()).filter(Boolean)
    );
    set.add(testName);
    fs.writeFileSync(SOLUTIONS_FILE, Array.from(set).join('\n'), 'ascii');
}

module.exports.Test = Test;
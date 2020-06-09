const ProcessCleaner = require('../helpers/process_cleaner')
const cp = require('child_process')
const Languages = require('../helpers/languages');
const {writeToFile} = require('../helpers/file_cleaner');

const express = require('express');
const router = express.Router();

const processCleaner = new ProcessCleaner();
processCleaner.start();

const codeCache = new Map();

function addToCache(id, lang, code) {
    codeCache.set(id,  {lang, code});
    setTimeout(() => {
        codeCache.delete(id);
    }, 60000);
}

function run(fileName, lang, res) {
    const runner = cp.spawn(lang.getRunner(), lang.getRunnerArgs(fileName));
    processCleaner.monitorProcess(runner);

    let runnerStdout = "";
    runner.stdout.on("data", (data) => {
        runnerStdout += data.toString();
        const lines = runnerStdout.split("\n");
        const n = lines.length - 1;
        for (const line of lines) {
            if (!line || n === 0) {
                runnerStdout = line;
                break;
            }
            res.write("data: " + line + "\n\n");
        }
    });

    let runnerStderr = "";
    runner.stderr.on("data", (data) => {
        runnerStderr += data.toString();
    })

    runner.on("close", (returnCode) => {
        if (runnerStderr && returnCode !== 0) {
            res.write("data: Runner failed\n\n");
            const lines = runnerStderr.split("\n");
            const n = lines.length - 1;
            for (const line of lines) {
                if (!line || n === 0) {
                    runnerStderr = line;
                    break;
                }
                res.write("data: " + line + "\n\n");
            }
        }
       res.end();
    });
}

function compileAndRun(fileName, lang, res) {
    const compiler = cp.spawn(lang.getCompiler(), lang.getCompilerArgs(fileName));
    processCleaner.monitorProcess(compiler);

    let compilerStdout = "";
    compiler.stdout.on("data", (data) => {
       compilerStdout += data.toString();
    });

    let compilerStderr = "";
    compiler.stderr.on("data", (data) => {
        compilerStderr += data.toString();
    });

    compiler.on("close", (returnCode) => {
       if (returnCode !== 0) {
           res.write("data: Compilation failed!\nStdout: " + compilerStdout + "\nStderr: " + compilerStderr + "\n\n")
           res.end();
           return;
       }

       run(fileName, lang, res);
    });
}

router.post('/test', (req, res) => {
    let {lang, code, id} = req.body;

    lang = Languages[lang];
    if (!lang) {
        res.status(400).send("Unsupported language!");
        return;
    }

    addToCache(id, lang, code);
    res.sendStatus(200);
});

router.get('/test/:id', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.flushHeaders();

    const id = req.params.id;
    const entry = codeCache.get(id);
    if (!entry) {
        console.log("No code entry!");
        res.end();
        return;
    }
    let lang = entry.lang;
    let code = entry.code;

    const fileName = writeToFile(lang.getExtension(), code, (err) => {
        if (err) {
            console.log("Cannot write file to disk!: ", err)
            res.end();
            return;
        }

        if (lang.needsCompilation()) {
            compileAndRun(fileName, lang, res);
        } else {
            run(fileName, lang, res);
        }
    });
});


module.exports = router;

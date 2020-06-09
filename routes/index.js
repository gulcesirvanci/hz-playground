const cp = require('child_process')

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/test', (req, res) =>  {

  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  const compiler = cp.spawn("echo", ["hey"]);
  compiler.on("close", (returnCode) => {
    if (returnCode !== 0) {
      res.end("Compilation failed");
    } else {
      const runner = cp.spawn("ping", ["-c", "50", "google.com"]);
      let str = "";
      runner.stdout.on('data', (data) => {
        str += data.toString();
        const lines = str.split("\n");

        for (const line of lines) {
          if (!line) {
            str = line;
          } else {
            res.write("data: " + line + "\n\n");
          }
        }
      });
      runner.on("close", (rCode) => {
        res.end(str);
      });
    }
  });
});

module.exports = router;

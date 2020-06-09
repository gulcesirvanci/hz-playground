const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const folderPath = "/tmp/hz-playground";

class FileCleaner {
    start() {
        this.taskId = setInterval(this._cleaner.bind(this), 10000);
    }

    stop() {
        if (this.taskId) {
            clearInterval(this.taskId);
        }
    }

    _cleaner() {
        cleanUpFiles(folderPath);
    }
}

function cleanUpFiles(folder) {
    fs.readdir(folder, (err, files) => {
        if (err) {
            return;
        }

        for (const file of files) {
            const filePath = path.join(folder, file);
            fs.stat(filePath, (err2, stat) => {
                if (err) {
                    return;
                }

                if (stat.isDirectory()) {
                    cleanUpFiles(filePath);
                    fs.rmdir(filePath, (err4) => {});
                    return;
                }

                const now = new Date().getTime();
                if (now >= (stat.ctimeMs + 60000)) {
                    fs.unlink(filePath, (err3) => {});
                }
            });
        }
    });
}

function writeToFile(id, extension, content, shouldBeInFolder, callback) {
    const fileName = id + "." + extension;
    const folder = shouldBeInFolder ? folderPath + "/" + id : folderPath;

    const filePath = path.join(folder, fileName);
    fs.mkdir(folder, {recursive: true}, (err) => {
        if (err) {
            callback(err);
            return;
        }
        fs.writeFile(filePath, content, callback);
    })

    return filePath;
}

module.exports.FileCleaner = FileCleaner;
module.exports.writeToFile = writeToFile;
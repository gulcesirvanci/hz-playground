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
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                return;
            }

            for (const file of files) {
                const filePath = path.join(folderPath, file);
                fs.stat(filePath, (err2, stat) => {
                    if (err) {
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
}

function writeToFile(extension, content, callback) {
    const fileName = crypto.randomBytes(32).toString('hex') + "." + extension;
    const filePath = path.join(folderPath, fileName);
    fs.writeFile(path.join(folderPath, fileName), content, callback);
    return filePath;
}

module.exports.FileCleaner = FileCleaner;
module.exports.writeToFile = writeToFile;
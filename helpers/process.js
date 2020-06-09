class ProcessCleaner {
    constructor() {
        this.proceses = [];
    }

    start() {
        this.taskId = setInterval(this._cleaner.bind(this), 10000);
    }

    stop() {
        if (this.taskId) {
            clearInterval(this.taskId);
        }
    }

    monitorProcess(process) {
        this.proceses.push({
            process: process,
            startTime: new Date().getTime(),
        });
    }

    _cleaner() {
        const now = new Date().getTime();
        let n = this.proceses.length;
        while (n-- > 0) {
            const p = this.proceses[n];
            if (now >= (p.startTime + 10000)) {
                p.process.kill('SIGINT');
                this.proceses.splice(n, 1);
            }
        }
    }
}

module.exports = ProcessCleaner;
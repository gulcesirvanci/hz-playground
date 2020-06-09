class Language {
    constructor(name) {
        this.name = name;
    }

    setCompiler(compiler) {
        this.compiler = compiler;
        return this;
    }

    setFileExtension(extension) {
        this.extension = extension;
        return this;
    }

    setCompilerArgsGetter(getterFunc) {
        this.compilerArgsGetter = getterFunc;
        return this;
    }

    setRunner(runner) {
        this.runner = runner;
        return this;
    }

    setRunnerArgsGetter(runnerArgsGetter) {
        this.runnerArgsGetter = runnerArgsGetter;
        return this;
    }

    getName() {
        return this.name;
    }

    getCompiler() {
        return this.compiler;
    }

    getCompilerArgs(file, id) {
        return this.compilerArgsGetter(file, id);
    }

    getExtension() {
        return this.extension;
    }

    getRunner() {
        return this.runner;
    }

    getRunnerArgs(file, id) {
        return this.runnerArgsGetter(file, id);
    }

    needsCompilation() {
        return this.compiler != null;
    }
}

const java = new Language("java")
    .setCompiler("javac")
    .setCompilerArgsGetter((file, id) => {
        return ["-cp", "/home/metin/hazelcast-client-playground-java/lib/*", file];
    })
    .setFileExtension("java")
    .setRunner("java")
    .setRunnerArgsGetter((file, id) => {
        return ["-cp", "/home/metin/hazelcast-client-playground-java/lib/*:.:/tmp/hz-playground/" + id, "Main"];
    })

const nodeJs = new Language('node')
    .setFileExtension('js')
    .setRunner("node")
    .setRunnerArgsGetter((file) => {
        return [file];
    });

const languages = {};
languages[java.getName()] = java;
languages[nodeJs.getName()] = nodeJs;

module.exports = languages;
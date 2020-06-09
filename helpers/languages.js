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

    getCompilerArgs(file) {
        return this.compilerArgsGetter(file);
    }

    getExtension() {
        return this.extension;
    }

    getRunner() {
        return this.runner;
    }

    getRunnerArgs(file) {
        return this.runnerArgsGetter(file);
    }

    needsCompilation() {
        return this.compiler != null;
    }
}

const java = new Language("java")
    .setCompiler("javac")
    .setCompilerArgsGetter((file) => {
        return ["-cp", "hazelcast.jar;" + file]
    })
    .setFileExtension("java");

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
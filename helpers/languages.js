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

const javaCompilerPath = "/home/metin/hazelcast-client-playground-java";

const java = new Language("java")
  .setCompiler("java")
  .setCompilerArgsGetter((file, id) => {
    return [
      "-jar",
      javaCompilerPath + "/target/client-playground-1.0-SNAPSHOT.jar",
      "-f",
      file,
      "-c",
      javaCompilerPath + "/lib",
      "-o",
      "/tmp/hz-playground/" + id,
    ];
  })
  .setFileExtension("java")
  .setRunner("java")
  .setRunnerArgsGetter((file, id) => {
    return [
      "-cp",
      javaCompilerPath + "/lib/*:.:/tmp/hz-playground/" + id,
      "Playground",
    ];
  });

const nodeJs = new Language("node")
  .setFileExtension("js")
  .setRunner("node")
  .setRunnerArgsGetter((file) => {
    return [file];
  });

const go = new Language("go")
  .setFileExtension("go")
  .setRunner("go")
  .setRunnerArgsGetter((file) => {
    return [file];
  });

const languages = {};
languages[java.getName()] = java;
languages[nodeJs.getName()] = nodeJs;
languages[go.getName()] = go;

module.exports = languages;

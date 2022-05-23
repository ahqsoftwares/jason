const EventEmitter = require("events");
const fs = require("fs-extra");
const VM = require("vm");
let dbase = {};
let file = "";
/**
 * JAS the ts style js
 */
class JAS extends EventEmitter {
    /**
     * Make a jas compiler/reader
     * @param {*} path 
     * @param {*} options 
     */
    constructor (path, options) {
        let opt = options;
        super();
        if(!options) {
            this.options = {
                format: "jas",
                saveCompiledFile: false,
                debug: false
            };
        } else {
            this.options = {
                format: opt?.format || "jas",
                debug: opt?.debug || false,
                saveCompiledFile: opt?.saveCompiledFile || false
            }
        }

        try {
            this.file = String(path);
            file = String(path);
            fs.readFile(path, (err, out) => {
                if (err) {
                    console.error("JAS-System-Error: Could not find " + file);
                    process.exit(404);
                }
                console.log(`JAS-System-info: Found file ${file}`);
                if (this.options.debug) {
                    console.log(`Contents:\n${out}`);
                }
            });
        } catch(e) {
            throw new Error(e);
        }
    }

    compile(path) {
        if (!path) {
            fs.readFile(this.file, function(error, out) {
                if (error) throw new Error(String(error));
                VM.runInNewContext(String(out), {
                    need: require,
                    process: {
                        ...process,
                        cwd: function() {
                            return "home/vm";
                        },
                        mainCwd: function() {
                            return process.cwd()
                        }
                    },
                    print: console.log,
                    a: function(name, ...options) {
                        return new name(...options);
                    },
                    tempbase: {
                        fetch: function(key) {
                            if (!key) throw new Error("key is required!");
                            return dbase[key];
                        },
                        set: function(key, value) {
                            if (!key) throw new Error("key is required!");
                            if (typeof(value) == "undefined") throw new Error("value is required!");
                            dbase[key] = value;
                        },
                        add: function(key, int) {
                            if (!key) throw new Error("key is required!");
                            if (!int) throw new Error("value is required!");
                            let temp = dbase[key];
                            dbase[key] = (temp + Number(int));
                        },
                        subtract: function(key, int) {
                            if (!key) throw new Error("key is required!");
                            if (!int) throw new Error("value is required!");
                            let temp = dbase[key];
                            dbase[key] = (temp - Number(int));
                        },
                        delete: function(key) {
                            if (!key) throw new Error("key is required!");
                            delete dbase[key];
                        }
                    },
                    dir: (process.cwd() + file.replace(".", ""))
                });
            });
        } else {
            fs.readFile(path, function(error, out) {
                if (error) throw new Error(String(error));
                VM.runInNewContext(String(out), {
                    need: require,
                    process: {
                        ...process,
                        cwd: function() {
                            return "home/vm";
                        },
                        mainCwd: function() {
                            return process.cwd()
                        }
                    },
                    print: console.log,
                    a: function(name, ...options) {
                        return new name(...options);
                    },
                    tempbase: {
                        fetch: function(key) {
                            if (!key) throw new Error("key is required!");
                            return dbase[key];
                        },
                        set: function(key, value) {
                            if (!key) throw new Error("key is required!");
                            if (typeof(value) == "undefined") throw new Error("value is required!");
                            dbase[key] = value;
                        },
                        add: function(key, int) {
                            if (!key) throw new Error("key is required!");
                            if (!int) throw new Error("value is required!");
                            let temp = dbase[key];
                            dbase[key] = (temp + Number(int));
                        },
                        subtract: function(key, int) {
                            if (!key) throw new Error("key is required!");
                            if (!int) throw new Error("value is required!");
                            let temp = dbase[key];
                            dbase[key] = (temp - Number(int));
                        },
                        delete: function(key) {
                            if (!key) throw new Error("key is required!");
                            delete dbase[key];
                        }
                    },
                    dir: (process.cwd() + file.replace(".", ""))
                });
            });
        }
    }
}
module.exports = JAS;
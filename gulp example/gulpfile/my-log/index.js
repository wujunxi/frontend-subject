const log4js = require("log4js");
exports.log4js_config = {
    "appenders" : [
        {"type" : "console"},
        // {
        //     "type" : "dateFile",
        //     "filename" : "logs/app",
        //     "pattern" : "-yyyy-MM-dd.log",
        //     "alwaysIncludePattern" : true,
        //     "category" : "app"
        // }
    ],
    "replaceConsole": true,
    "levels" : {
        "app" : "ALL"
    }
};
log4js.configure(this.log4js_config);
exports.logger = log4js.getLogger("app");
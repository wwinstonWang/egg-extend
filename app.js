'use strict';
const loader = require("./lib/loader");

module.exports=app=>{
    // 在中间件最前面统计请求时间
    app.config.coreMiddleware.unshift("errorHandler");
    app.config.coreMiddleware.unshift("koaBody");

    console.log("core middleware "+JSON.stringify(app.config.coreMiddleware));

    let isRegisterInstance = false;
    if (app.config.eggExtend.app)
        loader(app, isRegisterInstance);
};

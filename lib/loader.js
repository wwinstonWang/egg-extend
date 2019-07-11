'use strict';
const path = require("path");
const feign = require("../feign");
const NacosNamingClient = require('nacos').NacosNamingClient;

let isRegisterInstance=false;

/**
 * 
 * @param {} app 
 * @param {是否向注册中心注册} isRegisterInstance 
 */
module.exports = (app, isRegisterInstance) => {
    const mergedConfig=app.config.eggExtend;
    (() => {
        const logger = console;
        const client = new NacosNamingClient({
            logger,
            serverList: mergedConfig.discovery.serverAddr,
            namespace: mergedConfig.discovery.namespace,
        });
        this.client = client;
        feign.client = client;
        client.ready(err=>{
            if(!err && isRegisterInstance){//// registry instance
                client.registerInstance(mergedConfig.name, mergedConfig.local);
                process.on('SIGINT', function() {//
                    client.deregisterInstance(mergedConfig.name, mergedConfig.local);
                    console.log('Got SIGINT.  Press Control-D/Control-C to exit.');
                });
            }
        });
    })();

    const directory = path.join(app.config.baseDir, 'app/feign');
    app.loader.loadToApp(directory, 'feign', {
        initializer(model, opt) {
            // 第一个参数为 export 的对象
            // 第二个参数为一个对象，只包含当前文件的路径
            return new model(app);
        },
    });
};
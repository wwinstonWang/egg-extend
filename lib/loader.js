'use strict';
const path = require("path");
const ip = require("../nettools").getIPAdress();
const feign = require("../feign");
const NacosNamingClient = require('nacos').NacosNamingClient;
const _ = require("lodash");

/**
 * 
 * @param {} app 
 * @param {是否向注册中心注册} isRegisterInstance 
 */
module.exports = (app, isRegisterInstance) => {
    const defaultConfig = {
        /**
         * 微服务名称
         */
        name: "default",
        /**
         * 注册中心地址
         */
        discovery: {
            serverAddr: "127.0.0.1:8848",
            namespace: "public"
        },
        /**
         * 本机地址
         */
        local: {
            ip: ip,
            port: 8080
        }
    }

    const config = app.config.eggExtend;
    const mergedConfig = _.merge({}, defaultConfig, config);
    app.config.eggExtend = mergedConfig;

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
            if(!err && isRegisterInstance)//// registry instance
                client.registerInstance(mergedConfig.name, mergedConfig.local);
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
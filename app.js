'use strict';
const path=require("path");
const ip=require("./nettools").getIPAdress();
const feign= require("./feign");
const NacosNamingClient = require('nacos').NacosNamingClient;

class ApptHook {
    constructor(app) {
        this.app = app;
    }

    async didReady() {
        const app=this.app;
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
        let config = app.config.eggExtend;
        config = Object.assign({}, defaultConfig, config)
        app.config.eggExtend=config;

        const logger = console;
        const client = new NacosNamingClient({
            logger,
            serverList: config.discovery.serverAddr,
            namespace: config.discovery.namespace,
        });
        feign.client=client;
        await client.ready();
        // registry instance
        await client.registerInstance(config.name, config.local);
    
        const directory = path.join(app.config.baseDir, 'app/feign');
        app.loader.loadToApp(directory, 'feign', {
            initializer(model, opt) {
                // 第一个参数为 export 的对象
                // 第二个参数为一个对象，只包含当前文件的路径
                return new model(app, opt.path);
            },
        });
    }

    async beforeClose(){
        const feign=require("egg-extend/feign");
        const client=feign.client;
        const config=this.app.config.eggExtend;
        await client.deregisterInstance(config.name,config.local);
    }
}

module.exports=ApptHook;
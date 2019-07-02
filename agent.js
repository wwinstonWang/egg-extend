'use strict';
const path=require("path");
const ip=require("./nettools").getIPAdress();
const feign= require("./feign");

module.exports = async agent => {
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
    let config = agent.config.eggExtend;
    config = Object.assign({}, defaultConfig, config)

    const logger = console;
    const client = new NacosNamingClient({
        logger,
        serverList: config.discovery.serverAddr,
        namespace: config.discovery.namespace,
    });
    feign.client=client;
    await client.ready();

    const directory = path.join(app.config.baseDir, 'app/feign');
    agent.loader.loadToApp(directory, 'feign', {
        initializer(model, opt) {
            // 第一个参数为 export 的对象
            // 第二个参数为一个对象，只包含当前文件的路径
            return new model(agent, opt.path);
        },
    });
};
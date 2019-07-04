'use strict';
const path = require("path");
const ip = require("./nettools").getIPAdress();
const NacosNamingClient = require('nacos').NacosNamingClient;
const _ = require("lodash");

class AgentHook {
    constructor(agent) {
        this.agent = agent;
    }

    async didLoad() {
        const agent = this.agent;

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
        config = _.merge({}, defaultConfig, config);
        agent.config.eggExtend = config;

        await (async () => {
            const logger = console;
            const client = new NacosNamingClient({
                logger,
                serverList: config.discovery.serverAddr,
                namespace: config.discovery.namespace,
            });
            this.client = client;
            await client.ready();
            // registry instance
            if(config.name.length!=0)
                await client.registerInstance(config.name, config.local);
        })();

    }

    async beforeClose() {
        const config = this.agent.config.eggExtend;
        if(config.name.length!=0)
            await this.client.deregisterInstance(config.name, config.local);
        await this.client.close();
    }
}

module.exports = AgentHook;

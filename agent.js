'use strict';
const loader = require("./lib/loader");

class AgentHook {
    constructor(agent) {
        this.agent = agent;
    }

    async didLoad() {
        const agent = this.agent;
        let isRegisterInstance = true;
        if (agent.config.eggExtend.name.length == 0)
            isRegisterInstance = false;
        if (agent.config.eggExtend.agent)
            loader(agent, isRegisterInstance);
    }
}

module.exports = AgentHook;

'use strict';
const loader = require("./lib/loader");

module.exports=agent=>{
    let isRegisterInstance = true;
    if (agent.config.eggExtend.name.length == 0)
        isRegisterInstance = false;
    if (agent.config.eggExtend.agent)
        loader(agent, isRegisterInstance);
};
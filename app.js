'use strict';
const loader = require("./lib/loader");

class ApptHook {
    constructor(app) {
        this.app = app;
    }

    async didLoad() {
        const app = this.app;
        let isRegisterInstance = false;
        if (app.config.eggExtend.app)
            loader(app, isRegisterInstance);
    }
}

module.exports = ApptHook;

const ip = require("../nettools").getIPAdress();

module.exports={
    eggExtend:{
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
    },
    bodyParser:{
        enable:false,
    },
    koaBody:{
        multipart: true,
    }
};
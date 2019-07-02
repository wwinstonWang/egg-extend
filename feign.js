const NacosNamingClient = require('nacos').NacosNamingClient;
let client = undefined

/**
 * 根据负载均衡策略从服务列表中获取服务连接信息
 * @param {注册中心服务列表} serviceList 
 */
function balanceServiceList(serviceList){
    //总权重
    let sumWeight=0;
    const flatServiceList=[];
    serviceList.forEach(service=>{
        sumWeight+=service.weight;
        for(let i=0;i<service.weight;i++)
            flatServiceList.push(service);
    });
    //当前权重
    const currentWeight=Math.floor(Math.random()*sumWeight);
    const currentService=flatServiceList[currentWeight];
    return `http://${currentService.ip}:${currentService.port}`
}

/**
 * 装饰器，类似java中Feign
 * @param {注册中心微服务名称} serviceName 
 */
function feign(serviceName) {
    let serviceList=undefined;
    client.subscribe(serviceName, hosts => {
        serviceList=hosts;
    });
    return function (target) {
        const desc = Object.getOwnPropertyDescriptors(target.prototype);
        for (const key of Object.keys(desc)) {
            if (key === 'constructor') {
                continue;
            }
            // 获取属性, 
            //这里需要注意, 在es6中, 类的属性不一定是一个字符串常量, 
            const func = desc[key].value;
            // 只关心类的方法
            if ('function' === typeof func) {
                // 重新定义类的原方法, 
                Object.defineProperty(target.prototype, key, {
                    value(...args) {
                        const baseUrl=balanceServiceList(serviceList);
                        console.log(`当前地址为${baseUrl}`);
                        args.unshift(baseUrl);
                        const ret = func.apply(this,args);
                        return ret;
                    }
                })
            }
        }
    };
}

module.exports = {
    bootstrap,
    feign,
    get client(){
        return client;
    },
    set client(value){
        client=value;
    }
}

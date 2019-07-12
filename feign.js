/**
 * 根据负载均衡策略从服务列表中获取服务连接信息
 * @param {注册中心服务列表} serviceList 
 */
function balanceServiceList(serviceList) {
    //总权重
    let sumWeight = 0;
    const flatServiceList = [];
    serviceList.forEach(service => {
        sumWeight += service.weight;
        for (let i = 0; i < service.weight; i++)
            flatServiceList.push(service);
    });
    //当前权重
    const currentWeight = Math.floor(Math.random() * sumWeight);
    const currentService = flatServiceList[currentWeight];
    return `http://${currentService.ip}:${currentService.port}`
}

let client;
/**
 * 负载均衡对象
 */
const balance={
    __resource__:{},
    /**
     * 注册中心客户端
     */
    get client(){
        return client;
    },
    set client(value){
        client=value;
    }
}

module.exports =balance;


/**
 * 负载均衡类装饰器，类似java中Feign. 被Feign修饰的类中. 当函数第一个参数为对象时，运行时会自动注入负载均衡地址，键为balanceUrl
 * @param {注册中心微服务名称} serviceName 
 */
balance.feign=function(serviceName){
    let serviceList = [];
    client.subscribe(serviceName, hosts => {
        serviceList = hosts.filter(host=>host.enabled);
    });
    return function (target) {
        const desc = Object.getOwnPropertyDescriptors(target.prototype);
        for (const key of Object.keys(desc)) {
            if (key === 'constructor') {
                continue;
            }
            //这里需要注意, 在es6中, 类的属性不一定是一个字符串常量, 
            const func = desc[key].value;
            // 只关心类的方法
            if ('function' === typeof func) {
                // 重新定义类的原方法, 
                Object.defineProperty(target.prototype, key, {
                    value(...args) {
                        if (args.length > 0 && typeof args[0] == "object"){
                            if(serviceList.length==0)
                                throw new Error(`Service of ${serviceName} was not found.`);
                            let baseUrl = balanceServiceList(serviceList);
                            let resource=balance.__resource__[target.name];
                            if(resource && resource[key])
                                baseUrl+=resource[key];
                            console.log(`当前地址为${baseUrl}`);
                            args[0].balanceUrl = baseUrl;
                        }
                        const ret = func.apply(this, args);
                        return ret;
                    }
                })
            }
        }
    };
}

/**
 * Feign中方法装饰器
 * @param {资源名称} resource 
 */
balance.feign.resource=function(resource){
    return function (target, name, descriptor) {
        //将对象方法名作为资源名称存储
        balance.__resource__[target.constructor.name] || (balance.__resource__[target.constructor.name]={})
        balance.__resource__[target.constructor.name][name]=resource;
    }
}
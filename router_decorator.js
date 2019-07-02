const routerDecorator = {
    __classPrefix__:{},
    __router__: [],
    get:undefined,
    post:undefined,
    put:undefined,
    delete:undefined,
    options:undefined,
    head:undefined,
    patch:undefined
};
module.exports = routerDecorator;


/**
 * 路由初始化
 * @param app  Application对象
 * @param options 默认值：{prefix: ''}
 */
routerDecorator.initRouter = (app,options={prefix: ''}) => {
    routerDecorator.__router__.forEach(function(opt){//路由参数
        const controllerPrefixData = routerDecorator.__classPrefix__[opt.className] || { prefix: ''};

        const fullUrl = `${options.prefix}${controllerPrefixData.prefix}${opt.url}`;

        app.router[opt.httpMethod](fullUrl,async (ctx) => {
            const ist = new opt.constructorFn(ctx);
            const res=await ist[opt.handlerName](ctx);
            if(res!=undefined)
                ctx.body=res;
        });
    });
};

/**
 * 类装饰器，定义路由前缀
 * @param prefix 类装饰器前缀
 */
routerDecorator.prefix=function(prefix){
    return function(target){
        routerDecorator.__classPrefix__[target.name]={
            prefix
        }
    };
}

const methods = ['get', 'post', 'put', 'delete', 'options', 'head', 'patch'];
/**
 * 方法装饰器，注入基本HTTP方法. 当方法有返回值时，会自动将返回值给ctx.body
 */
methods.forEach(httpMethod => {
    routerDecorator[httpMethod] = (url='') => {
        return function (target, name, descriptor) {
            routerDecorator.__router__.push({
                url,
                httpMethod,
                handlerName:name,
                constructorFn: target.constructor,
                className: target.constructor.name
            });

        }
    }
});
# egg-tool
## 主要功能
1、基于eggjs的路由装饰器
2、基础控制器，提供基于restful路由
2、基于nacos注册中心
3、负载均衡装饰器
4、工具
   1、获取本机ip

##初始化
启用装饰器
require('babel-register')({
  plugins: [
    'transform-decorators-legacy',
  ],
});

1、eggjs路由初始化
    const routerDecorator=require("./core/router_decorator");
    routerDecorator.initRouter(app);
   
2、负载均衡装饰器初始化
    const {client}=require("./core/feign");
    client.ready();
    const directory = path.join(app.config.baseDir, 'app/feign');
    app.loader.loadToApp(directory, 'feign',{
        initializer(model, opt) {
        // 第一个参数为 export 的对象
        // 第二个参数为一个对象，只包含当前文件的路径
        return new model(app, opt.path);
        },
    });
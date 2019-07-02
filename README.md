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

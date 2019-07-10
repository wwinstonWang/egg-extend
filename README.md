# egg-tool
## 主要功能
1、基于eggjs的路由装饰器    

2、基础控制器，提供基于restful路由  

3、基于nacos注册中心  

4、负载均衡装饰器  

5、工具  

​	  1、获取本机ip

6、集成中间件

  	1、全局错误中间件

  	2、停用bodyParser，并集成koa-body中间件(支持form-data格式),并默认开启附件上传



## 初始化

### 启用装饰器

```
require('babel-register')({
  plugins: [ 
    'transform-decorators-legacy', 
  ],
});
```

### 路由初始化 

```
 const routerDecorator=require("egg-extend/router_decorator"); 
 routerDecorator.initRouter(app);
```

###  插件初始化(开启nacos注册)

```
config.eggExtend = {
    //是否worker进程中开启nacos
    app:true,
    ////是否agent进程中开启nacos
    agent:true,
   /**
    * 微服务名称.当微服务名称为空时，不会向注册中心注册
     */
    name: "rms-inspection1",
    /**
   * 注册中心地址
    */
    discovery: {
      serverAddr: "192.168.1.110:8848",
      namespace: "public"
    },
    local:{
      port:8090
    }
  };
```


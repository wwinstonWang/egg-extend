# egg-extend
## 主要功能
### 1、基于eggjs的路由装饰器    

### 2、基础控制器，提供基于restful路由 

​    接口 返回数据格式统一为：{code:0, msg:'',data:obj}。 

​    code为0表示正常返回, data为返回的业务数据；非0表示出错，msg为错误原因

**查: GET请求**  

​		**主键查找：**

​							baseUrl/id1,id2。 

​							只有一个主键时返回主键对应的数据，否则为多个id对应数据的数组。

​        **条件查找**：

​						baseUrl?param1=x&param2=y.	

查询参数需在数据模型中定义，否则会被忽略(通用框架无法感知参数用途)或者需要开发者复写实现额外参数的业务功能。

一般参数在数据实体中为等于查找条件。为实现复杂查找条件，框架规定以指定前缀开头的属性名作为业务拓展。

​					`const IN_PREFIX = 'in'`

​					`const GT_PREFIX = 'gt'`
​					
​					`const GE_PREFIX = 'ge'`

​					`const LT_PREFIX = 'lt'`

​					`const LE_PREFIX = 'le'`

​					`const NEQ_PREFIX = 'neq'`

​					`const NIN_PREFIX = 'nin'`

​     **增: POST请求**: 

​								baseUrl

​     **改: PUT请求:** 

​								baseUrl/id

​     **删: DELETE请求:** 

​								baseUrl/id1,id2

​    

### 3、基于nacos注册中心  



### 4、负载均衡装饰器  



### 5、工具  

  	1、获取本机ip



### 6、集成中间件

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


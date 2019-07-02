'use strict';

const Controller = require('egg').Controller;
const ServiceInvoker=require("../core/service_invoker");

 class BaseController extends Controller {
    constructor(...args){
        super(...args);
        this.serviceInvoker=new ServiceInvoker(this.model);
    }

    success(data) {
        this.ctx.body = {
            code: 0,
            data,
        };
    }

    fail(msg) {
        this.ctx.body = {
            code: 1,
            msg,
        };
    }

    /**
     * return default model of this controller
     */
    get model() {
        //sub class; TODO this.ctx.model.User
        this.ctx.throw("子类必须实现model方法,并返回合适的model对象！");
    }

    /**
     * return primary key name
     */
    get primaryKey(){
        return "id";
    }

    /**
     * 获取路由参数
     */
    get routeParams(){
        const { ctx } = this;
        let id=ctx.params.id.split(",");
        return {id};
    }
    /**
     * When default index route is not satisfied your needs, override this method.
     * 
     * @returns {limit,offset,attributes,where,order}
     */
    getIndexParms(){
        const { ctx } = this;
        return this.serviceInvoker.getIndexParms(ctx,this.model);
    }

    /**
     * Get all resource
     */
    async index() {
        let {limit,offset,attributes,where,order}=this.getIndexParms();

        let data=undefined;
        if(limit){
            data = await this.model.findAndCountAll({
                where,
                limit,
                offset,
                attributes,
                order,
            });
            this.success({total:data.count,rows:data.rows});
        }else{
            data = await this.model.findAll({
                where,
                attributes,
                order,
            });
            this.success(data);
        }
        
    };

    getShowParms(){
        const {id}=this.routeParams;
        const where={};
        where[this.primaryKey]=id;

        return {where};
    }

    /**
     * Get one/more resource by path param
     */
    async show() {
        let {where}=this.getShowParms();

        let data = await this.model.findAll({where});
        if(data.length==1)
            data=data[0];
        this.success(data);
    };

    /**
     * Post one resource
     */
    async create() {
        const { ctx } = this;
        let data=undefined;
        if(ctx.request.body instanceof Array)
            data=await this.model.bulkCreate(ctx.request.body);
        else
            data = await this.model.create(ctx.request.body);

        this.success(data);
    };

    /**
     * Edit one resource
     */
    async update() {
        const { ctx } = this;
        delete ctx.request.body[this.primaryKey];

        const {id}=this.routeParams;
        const where={};
        where[this.primaryKey]=id;

        const data=await this.model.update(ctx.request.body,{where});
        this.success(data);
    };

    /**
     * Delete one/more resource
     */
    async destroy() {
        const { ctx } = this;

        const {id}=this.routeParams;
        const where={};
        where[this.primaryKey]=id;

        const data=await this.model.destroy({where});

        this.success(data);;
    };
}

module.exports = BaseController;


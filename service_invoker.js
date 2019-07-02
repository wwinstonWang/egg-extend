function toInt(str) {
    if (typeof str === 'number') return str;
    if (!str) return str;
    return parseInt(str, 10) || 0;
  }

class ServiceInvoker{
    /**
     * 
     * @param {*} model 
     */
    constructor(model){
        this.model=model;
    }

     /**
      * Get query restrict proviso.
      * @param {*} ctx 
      * @returns {limit,offset,attributes,where,order}
      */
    getIndexParms(ctx){
        let query = ctx.query;
        //page页码 rows页行数   ,excludeFields  ,orderSql
        let {page,rows,fields,orderFields}=query;
        let limit=toInt(rows),offset=toInt(rows*(page-1));
        //排序属性
        orderFields=orderFields && orderFields.split(",");
        let order=orderFields && orderFields.map(orderField=>{
            return orderField.split(" ");
        });
        //过滤属性
        let attributes=fields && fields.split(",");
        
        let where={};
        for(let property in this.model.rawAttributes){
            if(query[property])
                where[property]=query[property];
        }
        return {limit,offset,attributes,where,order};
    }
}

module.exports=ServiceInvoker;
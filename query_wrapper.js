/**
 * 多条件查询属性名称前缀
 */
const IN_PREFIX = 'in'
const GT_PREFIX = 'gt'
const GE_PREFIX = 'ge'
const LT_PREFIX = 'lt'
const LE_PREFIX = 'le'
const NEQ_PREFIX = 'neq'
const NIN_PREFIX = 'nin'

// ------ OR -------------------------------
const O$IN_PREFIX = 'o$in'
const O$GT_PREFIX = 'o$gt'
const O$GE_PREFIX = 'o$ge'
const O$LT_PREFIX = 'o$lt'
const O$LE_PREFIX = 'o$le'
const O$NEQ_PREFIX = 'o$neq'
const O$NIN_PREFIX = 'o$nin'

function deepObjectMerge(FirstOBJ, SecondOBJ) {
    // 深度合并对象
    Reflect.ownKeys(SecondOBJ).forEach(key => {
        FirstOBJ[key] = FirstOBJ[key];
        if (!FirstOBJ[key] || FirstOBJ[key].toString() !== '[object Object]')
            FirstOBJ[key] = SecondOBJ[key];
        else
            deepObjectMerge(FirstOBJ[key], SecondOBJ[key]);
    });
    return FirstOBJ;
}

const { Op } = require("sequelize");
const prefixMap = {
    in: Op.in,
    gt: Op.gt,
    ge: Op.gte,
    lt: Op.lt,
    le: Op.lte,
    neq: Op.ne,
    nin: Op.notIn
};

/**
 * 根据模型定义自动生成where过滤条件
 * @param {ctx.query} query 
 * @param {Sequelize模型实例Model} model 
 * @return 返回符合Sequelize模型查找的where过滤条件
 */
function rule(query,model) {
    let where = {};
    for (let property in model.rawAttributes) {
        if (!query[property]) continue

        let key = model.rawAttributes[property].type.key
        let value = query[property];
        if (value.toString()[0] === "[")
            value = JSON.parse(value);

        //不是虚拟属性
        if (key !== 'VIRTUAL') where[property] = value;
        else if (property.indexOf('_') != -1) {
            //虚拟属性中条件查询
            const [prefix, attri] = property.split('_')
            prefixMap[prefix] && deepObjectMerge(where, { [attri]: { [prefixMap[prefix]]: value } });
        }
    }
    return where;
}

module.exports.rule = rule;
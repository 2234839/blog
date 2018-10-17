// 这里用来实现mysql中的各种表的实体
class article{
    constructor(){
        if(arguments.length==1 &&(typeof arguments[0]=='object')){//只有一个参数且它是对象
            this.num=arguments[0].num
            this.id=arguments[0].id
            this.name=arguments[0].name
            this.textname=arguments[0].textname
            this.des=arguments[0].des
            this.content=arguments[0].content
            this.time=new Date().toLocaleString()
        }
    }
}

exports.article=article
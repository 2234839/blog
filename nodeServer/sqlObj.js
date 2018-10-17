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
class user{
    constructor(id = 0, name = null, password = null, data = {}, msg = {}, cookies = Math.random().toString(36).substr(2)){
        if(arguments.length==1 &&(typeof arguments[0]=='object')){//只有一个参数且它是对象 
            this.id=arguments[0].id
            this.name=arguments[0].name
            this.password=arguments[0].password
            this.data=arguments[0].data
            this.msg=arguments[0].msg
            this.cookies=arguments[0].cookies
        }else{
            this.id = id
            this.name = name
            this.password = password
            this.data = data
            this.msg = msg
            this.cookies = cookies
        }
    }
}
exports.article=article
exports.user=user
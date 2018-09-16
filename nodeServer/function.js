/**
 * 一些纯函数的存放地点
 */
 /**
  * 处理提交文件的表单post的数据
  * @param {Buffer} entireData 表单提交的二进制数据
  * @param {int} index 从什么地方开始查找
  */
 exports.formFile=(entireData,index)=>{
    if(index!==undefined)
        entireData=entireData.slice(index)
    else{

    }
    var Boundary=entireData.slice(0,40);//分界数据行

    //文件起始位置
    var start=-1
    var rn=Buffer.from("\r\n")
    for (let i = 0; i <4; i++) {
        start=entireData.indexOf(rn,start+1)
    };
    start+=2;//换行和回车
    //文件结束位置
    var end=entireData.indexOf(Boundary,start)
    
    console.log(entireData.slice(0,start).toString())
    return file={
        data:entireData.slice(start,end),
        describe:entireData.slice(40,start).toString()
    }
 }

 /**
 * 将cookie序列化为一个对象
 * 方法十分简单,对于复杂的cookie可能不适用
 * 适配了form提交文件的信息头
 * @param {string} cookies req.headers.cookie,从客户端获取到的cookie
 */
exports.cookieParse=(cookies)=>{
    //g是匹配所有 i 就只匹配一次 替换所有双引号和空格为空
    cookies=cookies.replace(/"+| +/g,"")
    var obj = {}
    if (cookies)
        cookies.split(/;|\r\n/).map(cookie => {
            var cookie = cookie.split(/=|:/)
            if(cookie[0]!="")
                obj[cookie[0]] = cookie[1]
        })
    return obj
}
/**
 * 将字符串序列化一下
 * @param {string} str 字符串
 * @param {string} des 用来分割的字符
 */
exports.Parse=(str,des)=>{
    return str.split(des)
}
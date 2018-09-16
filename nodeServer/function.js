/**
 * 一些纯函数的存放地点
 */
/**
 * 处理提交文件的表单post的数据
 * 调用了cookieParse函数
 * 返回一个数组
 * @param {Buffer} entireData 表单提交的二进制数据
 * @returns {Array} flies 返回这个二进制数据中各文件的位置及描述信息
 * flie:{
 * start:
 * end:
 * describe:{
 *  Content-Disposition:"form-data" 
 * Content-Type:"text/plain"
 * filename:"q.txt"
 * name:"txt"
 * }}
 */
exports.formFile = (entireData) => {
    var files = []
    var Boundary = entireData.slice(0, 40);//分界数据行
    var rn = Buffer.from("\r\n\r\n")//在分界数据及描述数据后就是两个换行 然后是数据，所以用他们来寻找开始位置
    var slider = 0
    do { //文件起始位置
        var start = entireData.indexOf(rn, slider) + rn.length
        //文件结束位置
        var end = entireData.indexOf(Boundary, start)
        var file = {
            start: start,//文件的开始位置
            end: end,//文件的结束位置
            describe: exports.stringParse(entireData.slice(slider, start).toString())
        }
        files.push(file)
        slider = file.end + Boundary.length
        //这个44 是最后的分界数据和一个回车换行的长度
    } while (files[files.length - 1].end + 44 < entireData.length)
    return files;
}

/**
 * 将字符出串序列化为一个对象
 * 方法十分简单,对于复杂的数据可能不适用
 * 目前适配：form提交文件的信息头、cookie、get提交的参数
 * @param {string} cookies req.headers.cookie,从客户端获取到的cookie
*/
exports.stringParse = (cookies) => {
    //g是匹配所有 i 就只匹配一次 替换所有双引号和空格为空
    cookies = cookies.replace(/"+| +/g, "")
    var obj = {}
    if (cookies)
        cookies.split(/;|\r\n|&/).map(cookie => {
            var cookie = cookie.split(/=|:/)
            if (cookie[0] != "")
                obj[cookie[0]] = cookie[1]
        })
    return obj
}
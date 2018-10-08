/**
 * 参数要成对输入，前者为后者的描述
 */
let j=0
exports.log = function () {
    colorLog.apply(null,arguments)
}
function colorLog(){//一种特定格式的打印方法
    let c={//颜色表
        //前景色            背景色                  其他  这个好像没用
        // \x1b[30m = 黑色     \x1b[40m = 黑色     \x1b[0m = 清除样式
        // \x1b[31m = 红色     \x1b[41m = 红色     \x1b[1m = 加粗
        // \x1b[32m = 绿色     \x1b[42m = 绿色     \x1b[2m = 半透明
        // \x1b[33m = 黄色     \x1b[43m = 黄色     \x1b[4m = 下划线
        // \x1b[34m = 蓝色     \x1b[44m = 蓝色     \x1b[5m = 闪动
        // \x1b[35m = 洋红色   \x1b[45m = 洋红色   \x1b[7m = 取反：背景色变前景色 前景色变背景色
        // \x1b[36m = 青色     \x1b[46m = 青色     \x1b[8m = 看不见 但位置还留着
        // \x1b[37m = 白色     \x1b[47m = 白色
        }
        let str = ""
        for (let i = 0; i < arguments.length; i += 2) {
            let q ='\x1b[0m'+arguments[i];
            let p ="：" +color(i/2)+arguments[i + 1]+'\t'
            str+=q+p
        }
        console.log(str+bgColor(j++)+"\t");
}
function color(num,bg='3'){
    num%=8
    if(bg!='3' && bg!='4')
        throw new Error("bg必须为3或4")
    return '\x1b['+bg+num+'m'
}
function bgColor(num){
    return color(num,'4')
}
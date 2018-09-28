/**
 * 一些比较纯的函数
 */
/**
 * 将html通过angular的编译生成node添加到element上去
 * 通过这样的编译生成的节点不需要一定放在写着ng-model的标签对之中，照常可以运行
 * @param {node} element 要添加到的节点
 * @param {string} html 要插入的html
 * @param {*} $compile angular的东西
 * @param {*} $scope 在哪个控制器内进行编译
 */
var addNode=(element, html, $compile,$scope) => {
    var dom = $compile(html)($scope);
    for (let i = 0; i < dom.length; i++) {
        element.appendChild(dom[i])
    }
}
/**
 * 一个简单的post方法
 * @param {strin} data 要提交的数据
 * @param {string}} action 要提交到的地址
 * @param {function} callback 回调函数
 */
var post=(data,action,callback = (user) => { alert(user.message)}) => {
    var xhr = new XMLHttpRequest();
    xhr.open('POST',action, true);
    xhr.onload = function () {
        callback(JSON.parse(xhr.response))
    }
    xhr.send(data);
}
/**
 * 实现弹窗功能
 */
function popup(){
    this.mask=document.createElement('div')
    this.mask.id="mask"
    this.pop=document.createElement('div')
    this.mask.appendChild(this.pop)
    this.show=()=>{document.body.appendChild(this.mask)}
    this.hidden=()=>{this.mask.remove()}
}
/**
 * 文章对象
 * @param {string} name 文章标题
 * @param {string} des 描述
 * @param {string} content 内容
 */
function article(name, des, content) {
    if(typeof name =="object"){
        var obj=name
        this.name = obj.name
        this.des = obj.des
        this.content = obj.content
    }else{
        this.name = name
        this.des = des
        this.content = content
    }
}
article.prototype.packing = function () {
    var section=document.createElement('section')
    section.innerHTML= `<section>
                    <h3>${this.name}</h3>
                    <div>${this.content}</div>
                </section>`
    return section;
}
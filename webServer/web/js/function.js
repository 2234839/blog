/**
 * 一些比较纯的函数
 */
/**
 * 将html通过angular的编译生成node添加到element上去
 * 通过这样的编译生成的节点不需要一定放在写着ng-model的标签对之中，照常可以运行
 * @param {node} element 要添加到的节点
 * @param {string} html 要插入的html,提供的html要全部为纯粹的html不应该查有文字，如果有则应该在最外层需要有一个div包含
 * @param {*} $compile angular的东西
 * @param {*} $scope 在哪个控制器内进行编译
 */
var addNode = (element, html, $compile, $scope) => {
    //html不符合规范则这一步可能报错
    var dom = $compile(html)($scope);
    for (let i = 0; i < dom.length; i++) {
        element.appendChild(dom[i])
    }
}
/**
 * 一个简单的post方法
 * @param {strin} data 要提交的数据,如果是对象会自动序列化
 * @param {string} action 要提交到的地址
 * @param {function} callback 回调函数 返回服务器返回的值如果能够序列化的话就会将其序列化
 */
var post = (data, action, callback = (user) => { alert(user.message) }) => {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', action, true);
    xhr.onload = function () {
        var res
        try {
            res=JSON.parse(xhr.response)
        } catch (error) {
            res=xhr.response
        }
        callback(res)
    }
    xhr.send(typeof data=="string"?data:JSON.stringify(data));
}
/**
 * 实现弹窗功能;
 * this.mask是遮罩层;
 * this.pop是信息要显示的地方;
 * this.off是关闭弹窗的div;
 * 一切样式最好另行添加
 */
function popup() {
    //背景
    this.mask = document.createElement('div')
    this.mask.className = "popupMask"
    //内容主体
    this.pop = document.createElement('div')
    this.pop.className = "popupPop"
    //关闭按钮
    this.off=document.createElement('button')
    this.off.className = "popupOff"
    this.mask.appendChild(this.off)
    this.mask.appendChild(this.pop)
    this.show = () => { document.body.appendChild(this.mask) }
    this.hidden = () => { this.mask.remove() }
    //点击off关闭弹窗
    this.off.addEventListener('click', () => {
        this.hidden()
    })
    //点击背景关闭弹窗
    this.mask.addEventListener('click', (e) => {
        if(e.target==this.mask)
            this.hidden()
    })
}
/**
 * 文章对象
 * @param {string} name 文章标题
 * @param {string} des 描述
 * @param {string} content 内容 
 */
function article(name, des, content) {
    if (typeof name == "object") {
        var obj = name
        this.name = obj.name
        this.des = obj.des
        this.content = obj.content
    } else {
        this.name = name
        this.des = des
        this.content = content
    }
}
article.prototype.packing = function () {
    var section = document.createElement('section')
    section.innerHTML = `<section>
                    <h3>${this.name}</h3>
                    <div>${this.content}</div>
                </section>`
    return section;
}
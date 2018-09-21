var state = angular.module('state',[]);//, ['ngSanitize']
/**
 * 注册控制器，用来注册？,需要添加一个标签来激活此模块
 */
state.controller('user', function ($scope,$compile,) {
    $scope.name = "";
    $scope.password = "";
    var inputHtml=` <input type="text" ng-model="name"><br/>
                    <input type="password" ng-model="password"><br/>`
    //注册节点的生成
    $scope.register=()=>{
        post(`name=${$scope.name}&password=${$scope.password}`,'register',(user)=>{
            alert(user.message)
            if(!user.hasOwnProperty("type")){
                $scope.addNode.pop.hidden()
                if(confirm("是否立即登录"))
                    $scope.addLoginNode()
            }
        })
    }
    $scope.addRegisterNode =()=>{
        $scope.addNode(`<button ng-click="register()">注册</button>`)
    }
    //登录节点的生成
    $scope.login=()=>{
        post(`name=${$scope.name}&password=${$scope.password}`,'login',(user)=>{
            alert(user.message)
            if(!user.hasOwnProperty("type")){
                $scope.addNode.pop.hidden()
                $scope.user=user
                console.log($scope.user)
            }
        })
    }
    $scope.addLoginNode =()=>{
        $scope.addNode(`<button ng-click="login()">登录</button>`)
    }
    $scope.addNode =(html)=>{
        var loginHtml = inputHtml+html
        $scope.addNode.pop=new popup()
        element=$scope.addNode.pop.pop
        addNode(element, loginHtml,$compile,$scope)
        $scope.addNode.pop.show()
    }
    $scope.user=null
});
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
window.onload = () => {
    // addLogin(document.getElementById('register'))
    // document.getElementById('register').appendChild(document.createElement('br'))
    // addRegister(document.getElementById('register'))
}

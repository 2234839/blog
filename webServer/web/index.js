var state = angular.module('state',[]);//, ['ngSanitize']
/**
 * 注册控制器，用来注册？,需要添加一个标签来激活此模块
 */
state.controller('register', function ($scope,$compile,) {
    $scope.name = "";
    $scope.password = "";
    var inputHtml=` <input type="text" ng-model="name">
                    <input type="password" ng-model="password">`
    //注册节点的生成                
    var registerHtml = inputHtml+`<button ng-click="register()">注册</button>`
    $scope.register=()=>{
        post(`name=${$scope.name}&password=${$scope.password}`,'register')
    }
    $scope.addRegisterNode =(element)=>{
        addNode(element, registerHtml,$compile,$scope)
    }
    //登录节点的生成
    var loginHtml = inputHtml+`<button ng-click="login()">登录</button>`
    $scope.login=()=>{
        post(`name=${$scope.name}&password=${$scope.password}`,'login')
    }
    $scope.addLoginNode =(element)=>{
        addNode(element, loginHtml,$compile,$scope)
    } 
    addLogin=$scope.addLoginNode
    addRegister=$scope.addRegisterNode 
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
var post=(data,action,callback = (response) => { alert(response) }) => {
    var xhr = new XMLHttpRequest();
    xhr.open('POST',action, true);
    xhr.onload = function () {
        callback(xhr.response)
    }
    xhr.send(data);
}
window.onload = () => {
    addLogin(document.getElementById('aaa'))
    document.getElementById('aaa').appendChild(document.createElement('br'))
    addRegister(document.getElementById('aaa'))
}

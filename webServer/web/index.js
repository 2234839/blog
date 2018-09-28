var state = angular.module('state', []);//, ['ngSanitize']
/**
 * 注册控制器，用来注册？,需要添加一个标签来激活此模块
 */
var aaa
state.controller('user', function ($scope, $compile, ) {
    $scope.name = "";
    $scope.password = "";
    $scope.user = null
    var inputHtml = ` <input type="text" ng-model="name"><br/>
                    <input type="password" ng-model="password"><br/>`
    //注册节点的生成
    $scope.register = () => {
        post(`name=${$scope.name}&password=${$scope.password}`, 'register', (user) => {
            alert(user.message)
            if (!user.hasOwnProperty("type")) {
                $scope.addNode.pop.hidden()
                if (confirm("是否立即登录"))
                    $scope.addLoginNode()
            }
        })
    }
    $scope.addRegisterNode = () => {
        $scope.addNode(`<button ng-click="register()">注册</button>`)
    }
    //登录节点的生成
    $scope.login = () => {
        post(`name=${$scope.name}&password=${$scope.password}`, 'login', (user) => {
            alert(user.message)
            if (!user.hasOwnProperty("type")) {
                $scope.addNode.pop.hidden()
                $scope.$apply(() => {//angular的数据监听对于回调函数中的数据改变是存在问题的，所以我们需要自己调用apply
                    $scope.user = user
                });
            }
        })
    }
    $scope.addLoginNode = () => {
        $scope.addNode(`<button ng-click="login()">登录</button>`)
    }
    $scope.addNode = (html) => {
        var loginHtml = inputHtml + html
        $scope.addNode.pop = new popup()
        element = $scope.addNode.pop.pop
        addNode(element, loginHtml, $compile, $scope)
        $scope.addNode.pop.show()
    }
    $scope.log = console.log
});
state.controller('article', function ($scope) {
    $scope.articleTable = []
    post("", 'getArticle', (d) => {
        d.results.forEach(element => {
            $scope.$apply(() => {
                $scope.articleTable.push(element)
            });
        });
        
        console.log($scope.articleTable)
    })
})

window.onload = () => {
    
}
function aaa() {
    var textname = document.getElementById('a1').value
    var des = document.getElementById('a2').value
    var content = document.getElementById('a3').value
    var data = {
        textname: textname,
        des: des,
        content: content
    }
    post(JSON.stringify(data), 'article', (d) => {
        console.log(d)
    })
}
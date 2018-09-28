var state = angular.module('state', []);//, ['ngSanitize']
/**
 * 注册控制器，用来注册？,需要添加一个标签来激活此模块
 */
var aaa
state.controller('user', function ($scope, $compile, ) {
    $scope.name = "";
    $scope.password = "";
    $scope.user =JSON.parse(localStorage.getItem('user'))
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
                    //保存用户的基本信息到本地
                    localStorage.setItem('user',JSON.stringify($scope.user))
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
})
state.controller('article', function ($scope, $compile) {
    $scope.articleTable = []
    //保存当前是第几页
    $scope.page=1
    /**
     * 一般只需要 pageChange 参数 
     * @param {int} pageChange 控制翻页  1 或者 -1
     * @param {int} start 从第几行
     * @param {int} end 到第几行
     */
    $scope.getArticle=(pageChange,start=0,end=10)=>{
        let data={start:start,end:end}
        if(typeof pageChange != 'undefined'){
            if($scope.page+pageChange>=1)
                $scope.page=$scope.page+pageChange
            data.start=($scope.page-1)*10
            data.end=$scope.page*10
        }
        post(data, 'getArticle', (d) => {//获取文章
            if(d.type=="Error"){
                if(pageChange>0)
                    alert("这已经是最后面了哦！")
                else
                    alert("这已经是前后面了哦！")
                return
            }//console.log(`共有 ${d.num} 篇文章，计 ${d.num/10} 页`)
            d.results.forEach(element => {
                $scope.$apply(() => {
                    if($scope.articleTable.length>=10){
                        $scope.articleTable.unshift(element)
                        $scope.articleTable.pop()
                    }else
                        $scope.articleTable.push(element)
                });
            });
        })
    };
    $scope.getArticle()//立即调用以加载数据
    $scope.popup=new popup();
    $scope.article={
        textname: '',
        des: '',
        content: ''
    };//因为下面那里使用了立即执行的匿名函数所以需要添加分号
    (()=>{//创建文章编辑控件附加到popup上,TODO:或许可以创建一个函数继承popup来使得可以打开多个编辑器
        $scope.popup.mask.id="editArticle"
        var html = `<input type="text" name="textname" ng-model="article.textname"><br>
        <input type="text" name="des" ng-model="article.des"><br>
        <textarea name="content" cols="60" rows="20" ng-model="article.content"></textarea><br>
        <button ng-click="upArticle()">提交</button>`
        element = $scope.popup.pop;
        addNode(element,html, $compile, $scope)
    })()
    /**
     * 上传文章
     */
    $scope.upArticle=()=>{
        post(JSON.stringify($scope.article), 'article', (d) => {
            alert(d.message)
            if(d.hasOwnProperty('id'))//没有id属性说明没有发布成功
                $scope.popup.hidden()
        })
    }
})
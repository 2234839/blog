var state = angular.module('state', []);//, ['ngSanitize']
/**
 * 注册控制器，用来注册？,需要添加一个标签来激活此模块
 */
state.controller('user', function ($scope, $compile, ) {
    $scope.name = "";
    $scope.password = "";
    $scope.user = JSON.parse(localStorage.getItem('user'))
    var inputHtml = ` <input type="text" ng-model="name"><br/>
                    <input type="password" ng-model="password"><br/>`
    //注册
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
    //登录
    $scope.login = (userLogin=`name=${$scope.name}&password=${$scope.password}`) => {
        post(userLogin, 'login', (user) => {
            alert(user.message)
            if (!user.hasOwnProperty("type")) {
                if($scope.addNode.hasOwnProperty('pop'))//当存在遮罩层的时候影藏遮罩层，若不存在则这是一次纯粹的登录（如自动登录不涉及用户操作）
                    $scope.addNode.pop.hidden()
                $scope.$apply(() => {//angular的数据监听对于回调函数中的数据改变是存在问题的，所以我们需要自己调用apply
                    $scope.user = user
                    //保存用户的基本信息到本地
                });
                localStorage.setItem('user', JSON.stringify($scope.user))
                console.log("登录成功",user);
            }
        })
    }
    $scope.addLoginNode = () => {
        $scope.addNode(`<button ng-click="login()">登录</button> <button ng-click="addRegisterNode()">去注册</button>`)
    }
    /**
     * 注销当前账号TODO:还没有和服务器对接
     */
    $scope.cancellation=()=>{
        $scope.user = false
    }
    $scope.addNode = (html) => {
        var loginHtml = inputHtml + html
        $scope.addNode.pop = new popup()
        element = $scope.addNode.pop.pop
        addNode(element, loginHtml, $compile, $scope)
        $scope.addNode.pop.show()
    }
    $scope.log = console.log
    //自动登录
    if($scope.user && $scope.user.hasOwnProperty('name'))//由于浏览器会自动提供cookies故此处只需要提供name
        $scope.login("name="+$scope.user.name)
})
/**
 * 关于文章的一些操作
 */
state.controller('article', function ($scope, $compile) {
    $scope.articleTable = []//存储获得的文章对象
    $scope.Math = Math//为了在angular表达式中使用Math对象
    $scope.num = 0//总共有多少篇文章
    $scope.pageNum = []//存储页码，用于跳转的 select
    $scope._page = 0//保存当前是第几页
    Object.defineProperty($scope, "page", { //强化page的功能，设置page则直接跳转
        set: (x) => {
            //console.log("page",x)
            $scope._page = x
            $scope.getArticle($scope._page)
        }, 
        get: () => {return $scope._page }
    });
    /**
     * 从服务器获取其他页的文章
     * @param {int} i 前进i页或后退i页
     */
    $scope.jump=(i)=>{
        if($scope.page+i<0){
            alert("这已经是第一页了。")
            return
        }else if($scope.page+i>Math.ceil($scope.num/10)-1){
            alert("这已经是最后一页了。")
            return
        }
        $scope.page+=i
    }
    /**
     * 从服务器获取文章加载到页面中，一般只需要 pageChange 参数 
     * @param {int} pageChange 跳到第几页
     * @param {int} start 从第几行
     * @param {int} end 到第几行
     */
    $scope.getArticle = (pageChange=0, start = 0, end = 10) => {
        let data = { start: start, end: end }
        data.start = pageChange  * 10
        data.end = (pageChange+1) * 10
        post(data, 'getArticle', (d) => {//获取文章
            console.table(d.results)
            var _articleTable=[]
            d.results.forEach(element => {
                _articleTable.push(element)
            });
            $scope.$apply(() => {
                $scope.articleTable=_articleTable
                $scope.num = d.num;
                var pageCount=Math.ceil($scope.num / 10)
                for (let index = 0; index < pageCount; index++) {
                    if ($scope.pageNum[index] == undefined)
                        $scope.pageNum[index] =index
                }
            });
        })
    };
    $scope.popup = new popup();
    $scope.article = {
        textname: '',
        des: '',
        content: ''
    };//因为下面那里使用了立即执行的匿名函数所以需要添加分号
    (() => {//创建文章编辑控件附加到popup上,TODO:或许可以创建一个函数继承popup来使得可以打开多个编辑器
        $scope.popup.pop.className = "editArticle"
        var html = `<input type="text" name="textname" ng-model="article.textname"><br>
        <input type="text" name="des" ng-model="article.des"><br>
        <textarea name="content" cols="60" rows="20" ng-model="article.content"></textarea><br>
        <button ng-click="upArticle()">提交</button>`
        element = $scope.popup.pop;
        addNode(element, html, $compile, $scope)
    })()
    /**
     * 上传文章
     */
    $scope.upArticle = () => {
        post(JSON.stringify($scope.article), 'article', (d) => {console.log(d);
            alert(d.message)//打印返回的消息
            if (d.hasOwnProperty('id')){//没有id属性说明没有发布成功
                $scope.popup.hidden()
                if($scope.page==0){//如果当前在第一页则自动刷新
                    $scope.page=0
                }
            }
        })
    }
    /**
     * 删除文章
     * @param {int} num 文章编号
     */
    $scope.deleteArticle = (num) => {
        var user=JSON.parse(localStorage.getItem('user'))
        post(JSON.stringify({user:user,article:{num:num}}), 'deleteArticle', (d) => {
            console.log(d)
            alert(d.message)
            啊
        })
    }
    $scope.deleteArticle()
})
var state = angular.module('state', ['ngSanitize']);
state.controller('register', function($scope,$sce) {
    $scope.name= "";
    $scope.password= "";
    $scope.register=(callback=(response)=>{alert(response)})=>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'register', true);
        xhr.onload = function () {
            callback(xhr.response)
        };
        var data=`name=${$scope.name}&password=${$scope.password}`
        xhr.send(data);
    }
    $scope.inputHtml=`<input type="text" ng-model="name">
                    <input type="text" ng-model="password">
                    <input type="text" ng-model="name">
                    <button ng-click="register()">注册</button>`
    //angular 不能够直接绑定html数据 需要使用 ngSanitize 的 $sce 来过滤一下
    $scope.input=$sce.trustAsHtml($scope.inputHtml) 
});
state.controller('login', function($scope) {
    $scope.name= "";
    $scope.password= "";
    $scope.login=(callback=(response)=>{alert(response)})=>{
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'register', true);
        xhr.onload = function () {
            callback(xhr.response)
        };
        var data=`name=${$scope.name}&password=${$scope.password}`
        xhr.send(data);
    }
    $scope.input=`<input type="text" ng-model="name">
                  <input type="text" ng-model="password">
                  <button ng-click="register()">注册</button>`
});
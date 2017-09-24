angular.module("app",["ngRoute"])
   .config(["$routeProvider",function ($routeProvider) {
      $routeProvider
        .when("/in_theaters",{
           templateUrl:"./views/in_theaters/in_theaters.html",
          controller:"in_theatersCtrl"
        })
        .otherwise("/in_theaters")
   }])
  .controller("in_theatersCtrl",["$scope","$http","myService",function ($scope,$http,myService) {
    // $http发送同源数据的请求
        // $http({
        //   url:"js/in_theaters.json",
        //   method:"get"
        // }).then(function (res) {
        //   console.log(res);
        //   $scope.data = res.data;
        //   console.log($scope.data);
        // })

    // 利用服务里面定义的Jsonp发送跨域请求
    //  360搜索的接口地址  https://sug.so.360.cn/suggest 传入的参数为{word:1}

         myService.Jsonp("https://api.douban.com/v2/movie/in_theaters",{},function (data) {
           console.log(data);
           $scope.data = data;
           $scope.$apply();
         })
  }])
  .service("myService",[function () {
    this.Jsonp=function (url,data,callback) {
       var fn = "Jsonp" + Math.random().toString().replace(".","");
       window[fn] = callback;
       var str = "";
       for(var key in data){
         str += key + "=" + data[key] + "&";
       }
       var script = document.createElement("script");
       script.src= url + "?" + str + "callback=" + fn;
       document.body.appendChild(script);
       script.onload = function () {
         document.body.removeChild(script);
       }
    }
  }])
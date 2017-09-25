angular.module("app",["ngRoute"])
   .config(["$routeProvider",function ($routeProvider) {
     // 配置路由对象
      $routeProvider
        // 页码的参数占位符
        // 在设置了参数占位符的锚点地方，需要在被传入的模板链接中写入实际的参数(比如上一个页面是用一组a标签跳转链接，那么就需要a 标签里写入关于page的实际参数)
      // 但当用一个a标签表示一组跳转路劲时，可以先在a标签中设置第一页的参数，然后再在页面中的上下页按钮结合控制器中的$location.path()改变参数
        .when("/in_theaters/:page",{
          // 由于app.js文件最终是引入到index.html中，所以，这里的路径要根据index.html为相对目录
          templateUrl:"./views/in_theaters/in_theaters.html",
          controller:"in_theatersCtrl"
        })
        .when("/coming_soon/:page",{
          templateUrl:"./views/coming_soon/comingSoon.html",
          controller:"coming_soonCtrl"
        })
        .when("/search/:keyword/:page",{
          templateUrl:"./views/search/search.html",
          controller:"searchCtrl"
        })
        .otherwise("/in_theaters/1")
   }])
  .controller("navBarCtrl",["$scope","$location",function ($scope,$location) {
    $scope.isActive = "in_theaters";
    $scope.search = function () {
      // $location.path()可以自动将页面跳转至指定的锚点值页面(搜索页面需要关键字和页码)
      $location.path("/search/" + $scope.keyword + "/1");
    }
  }])
  .controller("in_theatersCtrl",["$scope","$http","myService","$routeParams","$location",function ($scope,$http,myService,$routeParams,$location) {
        // $http发送同源数据的请求
        // $http({
        //   url:"js/in_theaters.json",
        //   method:"get"
        // }).then(function (res) {
        //   console.log(res);
        //   $scope.data = res.data;
        //   console.log($scope.data);
        // })

       var url = myService.url + "/v2/movie/in_theaters";
       // 根据路由参数获取到每一页的页码
       var page = $routeParams.page;
       // 每页请求10条数据
       var count = 10;
       // 每一页请求的起始数据下标为
       var start = (page - 1)*count;
       // 总共的页数为
       var totalPage = 0;

        // 利用服务里面定义的Jsonp发送跨域请求,由于数据是分页的，所以需要根据每一页不同的页码请求不同页的数据
        // 可以根据start 和 count的值，作为形参传入Jsonp
        //  360搜索的接口地址  https://sug.so.360.cn/suggest 传入的参数为{word:1}

         myService.Jsonp(url,
           {
             start:start,
             count:count
           },
           function (data) {
           console.log(data);
           $scope.data = data;
           // 由于这个Jsonp请求是用原生JS方法写的，angularjs监听不到数据的变化，所以需要调用$scope.$apply()，将数据的变化通知到angularjs
           $scope.$apply();

           // 在数据请求的成功的回调里面，计算出总页码
             totalPage = Math.ceil(data.total/data.count);
         });

         $scope.changePage = function (type) {
           if(type == "prev"){
             page --;
             if(page < 1){
               page = 1;
             }
           } else if(type == "next"){
             page ++;
             if(page > totalPage){
               page = totalPage;
             }
           }
           // 根据点击实现上下页的跳转，再跳转的时候，传入跳转的页码，
           // 这样在一开始渲染页面的时候，可以根据通过路由参数得到页码，根据页码去请求对应页面的数据
           $location.path("/in_theaters/" + page);
         }
  }])
  .controller("coming_soonCtrl",["$scope","$http","myService","$routeParams","$location",function ($scope,$http,myService,$routeParams,$location) {
    // $http发送同源数据的请求
    // $http({
    //   url:"js/in_theaters.json",
    //   method:"get"
    // }).then(function (res) {
    //   console.log(res);
    //   $scope.data = res.data;
    //   console.log($scope.data);
    // })

    var url = myService.url + "/v2/movie/coming_soon";
    // 根据路由参数获取到每一页的页码
    var page = $routeParams.page;
    // 每页请求10条数据
    var count = 10;
    // 每一页请求的起始数据下标为
    var start = (page - 1)*count;
    // 总共的页数为
    var totalPage = 0;

    // 利用服务里面定义的Jsonp发送跨域请求,由于数据是分页的，所以需要根据每一页不同的页码请求不同页的数据
    // 可以根据start 和 count的值，作为形参传入Jsonp
    //  360搜索的接口地址  https://sug.so.360.cn/suggest 传入的参数为{word:1}

    myService.Jsonp(url,
      {
        start:start,
        count:count
      },
      function (data) {
        console.log(data);
        $scope.data = data;
        // 由于这个Jsonp请求是用原生JS方法写的，angularjs监听不到数据的变化，所以需要调用$scope.$apply()，将数据的变化通知到angularjs
        $scope.$apply();

        // 在数据请求的成功的回调里面，计算出总页码
        totalPage = Math.ceil(data.total/data.count);
      });

    $scope.changePage = function (type) {
      if(type == "prev"){
        page --;
        if(page < 1){
          page = 1;
        }
      } else if(type == "next"){
        page ++;
        if(page > totalPage){
          page = totalPage;
        }
      }
      $location.path("/coming_soon/" + page);
    }
  }])
  .controller("searchCtrl",["$scope","$http","myService","$routeParams","$location",function ($scope,$http,myService,$routeParams,$location) {
    // $http发送同源数据的请求
    // $http({
    //   url:"js/in_theaters.json",
    //   method:"get"
    // }).then(function (res) {
    //   console.log(res);
    //   $scope.data = res.data;
    //   console.log($scope.data);
    // })

    var url = myService.url + "/v2/movie/search";
    var keyword = $routeParams.keyword;
    // 根据路由参数获取到每一页的页码
    var page = $routeParams.page;
    // 每页请求10条数据
    var count = 10;
    // 每一页请求的起始数据下标为
    var start = (page - 1)*count;
    // 总共的页数为
    var totalPage = 0;

    // 利用服务里面定义的Jsonp发送跨域请求,由于数据是分页的，所以需要根据每一页不同的页码请求不同页的数据
    // 可以根据start 和 count的值，作为形参传入Jsonp
    //  360搜索的接口地址  https://sug.so.360.cn/suggest 传入的参数为{word:1}

    myService.Jsonp(url,
      {
        q:keyword,
        start:start,
        count:count
      },
      function (data) {
        console.log(data);
        $scope.data = data;
        // 由于这个Jsonp请求是用原生JS方法写的，angularjs监听不到数据的变化，所以需要调用$scope.$apply()，将数据的变化通知到angularjs
        $scope.$apply();

        // 在数据请求的成功的回调里面，计算出总页码
        totalPage = Math.ceil(data.total/data.count);
      });

    $scope.changePage = function (type) {
      if(type == "prev"){
        page --;
        if(page < 1){
          page = 1;
        }
      } else if(type == "next"){
        page ++;
        if(page > totalPage){
          page = totalPage;
        }
      }
      $location.path("/search/" + keyword +"/" + page);
    }
  }])
  .service("myService",[function () {
    this.url = "https://api.douban.com";
    // 在服务里封装一个Jsonp方法，用来发送跨域请求。
    // （因为angularjs本身用来发送跨域请求的$http.jsonp（）方法返回的回调函数的名字带"."，而豆瓣接口接受的回调函数不支持带"."的回调函数，所以需要自己封装JSONP）
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
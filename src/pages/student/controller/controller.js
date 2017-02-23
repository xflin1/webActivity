var uiToast = require('component/uiToast');
var uiDropMenu = require('component/uiDropMenu');
var uiUploader = require('component/uiUploader');
var uiCarousel = require('component/uiCarousel');
var uiAccordion = require('component/uiAccordion');
var magic = require('../../../../util/magic.js');
var Promise = require('bluebird');
var util = require('component/util.js');
module.exports = function(App){
    uiToast(App);
    uiDropMenu(App);
    uiUploader(App);
    uiCarousel(App);
    uiAccordion(App);
    App.controller('main',
        ['$scope','ToastService','$$action',function($scope,ToastService,$$action){
            $scope.menus = {
                action:{
                    name:"信息列表",
                    url:"#"+magic.NG_STUDENT_HOME,
                    icon:"list"
                },
                signed:{
                    name:'我的活动',
                    url:"#"+magic.NG_STUDENT_SIGNED,
                    icon:"list-alt"
                },
                config:{
                    name:"发布信息",
                    url:"#"+magic.NG_STUDENT_MANAGE,
                    icon:"plus-square"
                },
                info:{
                    name:"个人信息",
                    url:"#"+magic.NG_STUDENT_INFO,
                    icon:"user "
                },
                quit:{
                    name:"注销",
                    url:"/logout",
                    icon:"power-off"
                }
            };
            $scope.toastService = ToastService;
    }]);

    App.directive('uiUserNickname',['$$action',function($$action){
        return {
            restrict:'A',
            template:"<div><div class='fa fa-user-o'/>&nbsp{{nickname}}</div>",
            scope:{
                uid:'=uiUserNickname'
            },
            replace:true,
            link:function(scope){
                $$action.userInfo(scope.uid)
                 .then(function(data){
                 if(data.code===0){
                     scope.nickname = data.user.nickname;
                 }else{
                     scope.nickname=null;
                 }
                 });
            }
        }
    }]);
    App.controller('home',
        ['$scope','$$action','$timeout',function($scope,$$action,$timeout){
            var container = angular.element('#wrapper');
            var height = container[0].offsetHeight;
            $scope.scrollDisabled = false;
            $scope.loading = false;
            $scope.container = angular.element('#wrapper');
            $scope.singlePage = Math.ceil(height/90);
            $scope.lists = [];
            $scope.listInfo = {
                start:0,
                end:false
            };
            $scope.getLists = function(){
                $scope.loading = true;
                $$action.userListData($scope.listInfo.start,$scope.singlePage).then(function(data){
                    $$action.$apply(function(){
                        if(data.code==0){
                            if(data.list.length==$scope.singlePage){
                                $scope.lists.push(data.list);
                                $scope.listInfo.start=$scope.listInfo.start+1;
                            }else if(data.list.length!=0){
                                $scope.lists.push(data.list);
                                $scope.listInfo.start=$scope.listInfo.start+1;
                                $scope.listInfo.end=true;
                            }else{
                                $scope.listInfo.end=true;
                            }
                        }else{
                            util.handleRes(data);
                        }
                        $scope.scrollDisabled=false;
                        $scope.loading = false;
                    });
                }).catch(function(error){
                    console.log(error);
                    util.handleError(error);
                });
            };
            $scope.pageFunction = function(){
                if($scope.scrollDisabled===false&&$scope.listInfo.end===false){
                    $scope.getLists();
                    $scope.scrollDisabled=true;
                }
            };
        }]);

    App.controller('registerAdmin',
        ['$scope','$$action','$routeParams','ToastService','$location','$route'
            ,function($scope,$$action,$routeParams,ToastService,$location,$route){
            $scope.image = {
                image:null
            };
            $scope.title = '';
            $scope.content = null;
            $scope.registerStatus = false;
            $scope.accordionData = {
                accordionFa:'fa-user',
                accordionName:'报名用户',
                subMenu:[]
            };

            $$action.adminData($routeParams.id).then(function(data){
                $$action.$apply(function(){
                    if(data.code==0){
                        $scope.content = data.data;
                        $scope.image.image = data.data['msgAttrs']['image'];
                    }else{
                        util.handleRes(data);
                    }
                });
            }).catch(function(error){
                console.log(error);
                util.handleError(error);
            });
            $$action.adminRegisterUser($routeParams.id)
                .then(function(data){
                    $$action.$apply(function(){
                        if(data.code===0){
                            var length = data.list.length;
                            console.log(data.list);
                            for(var i=0;i<length;i++){
                                $scope.accordionData.subMenu.push({
                                    name:data.list[i].nickname,
                                    href:''
                                });
                            }
                        }
                    });

                })
                .catch(function(error){
                    console.log(error);
                    util.handleError(error);
                });
        }]);

    App.controller('register',
        ['$scope','$$action','$routeParams','ToastService','$location','$loader','$route'
            ,function($scope,$$action,$routeParams,ToastService,$location,$loader,$route){
            $scope.image = {
              image:null
            };
            $scope.title = '报名帖1';
            $scope.content = null;
            $scope.registerStatus = false;
            $$action.userData($routeParams.id).then(function(data){
                $$action.$apply(function(){
                    if(data.code==0){
                        $scope.content = data.data;
                        $scope.image.image = data.data['msgAttrs']['image'];
                    }else{
                        util.handleRes(data);
                    }
                });
            }).catch(function(error){
                console.log(error);
                util.handleError(error);
            });
            $$action.userPersonal($routeParams.id).then(function(data){
                $$action.$apply(function(){
                    if(data.code===0){
                        if(data.data.length===1){
                            $scope.registerStatus = (data.data[0]['status']===-1)
                        }else{
                            $scope.registerStatus = false;
                        }
                    }else{
                        util.handleRes(data);
                    }
                });
            }).catch(function(error){
                console.log(error);
                util.handleError(error);
            });


            $scope.toggleSign = function(){
                if($scope.registerStatus){
                    $scope.unSign();
                }else{
                    $scope.sign();
                }
            };
            $scope.sign= function(){
                ToastService.showLoading('提交中');
                $$action.userSubmit($routeParams.id,-1)
                    .then(function(data){
                        $$action.$apply(function(){
                            if(data.code==0){
                                ToastService.showSuccess('报名成功',function(){
                                    $route.reload();
                                });
                            }else{
                                ToastService.showWarning('报名失败',function(){
                                    $route.reload();
                                });
                                util.handleRes(data);
                            }
                        });
                    }).catch(function(error){
                    ToastService.showWarning('未知错误');
                    util.handleError(error);
                });

            };
            $scope.unSign = function(){
                ToastService.showLoading('取消中');
                $$action.userSubmit($routeParams.id,0).then(function(data){
                    $$action.$apply(function() {
                        if(data.code==0){
                            ToastService.showSuccess('取消成功',function(){
                                $route.reload();
                            });
                        }else{
                            ToastService.showWarning('取消失败',function(){
                                $route.reload();
                            });
                            util.handleRes(data);
                        }
                    });
                }).catch(function(error){
                    ToastService.showWarning('未知错误');
                    util.handleError(error);
                });
            };
            $scope.back = function(){
                var path = $location.path();
                var arr = path.split('/');
                arr[2]=':id';
                path = arr.join('/');
                $$action.back(path);
            };
        }]);
    App.controller('signed',
        ['$scope','$$action',function($scope,$$action){
            var container = angular.element('#wrapper');
            var height = container[0].offsetHeight;
            $scope.scrollDisabled = false;
            $scope.loading = false;
            $scope.container = angular.element('#wrapper');
            $scope.singlePage = 1/*Math.ceil(height/90);*/
            $scope.lists = [];
            $scope.listInfo = {
                start:0,
                end:false
            };
            $scope.getLists = function(){
                $scope.loading = true;
                $$action.userPersonalList(-1,1,$scope.singlePage,$scope.listInfo.start).then(function(data){
                    $$action.$apply(function(){
                        if(data.code==0){
                            if(data.list.length==$scope.singlePage){
                                $scope.lists.push(data.list);
                                $scope.listInfo.start=$scope.listInfo.start+1;
                            }else if(data.list.length!=0){
                                $scope.lists.push(data.list);
                                $scope.listInfo.end=true;
                            }else{
                                $scope.listInfo.end=true;
                            }
                        }else{
                            util.handleRes(data);
                        }
                        $scope.scrollDisabled=false;
                        $scope.loading = false;
                    });
                }).catch(function(error){
                    console.log(error);
                    util.handleError(error);
                });
            };

            $scope.pageFunction = function(){
                if($scope.scrollDisabled===false&&$scope.listInfo.end===false){
                    $scope.getLists();
                    $scope.scrollDisabled=true;
                }
            };
        }]);
    App.controller('addList',
        ['$scope','$$action','$routeParams','$location','$location',
            function($scope,$$action,$routeParams,$location){
                var container = angular.element('#wrapper');
                var height = container[0].offsetHeight;
                $scope.scrollDisabled = false;
                $scope.loading = false;
                $scope.container = angular.element('#wrapper');
                $scope.singlePage = Math.ceil(height/90);
                $scope.lists = [];
                $scope.listInfo = {
                    start:0,
                    end:false
                };
                $scope.vid = $routeParams.vid;
                $scope.getLists = function(){
                    $$action.adminDataList($routeParams.vid,$scope.listInfo.start,$scope.singlePage).then(function(data){
                        $$action.$apply(function(){
                            if(data.code==0){
                                if(data.list.length===$scope.singlePage){
                                    $scope.lists.push(data.list);
                                    $scope.listInfo.start=$scope.listInfo.start+1;
                                }else if(data.list.length!=0){
                                    $scope.lists.push(data.list);
                                    $scope.listInfo.end=true;
                                }else{
                                    $scope.listInfo.end=true;
                                }
                            }else{
                                util.handleRes(data);
                            }
                            $scope.scrollDisabled=false;
                            $scope.loading = false;
                        });
                    }).catch(function(error){
                        console.log(error);
                        util.handleError(error);
                    });
                };
                $scope.pageFunction = function(){
                    if($scope.scrollDisabled===false&&$scope.listInfo.end===false){
                        $scope.getLists();
                        $scope.scrollDisabled=true;
                    }
                };
                $scope.back = function(){
                    var path = $location.path();
                    var arr = path.split('/');
                    arr[3]=':vid';
                    path = arr.join('/');
                    $$action.back(path);
                };

        }]);
    App.controller('loaderManage',['$$action','$routeParams','$scope',
        function($$action,$routeParams,$scope){
            console.log($routeParams.vid);
            console.log($routeParams.id);
            $scope.back = function(){
                var path = $location.path();
                var arr = path.split('/');
                arr[3]=':vid';
                path = arr.join('/');
                $$action.back(path);
            };
    }]);
    App.controller('loaderAdd',
        ['$scope','$$action','$timeout','$routeParams','ToastService','$loaderAdd','$location',
            function($scope,$$action,$timeout,$routeParams,ToastService,$loaderAdd,$location){
                $scope.loaderInfo={
                    src:null,
                    data:{},
                    content:null,
                    description:null,
                    name:null,
                    image:0,
                    vid:$routeParams.vid,
                    list:null,
                    select:[]
                };
                $scope.data = null;

                $$action.publishLoader($routeParams.st,$routeParams.vid).then(function (data) {
                    $$action.$apply(function(){
                        if(data.code==0){
                            $loaderAdd.initLoader($scope.loaderInfo,data.action);
                        }else{
                            ToastService.showWarning('异常跳转中..',function(){
                                $$action.location(magic.NG_STUDENT_MANAGE);
                            });
                            util.handleRes(data);
                        }
                    })
                }).catch(function(error){
                    console.log(error);
                    util.handleError(error);
                });
                $scope.back = function(){
                    var path = $location.path();
                    var arr = path.split('/');
                    arr[3]=':vid&:st';
                    path = arr.join('/');
                    $$action.back(path);
                };
                $scope.submit = function(){
                    ToastService.showLoading('提交中');
                    $loaderAdd.submit()
                        .then(function(data){
                            $$action.$apply(function(){
                                if(data.code==0){
                                    ToastService.showSuccess('提交成功',function(){
                                        $$action.location(magic.NG_STUDENT_MANAGE);
                                    });
                                }else{
                                    ToastService.showWarning('提交失败');
                                    util.handleRes(data);
                                }
                            });
                        })
                        .catch(function(error){
                            console.log(error);
                            util.handleError(error);
                        });
                };
                $$action.publishTarget($routeParams.vid)
                    .then(function(data){
                        var tree = [];
                        $$action.createTree(data.target,tree);
                        $scope.data = data.target;
                        $scope.loaderInfo.list = tree;
                    });
                $scope.getName= function(id){
                    for(var i=0;i<$scope.data.length;i++){
                        if($scope.data[i].id===id){
                            return $scope.data[i].name;
                        }
                    }
                    return 'Error';
                };

                $scope.showTarget = function(){
                    angular.element('.ui-target-container').show();
                    angular.element('#uiTarget').addClass('ui-target-show')
                };
                $scope.deleteTarget = function(index){
                    for(var i=0;i<$scope.data.length;i++){
                        if($scope.data[i].id===$scope.loaderInfo.select[index]){
                            $scope.data[i].select=false;
                            $scope.loaderInfo.select.splice(index,1);
                            break;
                        }
                    }
                }
            }]);

    App.directive('uiTarget',[function(){
        return {
            restrict:'A',
            replace:false,
            template:'<div class="ui-target-list" ui-swipe-right="swipeLeft()">' +
                        '<ul>' +
                            '<li ng-repeat="item in data track by $index">' +
                                '<a class="weui-cell weui-cell_access weui-flex__item ui-target-item" style="position: relative" ng-click="showChild($event)">' +
                                    '<div class="weui-cell__bd weui-cell_primary">{{item.name}}</div>' +
                                    '<div class="ui-target-add " ng-click="addTarget($event,item,$index)" ng-class=item.select?"ui-target-delete":"">{{item.select?"删除":"添加"}}</div>' +
                                    '<div class="weui-cell__ft" ng-hide="item.child.length===0"></div>' +
                                '</a>' +
                                '<div class="ui-target-wrap" ui-target="item.child" target-select="select" ng-hide="item.child.length===0" />' +
                            '</li>' +
                        '</ul>' +
                    '</div>',
            scope:{
                data:'=uiTarget',
                select:'=targetSelect'
            },
            link:function(scope,elem){
                for(var key in scope.data){
                    if(scope.data.hasOwnProperty(key)){
                        for(var j=0;j<scope.select.length;j++){
                            if(scope.data[key].id==scope.select[j]){
                                scope.data[key].select = true;
                                break;
                            }else{
                                scope.data[key].select = false;
                            }
                        }
                    }
                }
                scope.showChild = function(event){
                    var tmp = angular.element(event.target);
                    var child;
                    if(tmp.is('.ui-target-add')){
                        return;
                    }
                    while(!tmp.is('a')){
                        tmp = tmp.parent();
                    }
                    child = tmp.next('.ui-target-wrap');
                    child.show();
                    child.addClass('ui-target-show');
                };
                scope.hideChild = function(event){
                    var child = angular.element(event.target);
                    if(child.is('.ui-target-show')){
                        var childs = child.find('.ui-target-show');
                        for(var i=0;i<childs.length;i++){
                            angular.element(childs[i]).removeClass('ui-target-show');
                        }
                        child.removeClass('ui-target-show');
                        if(child.parent().is('.ui-target-container')){
                            child.parent().hide();
                        }
                    }
                };
                elem.on('click',scope.hideChild);
                scope.addTarget = function(event,item){
                    /*angular.element(event.target).toggleClass('ui-target-delete');*/
                    item.select = !item.select;
                    if(item.select===true){
                        scope.select.push(item.id);
                    }else{
                        for(var i=0;i<scope.select.length;i++){
                            if(scope.select[i]===item.id){
                                scope.select.splice(i,1);
                                break;
                            }
                        }
                    }
                };
                scope.swipeLeft = function(){
                    var child = angular.element(elem);
                    if(child.is('.ui-target-show')){
                        var childs = child.find('.ui-target-show');
                        for(var i=0;i<childs.length;i++){
                            angular.element(childs[i]).removeClass('ui-target-show');
                        }
                        child.removeClass('ui-target-show');
                        if(child.parent().is('.ui-target-container')){
                            child.parent().hide();
                        }
                    }
                }
            }

        }
    }]);

    App.controller('registerAdd',['$scope','$loaderAdd',
        function($scope,$loaderAdd){
            $scope.service = $loaderAdd.loaderInfo();
            $scope.Register = $loaderAdd.loaderInfo().data.Register;
            $scope.list = $loaderAdd.loaderInfo().list;
            $scope.select = $loaderAdd.loaderInfo().select;
        }]);
    App.controller('manageList',['$scope','$loaderAdd','$$action','ToastService','$location',
        function($scope,$loaderAdd,$$action,ToastService,$location){
            $scope.getLists = function () {
                ToastService.showLoading('加载中');
                $$action.adminVendorList().then(function (data) {
                    $$action.$apply(function () {
                        if(data.code==0){
                            $scope.lists = data.list;
                            ToastService.clear();
                            if(data.list.length==1){
                                $location.path(magic.NG_STUDENT_MANAGE_VENDOR.replace(':vid',data.list[0].id));
                            }
                        }else{
                            ToastService.showWarning('异常跳转中..',function(){
                                $$action.location(magic.NG_STUDENT_HOME);
                            });
                        }
                    })
                }).catch(function(error){
                    ToastService.showWarning('异常跳转中..',function(){
                        $$action.location(magic.NG_STUDENT_HOME);
                    });
                    console.log(error);
                    util.handleError(error);
                });

            };
            (function init(){
                $scope.getLists();
            })();
        }]);
    App.controller('manageVendor',['$scope','$loaderAdd','$$action','$routeParams','ToastService','$location',
        function($scope,$loaderAdd,$$action,$routeParams,ToastService,$location){
            $scope.vendorInfo = null;
            $scope.backSign=false;//后退时候,是否跳过企业选择,单个则跳过
            $scope.accordionData = {
                accordionFa:'fa-edit',
                accordionName:'信息类型',
                subMenu:[]
            };
            $scope.getLists = function () {
                ToastService.showLoading('加载中');
                var vid = $routeParams.vid;
                $$action.adminVendorList().then(function (data) {
                    $$action.$apply(function () {
                        if(data.code==0){
                            for(var i=0;i<data.list.length;i++){
                                if(data.list[i].id==vid){
                                    $scope.vendorInfo = data.list[i];
                                    if(data.list.length==1){
                                        $scope.backSign=true;
                                    }
                                    ToastService.clear();
                                    break;
                                }
                            }
                            if($scope.vendorInfo==null){
                                ToastService.showWarning('异常跳转中..',function(){
                                    $$action.location(magic.NG_STUDENT_MANAGE);
                                });
                            }
                        }
                    })
                }).catch(function(error){
                    ToastService.showWarning('异常跳转中..',function(){
                        $$action.location(magic.NG_STUDENT_MANAGE);
                    });
                    console.log(error);
                    util.handleError(error);
                });
                $$action.adminTypeList(vid).then(function (data) {
                    $$action.$apply(function () {
                        if(data.code==0){
                            var length = data.list.length;
                            for(var i=0;i<length;i++){
                                data.list[i]['href']=
                                    '#/loader/add/:vid&:st'.replace(':vid',vid)
                                        .replace(':st',data.list[i]['id']);
                                $scope.accordionData.subMenu.push(data.list[i]);
                            }
                        }
                    })
                }).catch(function(error){
                    ToastService.showWarning('异常跳转中..',function(){
                        $$action.location(magic.NG_STUDENT_MANAGE);
                    });
                    console.log(error);
                    util.handleError(error);
                });
            };
            $scope.back = function(){
                var path = $location.path();
                var arr = path.split('/');
                arr[2]=':vid';
                path = arr.join('/');
                $$action.back(path,$scope.backSign);
            };


            (function init(){
                $scope.getLists();
            })();
        }]);


    App.service('$loaderAdd',['$rootScope','$http','$$action','ToastService',
        function($rootScope,$http,$$action,ToastService){
            var _loaderInfo = null;

            /**
             * 初始化loaderInfo
             * @param loaderInfo
             * @private
             */
            var _initLoader = function(loaderInfo){
                _loaderInfo = loaderInfo;
            };

            var _addActionData = function(data,action){
                /**
                 * 添加action对应需要的数据
                 */
                if(action=='Register'){
                    data['Register']={
                        limit:0
                    }
                }
            };
            /**
             *
             * @param {function} fuc
             * @private
             */
            var _apply = function(fuc){
                if($rootScope.$$phase){
                    fuc();
                }else{
                    $rootScope.$apply(function(){
                        fuc();
                    });
                }
            };
            var parserActions = function(action){
                _apply(function(){
                    _loaderInfo.src = magic.URL_SERVICE_PUBLISH_ACTION.replace(':action',action);
                    //_loaderInfo.src = magic.URL_STUDENT_NORMAL_ADD;
                  ToastService.clear();
                    _loaderInfo.action = action;
                })
            };
            return{
                initLoader:function(loaderInfo,action){
                    _initLoader(loaderInfo);
                    parserActions(action)
                },
                loaderInfo:function(){
                    return _loaderInfo;
                },
                submit:function(){
                    return $$action.publishSubmit(_loaderInfo)
                },
                pre:function(){

                }
            };
        }]);
    App.controller('loader',
        ['$scope','$$action','$timeout','$routeParams','ToastService','$loader',
            function($scope,$$action,$timeout,$routeParams,ToastService,$loader){
                ToastService.showLoading('加载中');
                $scope.loaderInfo={
                    src:null
                };
                $loader.initLoader($scope.loaderInfo);
                $$action.userLoader($routeParams.id).then(function(data){
                    if(data.code===0){
                        $loader.parserActions(data.action);
                    }else{
                        ToastService.showWarning('异常跳转中..',function(){
                             $$action.location(magic.NG_STUDENT_HOME);
                        });
                        util.handleRes(data);
                    }
                }).catch(function(error){
                    console.log(error);
                    util.handleError(error);
                });
        }]);
    App.controller('userInfo',
        ['$scope','$$action',function($scope,$$action){
            $$action.getSelf().then(function(data){
                $scope.selfInfo=data.list[0];
            });

        }]);
    App.controller('userInfoUpdate',['$scope','$http','$$action','$routeParams','$location',
        function($scope,$http,$$action,$routeParams,$location){
            $scope.template = {
                qq:'QQ',
                email:'Email',
                phone:'电话',
                nickname:'昵称',
                sex:'性别'
            };
            console.log($scope.template.hasOwnProperty($routeParams.type));
            if(!$scope.template.hasOwnProperty($routeParams.type)){
                $location.path(magic.NG_STUDENT_INFO);
            }else{
                $scope.type = $routeParams.type;
                $$action.getSelf().then(function(data){
                    $scope.info=(data.list[0])[$routeParams.type];
                });
                $scope.submitting = '修改';
            }

            $scope.submit = function(info){
                var data = {
                };
                data[$routeParams.type] = info;
                var url = magic.URL_USER_MODIFY;
                $http.post(url,data).
                success(function(data){
                    if(data.code == 0)
                    {
                        $location.path(magic.NG_STUDENT_INFO);
                    }
                });
                $scope.submitting = '提交中';
            };
        }]);
    App.controller('password',['$scope','$http','$location',
        function($scope,$http,$location){
            $scope.submitting = '保存';
            $scope.submitPWD = function(user){
                var data = {
                    pass:user['newPassword']
                };
                var url = magic.URL_USER_MODIFY;
                $http.post(url,data).
                success(function(data){
                    if(data.code==0)
                        $location.path(magic.NG_STUDENT_INFO);
                });
                $scope.submitting = '提交中';
            };
        }]);

    App.controller('adminLoader',['$scope','$routeParams','$$action','$location','$adminLoader','ToastService',
        function($scope,$routeParams,$$action,$location,$adminLoader,ToastService){
            $scope.loaderInfo={
                src:null
            };
            $scope.back = function(){
                var path = $location.path();
                var arr = path.split('/');
                arr[3]=':vid&:id';
                path = arr.join('/');
                $$action.back(path);
            };

            $$action.adminLoader($routeParams.id)
                .then(function(data){
                    if(data.code===0){
                        $adminLoader.initLoader($scope.loaderInfo);
                        $adminLoader.parserActions(data.action);
                    }else{
                        ToastService.showWarning('异常跳转中..',function(){
                            $$action.location(magic.NG_STUDENT_HOME);
                        });
                        util.handleRes(data);
                    }
                })
                .catch(function(error){
                    console.log(error);
                    util.handleError(error);
                });
        }]);

    App.service('$adminLoader',['$rootScope','$http','$location','ToastService',
        function($rootScope,$http,$location,ToastService){
            var _loaderInfo = null;
            var _action = {
                status:null
            };

            /**
             * 初始化loaderInfo
             * @param loaderInfo
             * @private
             */
            var _initLoader = function(loaderInfo){
                _loaderInfo = loaderInfo;
            };
            /**
             *
             * @param {function} fuc
             * @private
             */
            var _apply = function(fuc){
                if($rootScope.$$phase){
                    fuc();
                }else{
                    $rootScope.$apply(function(){
                        fuc();
                    });
                }
            };
            return{
                action:_action,
                initLoader:function(loaderInfo){
                    _initLoader(loaderInfo);
                },
                parserActions:function(action){
                    _apply(function(){
                        _loaderInfo.src = magic.URL_SERVICE_ADMIN_ACTION.replace(':action',action);
                        ToastService.clear();
                    })
                }
            }
        }]);

    App.service('$loader',['$rootScope','$http','$location','ToastService',
        function($rootScope,$http,$location,ToastService){
            var _loaderInfo = null;
            var _action = {
                status:null
            };

            /**
             * 初始化loaderInfo
             * @param loaderInfo
             * @private
             */
            var _initLoader = function(loaderInfo){
                _loaderInfo = loaderInfo;
            };
            /**
             *
             * @param {function} fuc
             * @private
             */
            var _apply = function(fuc){
                if($rootScope.$$phase){
                    fuc();
                }else{
                    $rootScope.$apply(function(){
                        fuc();
                    });
                }
            };
            return{
                action:_action,
                initLoader:function(loaderInfo){
                    _initLoader(loaderInfo);
                },
                parserActions:function(action){
                    _apply(function(){
                        _loaderInfo.src = magic.URL_SERVICE_USER_ACTION.replace(':action',action);
                        ToastService.clear();
                    })
                }
            }
        }]);
    App.service('$$action',['$rootScope','$http','$location','$routeParams',
        function($rootScope,$http,$location,$routeParams){

            /**
             * 根据url和body 获取http post结果
             * @param url
             * @param [body]
             * @returns {bluebird|exports|module.exports}
             * @private
             */
            var _getBase = function(url,body){
                body==undefined?body={}:body;
                return $http.post(url,body).then(function(data){
                    util.handleRes(data.data);
                    return Promise.resolve(data.data);
                },function(err){
                    return Promise.reject(err);
                });
            };
            /**
             * 根据url前端路由跳转
             * @param url
             * @private
             */
            var _location = function(url){
                _apply(function(){
                    $location.path(url);
                });
            };
            /**
             *
             * @param {function} fuc
             * @private
             */
            var _apply = function(fuc){
                if($rootScope.$$phase){
                    fuc();
                }else{
                    $rootScope.$apply(function(){
                        fuc();
                    });
                }
            };
            /**
             * action submit data格式
             * @param sd
             * @param action
             * @param data
             * @returns {{action: *, sd: *, data: *}}
             * @private
             */
            var _actionData = function(sd,action,data){
                return {
                    action:action,
                    sd:sd,
                    data:data
                };
            };
            /**
             * 将target数据转换子父关系放在tree中
             * @param {Array} target
             * @param {Array} tree
             * @private
             */
            var _createTree = function(target,tree){
                var targetLength = target.length;
                var treeLength = tree.length;
                var i,j;
                for(i=0;i<targetLength;i++){
                    target[i]['child']=[];
                }
                for(i=0;i<targetLength;i++){
                    treeLength = tree.length;
                    tree.push(target[i]);
                    for(j=0;j<target.length;j++){
                        if(target[i]['parentId']===target[j]['id']){
                            target[j]['child'].push(target[i]);
                            tree.pop();
                            break;
                        }
                    }
                }
            };
            return {
                getRegisterDetails:function(id){
                    return _getBase(magic.URL_REGISTER_DETAIL,{id:id});
                },
                getSelf:function(){
                    return _getBase(magic.URL_USER_SELF);
                },
                loader:function(id){
                    return _getBase(magic.URL_LOADER,{id:id});
                },
                submitData:function(sd,action,data){
                    return _getBase(magic.URL_LOADER_SUBMIT,_actionData(sd,action,data));
                },
                cancelData:function(sd,action,data){
                    return _getBase(magic.URL_LOADER_CANCEL,_actionData(sd,action,data));
                },
                findDataList:function(start,st){
                    return _getBase(magic.URL_LOADER_LIST,{start:start,st:st});
                },
                findCompleteDataList:function(start){
                    return _getBase(magic.URL_LOADER_LIST_COMPLETE,{start:start});
                },
                findAddList:function(start,st,vid){
                    return _getBase(magic.URL_LOADER_LIST,{start:start,st:st,vid:vid});
                },
                loaderAdd:function(vid){
                    return _getBase(magic.URL_LOADER_ADD,{vid:vid});
                },
                loaderAddSubmit:function(data){
                    return _getBase(magic.URL_LOADER_ADD_SUBMIT,data);
                },
                manageList:function () {
                    return _getBase(magic.URL_LOADER_MANAGE);
                },
                cancelUpload:function (fid){
                    return _getBase(magic.URL_UPLOAD_CANCEL,{fid:fid});
                },

                userListData:function(page,limit,st){
                    var body = {
                        limit:limit,
                        page:page,
                        st:st
                    };
                    return _getBase(magic.URL_SERVICE_USER_LIST_DATA,body)
                },
                userData:function(sd){
                    return _getBase(magic.URL_SERVICE_USER_DATA,{sd:sd});
                },
                userPersonal:function(sd){
                    return _getBase(magic.URL_SERVICE_USER_PERSONAL,{sd:sd});
                },
                userPersonalList:function(status,st,limit,page){
                    var body = {
                        status:status,
                        st:st,
                        limit:limit,
                        page:page
                    };
                    return _getBase(magic.URL_SERVICE_USER_LIST_PERSONAL,body);
                },
                userLoader:function(sd){
                    var body = {
                        sd:sd
                    };
                    return _getBase(magic.URL_SERVICE_USER_LOADER,body)
                },
                userSubmit:function(sd,status,msgAttrs){
                    msgAttrs = msgAttrs===undefined?{}:msgAttrs;
                    var body = {
                        status:status,
                        msgAttrs:msgAttrs,
                        sd:sd
                    };
                    return _getBase(magic.URL_SERVICE_USER_SUBMIT,body)
                },
                adminVendorList:function(){
                    return _getBase(magic.URL_SERVICE_ADMIN_LIST_VENDOR);
                },
                adminTypeList:function(vid){
                    return _getBase(magic.URL_SERVICE_ADMIN_LIST_TYPE,{vid:vid});
                },
                adminDataList:function(vid,page,limit,st){
                    var body = {
                        vid:vid,
                        page:page,
                        limit:limit
                    };
                    if(st!==undefined){
                        body.st = st;
                    }
                    return _getBase(magic.URL_SERVICE_ADMIN_LIST_DATA,body);
                },
                adminData:function(sd){
                    return _getBase(magic.URL_SERVICE_ADMIN_DATA,{sd:sd});
                },
                adminLoader:function(sd){
                    var body = {
                        sd:sd
                    };
                    return _getBase(magic.URL_SERVICE_ADMIN_LOADER,body);
                },
                adminRegisterUser:function(sd){
                    return _getBase(magic.URL_SERVICE_ADMIN_REGISTER_USER,{sd:sd});
                },
                publishLoader:function(st,vid){
                    var body = {
                        st:st,
                        vid:vid
                    };
                    return _getBase(magic.URL_SERVICE_PUBLISH_LOADER,body);
                },
                publishTarget:function(vid){
                    return _getBase(magic.URL_SERVICE_PUBLISH_TARGET,{vid:vid});
                },
                publishSubmit:function(info){
                    console.log(info);
                    var target = '0';
                    if(info.select.length!==0){
                        target = info.select.join(',');
                    }
                    var body = {
                        st:$routeParams.st,
                        vid:$routeParams.vid,
                        name:info.name,
                        description:info.description,
                        content:info.content,
                        image:info.image,
                        msgAttrs:info.data,
                        target:target,
                        action:info.action
                    };
                    return _getBase(magic.URL_SERVICE_PUBLISH_SUBMIT,body);
                },
                userInfo:function(uid){
                    var body={};
                    if(uid!==undefined){
                        body.uid=uid;
                    }
                    return  _getBase('/api/user/info',body);
                },
                createTree:function(target,tree){
                  _createTree(target,tree);
                },
                location:function(url){
                    _location(url);
                },
                back:function(recent,sign){
                    if(recent==magic.NG_STUDENT_LOADER){
                        _location(magic.NG_STUDENT_HOME);
                    }else if(recent==magic.NG_STUDENT_LOADER_COMPLETE){
                        _location(magic.NG_STUDENT_SIGNED);
                    }else if(recent==magic.NG_STUDENT_ADD_LIST){
                        _location(magic.NG_STUDENT_MANAGE_VENDOR.replace(':vid',$routeParams.vid));
                    }else if(recent==magic.NG_STUDENT_MANAGE_VENDOR) {
                        if(sign){
                            _location(magic.NG_STUDENT_HOME);
                        }else{
                            _location(magic.NG_STUDENT_MANAGE);
                        }

                    }else if(recent==magic.NG_STUDENT_LOADER_ADD){
                        _location(magic.NG_STUDENT_MANAGE_VENDOR.replace(':vid',$routeParams.vid));
                    }else if(recent==magic.NG_STUDENT_LOADER_MANAGE){
                        _location(magic.NG_STUDENT_ADD_LIST.replace(':vid',$routeParams.vid));
                    }else if(recent==magic.NG_STUDENT_ADMIN_LOADER){
                        _location(magic.NG_STUDENT_ADD_LIST.replace(':vid',$routeParams.vid));
                    }
                },
                $apply:function(func){
                    _apply(func);
                }
            }
        }]);
};

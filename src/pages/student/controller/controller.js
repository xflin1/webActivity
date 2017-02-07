var uiToast = require('component/uiToast');
var uiDropMenu = require('component/uiDropMenu');
var uiUploader = require('component/uiUploader');
var magic = require('../../../../util/magic.js');
var Promise = require('bluebird');
var util = require('component/util.js');
module.exports = function(App){
    uiToast(App);
    uiDropMenu(App);
    uiUploader(App);
    App.controller('main',
        ['$scope','ToastService',function($scope,ToastService){
            $scope.menus = {
                action:{
                    name:"活动",
                    url:"#"+magic.NG_STUDENT_HOME,
                    icon:"list"
                },
                signed:{
                    name:'我的活动',
                    url:"#"+magic.NG_STUDENT_SIGNED,
                    icon:"list"
                },
                config:{
                    name:"添加管理",
                    url:"#"+magic.NG_STUDENT_MANAGE,
                    icon:"cog"
                },
                quit:{
                    name:"注销",
                    url:"/logout",
                    icon:"power-off"
                }
            };
            $scope.toastService = ToastService;
    }]);
    App.controller('home',
        ['$scope','$$action',function($scope,$$action){
            $scope.lists = [];
            $scope.listInfo = {
                start:0,
                end:false
            };
            $scope.getLists = function(){
                if($scope.listInfo.end==false){
                    $$action.findDataList($scope.listInfo.start,1).then(function(data){
                        $$action.$apply(function(){
                            if(data.code==0){
                                if(data.list.length==magic.SIGNAL_PAGE){
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
                        });
                    }).catch(function(error){
                        console.log(error);
                        util.handleError(error);
                    });
                }
            };
            (function init(){
                $scope.getLists();
            })();

        }]);
    App.controller('register',
        ['$scope','$$action','$routeParams','ToastService','$location','$loader','$route'
            ,function($scope,$$action,$routeParams,ToastService,$location,$loader,$route){
            $scope.title = '报名帖1';
            $scope.content = null;
            $scope.registerStatus = ($loader.action.status==-1);
            $$action.getRegisterDetails($routeParams.id).then(function(data){
                $$action.$apply(function(){
                    if(data.code==0&&data.list.length==1){
                        $scope.content = data.list[0];
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
                $$action.submitData($routeParams.id,'Register',{op:'sign'})
                    .then(function(data){
                        $$action.$apply(function(){
                            if(data.code==0){
                                ToastService.showSuccess('报名成功',function(){
                                    $route.reload();
                                });
                            }else{
                                ToastService.showWarning('报名失败');
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
                $$action.cancelData($routeParams.id,'Register',{}).then(function(data){
                    $$action.$apply(function() {
                        if(data.code==0){
                            ToastService.showSuccess('取消成功',function(){
                                $route.reload();
                            });
                        }else{
                            ToastService.showWarning('取消失败');
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

            $scope.lists = [];
            $scope.listInfo = {
                start:0,
                end:false
            };
            $scope.getLists = function(){
                if($scope.listInfo.end==false){
                    $$action.findCompleteDataList($scope.listInfo.start).then(function(data){
                        $$action.$apply(function(){
                            if(data.code==0){
                                if(data.list.length==magic.SIGNAL_PAGE){
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
                        });
                    }).catch(function(error){
                        console.log(error);
                        util.handleError(error);
                    });
                }
            };
            (function init(){
                $scope.getLists();
            })();

        }]);
    App.controller('addList',
        ['$scope','$$action','$routeParams','$location','$location',
            function($scope,$$action,$routeParams,$location){
                $scope.lists = [];
                $scope.listInfo = {
                    start:0,
                    end:false
                };
                $scope.getLists = function(){
                    if($scope.listInfo.end==false){
                        $$action.findAddList($scope.listInfo.start,1,$routeParams.vid).then(function(data){
                            $$action.$apply(function(){
                                if(data.code==0){
                                    if(data.list.length==magic.SIGNAL_PAGE){
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
                            });
                        }).catch(function(error){
                            console.log(error);
                            util.handleError(error);
                        });
                    }
                };
                $scope.back = function(){
                    var path = $location.path();
                    var arr = path.split('/');
                    arr[3]=':vid';
                    path = arr.join('/');
                    $$action.back(path);
                };
                (function init(){
                    $scope.getLists();
                })();

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
                    vid:$routeParams.vid
                };

                $$action.loaderAdd($routeParams.vid).then(function (data) {
                    $$action.$apply(function(){
                        console.log(data)
                        if(data.code==0){
                            $loaderAdd.initLoader($scope.loaderInfo,data.actions);
                            $scope.loaderInfo.src=magic.URL_STUDENT_NORMAL_ADD;
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
                    arr[3]=':vid';
                    path = arr.join('/');
                    $$action.back(path);
                };
                $scope.next = function(){
                    $loaderAdd.next();
                }
            }]);

    App.controller('normalAdd',['$scope','$loaderAdd','$timeout',
        function($scope,$loaderAdd,$timeout){
            $scope.service = $loaderAdd.loaderInfo();

    }]);
    App.controller('registerAdd',['$scope','$loaderAdd',
        function($scope,$loaderAdd){
            $scope.Register = $loaderAdd.loaderInfo().data.Register;
        }]);
    App.controller('manageList',['$scope','$loaderAdd','$$action','ToastService',
        function($scope,$loaderAdd,$$action,ToastService){
            $scope.getLists = function () {
                ToastService.showLoading('加载中');
                $$action.manageList().then(function (data) {
                    $$action.$apply(function () {
                        if(data.code==0){
                            $scope.lists = data.list;
                            ToastService.clear();
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
            $scope.getLists = function () {
                ToastService.showLoading('加载中');
                $$action.manageList().then(function (data) {
                    $$action.$apply(function () {
                        if(data.code==0){
                            var vid = $routeParams.vid;
                            for(var i=0;i<data.list.length;i++){
                                if(data.list[i].id==vid){
                                    $scope.vendorInfo = data.list[i];
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
            };
            $scope.back = function(){
                var path = $location.path();
                var arr = path.split('/');
                arr[2]=':vid';
                path = arr.join('/');
                $$action.back(path);
            };
            (function init(){
                $scope.getLists();
            })();
        }]);


    App.service('$loaderAdd',['$rootScope','$http','$$action','ToastService',
        function($rootScope,$http,$$action,ToastService){
            var _loaderInfo = null;
            var _actions = null;
            var _step = 0;

            /**
             * 初始化loaderInfo
             * @param loaderInfo
             * @private
             */
            var _initLoader = function(loaderInfo){
                _loaderInfo = loaderInfo;
            };

            var _initData = function(data,actions){
                _step = 0;
                _actions=actions;
                var length = actions.length;
                for(var i=0;i<length;i++){
                    _addActionData(data,actions[i]);
                }
            };

            var _addActionData = function(data,action){
                if(action=='Register'){
                    data['Register']={
                        limit:0
                    }
                }
            };
            var _parserAction = function(){
                if(_step<_actions.length){
                    var action = _actions[_step];
                    if(action=='Register'){
                        _loaderInfo.src=magic.URL_STUDENT_REGISTER_ADD
                    }
                    _step++;
                }else if(_step==_actions.length){
                    ToastService.showLoading('提交中');
                    $$action.loaderAddSubmit(_loaderInfo).then(function (data) {
                        ToastService.showSuccess('添加成功',function(){
                            $$action.location(magic.NG_STUDENT_HOME);
                        });
                     });
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
            return{
                initLoader:function(loaderInfo,actions){
                    _initLoader(loaderInfo);
                    _initData(loaderInfo.data,actions)
                },
                loaderInfo:function(){
                    return _loaderInfo;
                },
                next:function(){
                    _parserAction();
                    console.log(_loaderInfo);
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
                $$action.loader($routeParams.id).then(function(data){
                    if(data.code==0){
                        $loader.parserActions(data.loader);
                        console.log(data.loader);
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
                parserActions:function(loader){
                    _apply(function(){
                        _action.status = loader.status;
                        if(loader.action=='complete'){
                            if(loader.actions[loader.length-1]=='Register'){
                                _loaderInfo.src=magic.URL_STUDENT_REGISTER;
                            }
                        }else if(loader.action=='Register'){
                            _loaderInfo.src=magic.URL_STUDENT_REGISTER;
                        }
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
            return {
                getRegisterDetails:function(id){
                    return _getBase(magic.URL_REGISTER_DETAIL,{id:id});
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
                location:function(url){
                    _location(url);
                },
                back:function(recent){
                    if(recent==magic.NG_STUDENT_LOADER){
                        _location(magic.NG_STUDENT_HOME);
                    }else if(recent==magic.NG_STUDENT_LOADER_COMPLETE){
                        _location(magic.NG_STUDENT_SIGNED);
                    }else if(recent==magic.NG_STUDENT_ADD_LIST){
                        _location(magic.NG_STUDENT_MANAGE_VENDOR.replace(':vid',$routeParams.vid));
                    }else if(recent==magic.NG_STUDENT_MANAGE_VENDOR) {
                        _location(magic.NG_STUDENT_MANAGE);
                    }else if(recent==magic.NG_STUDENT_LOADER_ADD){
                        _location(magic.NG_STUDENT_MANAGE_VENDOR.replace(':vid',$routeParams.vid));
                    }
                },
                $apply:function(func){
                    _apply(func);
                }
            }

        }]);
};
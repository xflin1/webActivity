/**
 * Created by zheor on 16-12-1.
 */
/*$.post('http://localhost:8080/loader/cancel',function(data){
    console.log(data);
});
$.post('http://localhost:8080/api/test',function(data){
    console.log(data);
});*/
$.get({
    url:'http://localhost:8080/api/login',
    xhrFields: {
        withCredentials: true
    }
},function(data){
    console.log(data);
});
/*
$.ajax({
    url:'http://localhost:8080/api/login',
    // 将XHR对象的withCredentials设为true
    xhrFields: {
        withCredentials: true
    }
});*/

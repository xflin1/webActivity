/**
 * Created by jyl on 16-9-26.
 */
var routeconfig = require('./route.js');
var func=require('../controller');

module.exports=function(app) {
        var obj=null;
        for (var k in routeconfig) {
                obj=routeconfig[k];

                if(obj.method==undefined){
                        console.log(obj.path)
                        app.get(obj.path,func[k.substring(0, k.indexOf('_'))][k.substr(k.indexOf('_')+1)]);
                }else if(obj.method=='POST'){
                        app.post(obj.path, func[k.substring(0, k.indexOf('_'))][k.substr(k.indexOf('_')+1)]);
                }else if(obj.method=='USE'){
                        app.use(obj.path,func[k.substring(0, k.indexOf('_'))][k.substr(k.indexOf('_')+1)]);
                }
        }
        obj=null;
};
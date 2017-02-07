var serviceActions = {
    Register:{
        limitedNum:{
            name:"人数上限",
            placeholder:"参加服务人数上限数",
            type:"text"
        }
    }
};
module.exports = {
    //actions is a Array
    actionsParse:function (actions) {
        var finalActions = {};
        for(var val in actions){
            finalActions[actions[val]] = serviceActions[actions[val]];
        }
        var html = '';
        for(var v in finalActions){
            for(var a in finalActions[v]){
                if(finalActions[v][a].type == 'text'){
                    html = '<div class="weui-cells weui-cells_form"><div class="weui-cell "><div class="weui-cell__hd"><label class="weui-label">'+ finalActions[v][a].name +'</label></div><div class="weui-cell__bd"><input name="'+a+'" ng-model="service.'+a+'"  class="weui-input" placeholder='+ finalActions[v][a].placeholder +'></div></div> </div>';
                }
            }
        }
        return html;

    }
};

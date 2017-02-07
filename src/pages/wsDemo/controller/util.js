module.exports = {
    /**
     * 将src中的对象混合到des中
     * @param {object}  des
     * @param {object}  src
     */
    mixinObject:function(des,src){
        for(var key in src){
            if(src.hasOwnProperty(key)){
                if(typeof src[key]==='object'){
                    des[key]={};
                    this.mixinObject(des[key],src[key]);
                }else{
                    des[key] = src[key];
                }
            }
        }
    },
    /**
     * 将src中des存在的key赋值到des中
     * @param {object} src
     * @param {object} des
     */
    objectAssignment:function(src,des){
        if(src != null){
            for(var key in src){
                if(src.hasOwnProperty(key)&&
                    des.hasOwnProperty(key)){
                    if(typeof(src[key])=='object'){
                       this.objectAssignment(src[key],des[key])
                    }else{
                        des[key] = src[key];
                    }
                }
            }
        }
    },
    /**
     * 清空object的所有属性
     * @param src
     */
    objectClear:function(src){
        for(var key in src){
            if(src.hasOwnProperty(key)){
                delete src[key];
            }
        }
    }
};
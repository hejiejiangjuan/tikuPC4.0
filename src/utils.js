export default{
         getUrlKey:function(){
             return location.href.substring(0,location.href.indexOf("#"));
         }
     }
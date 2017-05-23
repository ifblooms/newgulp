require.config({
    baseUrl:'js'
});
define(['b'],function(b){
    console.log('run c.js :'+b.color+','+b.width);
});

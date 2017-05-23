/*!
 * @author Lyca,qmzmxfy@vip.qq.com
*/
/* require配置 */
require.config({
  baseUrl:'js',
  paths:{// 模块重命名
    'jquery':'lib/jquery.min',
  },
  shim:{// 加载非规范的模块
    'jquery.tools':{
      deps: ['jquery'],// 依赖
      exports: 'tools'// 输出
    }
  }
});
/* 模块调用 */
require(['jquery.tools'],function(){
  console.log($.fn.jquery)
  console.log(tools.rNum(1,3))
});


/**
 * @author  Lyca,qmzmxfy@vip.qq.com
**/
var mobile = {
  l:base.l(),
  rem:(function(doc,win){//动态rem设置,1rem=10px,不同设备全屏统一为32rem;(PC页面宽度小于384调试有问题，不支持12px以下)
    return false;//head已执行,返回;
    var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window?'orientationchange':'resize',
      recalc = function(){
        docEl.style.fontSize = 10*(doc.body.clientWidth/320)+'px';
      };
    recalc();
    win.addEventListener&&win.addEventListener(resizeEvt,recalc,false);
  })(document,window),
  versions:function(){
    var u = navigator.userAgent,app = navigator.appVersion;          
    return {
      weixin:u.toLowerCase().indexOf('micromessenger')>-1,         
      trident:u.indexOf('Trident')>-1,//IE内核              
      presto:u.indexOf('Presto')>-1,//opera内核              
      webKit:u.indexOf('AppleWebKit')>-1,//苹果、谷歌内核              
      gecko:u.indexOf('Gecko')>-1&&u.indexOf('KHTML')==-1,//火狐内核
      mobile:!!u.match(/AppleWebKit.*Mobile/)||!!u.match(/Windows Phone/)||!!u.match(/Android/)||!!u.match(/MQQBrowser/),
      ios:!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),//ios终端              
      android:u.indexOf('Android')>-1||u.indexOf('Linux')>-1,//android终端或者uc浏览器              
      iPhone:u.indexOf('iPhone')>-1||u.indexOf('Mac')>-1,//是否为iPhone或者QQHD浏览器              
      iPad:u.indexOf('iPad')>-1,//是否iPad              
      webApp:u.indexOf('Safari')==-1//是否web应该程序，没有头部与底部
    };
  }(),
  orChange:function(portrait,landscape){
    $('body').append('<div class="orientation-warn"><div class="orientation-warn-wrapper"><span class="orientation-warn-icon"></span>\u4e3a\u4e86\u66f4\u597d\u7684\u4f53\u9a8c\uff0c\u8bf7\u4f7f\u7528\u7ad6\u5c4f\u6d4f\u89c8</div></div>');
    $or = $('.orientation-warn');
    window.addEventListener('onorientationchange' in window?'orientationchange':'resize',function(){
      var or = window.orientation;
      if(or==180||or==0){
        $or.hide();
        portrait&&portrait();
      };
      if(or===90||or===-90){
        $or.show();
        landscape&&landscape();
      };
    },false);  
  },
  config:function(handler){
    $.getScript('http://res.wx.qq.com/open/js/jweixin-1.0.0.js',function(){
      $.getJSON(mobile.l.hd+'active_weixin_jssdk_0.html?jsoncallback=?&http_url='+encodeURIComponent(mobile.l.self),function(data){
        wx.config({
          debug:false,
          appId:data.appId,           // 必填，公众号的唯一标识
          timestamp:data.timestamp,   // 必填，生成签名的时间戳
          nonceStr:data.nonceStr,     // 必填，生成签名的随机串
          signature:data.signature,   // 必填，签名，见附录1
          jsApiList:[                 // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems'
          ]            
        });
        handler&&handler();
      });  
    });
  },
  corner:function($obj,type){
    $('body').append('<div id="corner-'+type+'" style="display:none;position:fixed;left:0;top:0;width:100%;height:100%;overflow:hidden;z-index:99999"><div style="width:100%;height:100%;background:#000;opacity:0.8"></div><img style="position:absolute;top:0;left:0;width:100%" src="http://pic.51wan.com/app/global/'+type+'.png"></div>');
    var $corner = $('#corner-'+type+'');
    $obj.tap(function(){
      $corner.show();
      return false;
    });
    $corner.tap(function(){
      $(this).hide();
      return false;
    });
  },
  resizePosition:function(p,bW,bH){//层尺寸位置写入
    var $resize = !obj?$('.resize'):$(obj+' .resize'),
      $position = !obj?$('.position'):$(obj+' .position'),
      againPro = bH<500?0.8:bH>=500&&bH<600?0.9:1,//适配短屏,500系数0.8,520系数0.9,100%宽度、left,top上下左中右不受影响;
      reParR = function(n,againPro){
        return parseInt(n)*p*againPro;
      },
      reParP = function(n,r){
        return r&&n==r?'c':parseInt(n);
      };
    $resize.each(function(n,v){
      var $v = $(v),
        w = $v.width(),
        h = $v.height();
      againPro = w*p==bW?1:againPro;
      var adaptionW = Math.round(w*p*againPro),
        adaptionH = Math.round(h*p*againPro),
        adaptionW = adaptionW==0?'auto':adaptionW,
        adaptionH = adaptionH==0?'auto':adaptionH,
        fs = parseInt(reParR($v.css('font-size'),againPro)),
        lh = parseInt(reParR($v.css('line-height'),againPro));
      $v.width(adaptionW).height(adaptionH).css({fontSize:fs,lineHeight:lh+'px'});
    });
    $position.each(function(i,v){
      var $v = $(v),
        display = $v.css('display'),
        divPos = {display:display};
      $v.css({position:'absolute'}).show();
      var w = $v.width(),
        h = $v.height();
      $v.hide();
      var t = reParP($v.css('top')),
        b = reParP($v.css('bottom')),
        l = reParP($v.css('left'),$v.css('right')),
        r = reParP($v.css('right'));
      if(l=='c'){
        divPos.left = (bW-w)*0.5;
      }else if(!isNaN(l)){
        divPos.left = l*p*againPro;
      }else{
        divPos.left = bW-w-r*p;
        divPos.right = 'auto';
      };
      if(t=='c'){
        divPos.top = (bH-h)*0.5;
      }else if(!isNaN(t)){
        divPos.top = t*p*againPro;
      }else{
        divPos.top = bH-h-b*p;
        divPos.bottom = 'auto';
      };
      $v.css(divPos);
    });
  },
  wxShare:function(shareContent){
    wx.ready(function(){
      wx.onMenuShareTimeline(shareContent);
      wx.onMenuShareAppMessage(shareContent);
      wx.onMenuShareQQ(shareContent);
      wx.onMenuShareWeibo(shareContent);
    });
  },
  spinner:function(flag){
    var $spinner = $('.spinners');
    if(!$spinner[0]){
      $('body').append('<div class="spinnermask spinners"></div><div class="spinnerbox spinners"><div class="spinner"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div></div>');
      mobile.spinner(flag);
    };
    if(flag){
      $spinner.show();
    }else{
      $spinner.hide();  
    };  
  },
  tips:function(h,v,handler){
    var $tipsbox = $('#common-tipsbox');
    if(!$tipsbox.length){
      $('body').append('<div id="common-tipsbox"><div class="common-tipsmask"></div><div class="common-tipscontent"><p class="common-tipsh">'+h+'</p><p class="common-tipsp">'+v+'</p><input class="common-tipsbtn" type="button" value="确定"></div></div>');
      mobile.tips(h,v,handler);
    }else{
      $tipsbox.show();
      var $tipscontent = $tipsbox.find('.common-tipscontent');
      $tipsbox.find('.common-tipsh').html(h||'');
      $tipsbox.find('.common-tipsp').html(v||'');
      $tipscontent.css('margin-top',$tipscontent.outerHeight()/-2);
      $tipsbox.find('.common-tipsbtn').on('tap',function(){
        event.preventDefault();
        $(this).off('tap');
        $tipsbox.hide(100);
        handler&&handler();
      });    
    };
  },
  auth:function(easy,complex,handler){//微信授权
    var uid = base.linkPar('uid'),
        hdid = base.linkPar('hdid'),
        cookie_uid = base.cookie('wx_uid');
    if(!easy){
      mobile.loading(function(){handler(uid)});
    }else if(!cookie_uid||!hdid||!uid||cookie_uid!=uid){//cookie无openid,链接无活动id,链接无openid,cookie与链接的openid不同等都要重新授权
      mobile.authBack(hdid,easy);  
    }else if(complex){
      $.getJSON(mobile.l.hd+complex+'?jsoncallback=?',{'hdid':hdid,'uid':uid},function(data){//判断当前openid是否入库
        if(data.unauth==1){//当前活动未找到(授权后跳回我的页面)
          mobile.authBack('',easy);
        }else if(data.unauth==2){//未授权(授权后跳回活动页面)
          mobile.authBack(hdid,easy);
        }else{//成功授权获取信息flag:是否操作者页面;hddata当前活动页信息(nickname,headimg);udata:当前操作者信息(nickname,headimg);
          mobile.loading(function(){handler(uid,hdid,data)});
        };
      });
    }else{//简单活动无需验证和获取用户信息
      mobile.loading(function(){handler(uid)}); 
    };
  },
  authBack:function(hdid,easy){
    var selfUrl = mobile.l.self.replace(/\?\S*/,'');
    hdid = !hdid?'':hdid;
    location.href = mobile.l.hd+easy+'?hdid='+hdid+'&hdurl='+encodeURI(selfUrl);    
  },
  loading:function(handler){//页面加载
    var $wrap = $('#wrap'),
        $html = $('html,body'),
        $imgLoadingList = $('.img-loading-list-none'),
        $loading = $('.loading-page'),$progress = $('.loading-progress'),$loadingimg = $('.loading-img'),$loadingmask = $('.loading-mask'),
        resArr = [],
        urlReg = /url\("?(\S*[^"])"?\)/;
    $imgLoadingList.each(function(i,v){
      $(v).addClass('img-loading-list').removeClass('img-loading-list-none');
      var imgUrl = $(v).css('background-image');
      resArr[i] = urlReg.exec(imgUrl)[1];
    });
    imgLoad.loading(resArr,function(count,index,obj,state){
      var num = parseInt((index/count)*100);
        $loadingmask.height($loadingimg.height()*num/100);
        $progress.text(num+'%');
    },function(count){
      $loading.fadeOut(500,function(){
        $html.addClass('loading-page-html');
        $wrap.show();
        mobile.orChange();
        handler();
      });
    });
  }
};

/**
 * @author  Lyca,qmzmxfy@vip.qq.com
**/
var tools = {
  plugin:function(group) {//插件加载
    group = $.extend({
      path:'',
      arr:[],
      len:0
    },group);
    group.len = group.arr.length;
    $.each(group.arr,function(i,v){
      $.ajax({
        url:group.path+v+'.js',
        dataType:'script',
        cache:true,
        success:function() {
          group.len--;
          if(!group.len){
            group.success();
          }
        }
      });
    });
  },
  cookie:function(n,v,group){//cookie操作:键,值,其他参数
    if(typeof v!=='undefined'){
      group = $.extend({
        e:0,  //0:会话,-1:删除,1:1天
        p:'/',  //路径
        d:location.hostname,  //域名
        date:new Date()
      },group);
      group.date.setTime(group.date.getTime()+group.e*24*60*60*1e3);
      group.date = group.e!==0?group.date.toGMTString():'';
      document.cookie = n+'='+window.escape(v)+';expires='+group.date+';path='+group.p+';domain='+group.d;
    }else{
      v = document.cookie.match(new RegExp('(^| )' + n + '=([^;]*)(;|$)'));
      return v!==null?window.unescape(v[2]):v;
    }
  },
  creatFlash:function(needs,group){//添加flash:DOM,必需参数[swf地址,宽,高,id],附加参数
    var param = [],
        others = $.browser.msie?'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"':'type="application/x-shockwave-flash" data="'+needs.src+'"';
    group = $.extend({
      wmode:'transparent'
    },group);
    $.each(group,function(n,v){
      param.push('<param name="'+n+'" value="'+v+'">');
    });
    return '<object id="'+(needs.id||"")+'" width="'+needs.w+'" height="'+needs.h+'" '+others+'><param name="src" value="'+needs.src+'">'+param.join('')+'</object>';
  },
  linkPar:function(key,v){//链接参数取值
    return ((v||location.href).match(new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)'))||['',null])[1];
  },
  cutStr:function(s,l,nodot){//字符串截取
    var temp = [],
        sc = '',
        m = nodot?l:l-3,
        n = 0,
        sl = s.replace(/[^\x00-\xff]/g,'**').length;
    if(!l){return sl;}
    if(l>=sl){return s;}
    for(var i=0;i<s.length;i++){
      sc = s.charAt(i);
      n = window.escape(sc).length>4?n+2:n+1;
      if(n>m){
        break;
      }
      temp.push(sc);
    }
    if(!nodot){
      temp.push('...');
    }
    return temp.join('');
  },
  rNum:function(x,y){//生成包含x-y之间的随机数
    return Math.floor(Math.random()*(y-x+1)+x);
  },
  thousandFormat:function(s){//千位分隔符
    var decimal,
        reg = /(\d)(\d{3},)/;
    if(/[^0-9\.]/.test(s)){
      return s;
    }else{
      s = Number(s).toString().split('.');
      decimal = s[1];
      s = s[0]+',';
    }
    while(reg.test(s)){
      s = s.replace(reg,'$1,$2');
      s = s.replace(/,(\d\d)$/,'.$1');
    }
    return s.replace(/\,$/,'')+(decimal?'.'+decimal:'');

    //num.toString().replace(/(\d)(?=(\d{3})+.)/g,function($0,$1){return $1+",";});
  },
  date:function(format,stamp) {//时间格式:类型,时间戳
    format = format||'Y-M-D H:I:S';
    var D = stamp||new Date(),
        dd,
        week = [['Sun','Mon','Tues','Wed','Thur','Fri','Sat'],['\u65e5','\u4e00','\u4e8c','\u4e09','\u56db','\u4e94','\u516d']],
        double = function(v){
          v = v>9?''+v:'0'+v;
          return v;
        };
    if(/^\d+$/.test(D)){
      D = new Date(D);
    }
    dd = {
      year:D.getYear(),
      month:D.getMonth()+1,
      date:D.getDate(),
      day:week[0][D.getDay()],
      Day:week[1][D.getDay()],
      hours:D.getHours(),
      minutes:D.getMinutes(),
      seconds:D.getSeconds(),
      millisecond:D.getMilliseconds()
    };
    dd.G = dd.hours>12?'PM'+double(dd.hours-12):'AM'+double(dd.hours);
    dd.g = dd.hours>12?'PM'+(dd.hours-12):'AM'+dd.hours;
    var oType = {
      Y:D.getFullYear(),//2015年
      y:dd.year,//115年(-1900)
      M:double(dd.month),//08月
      m:dd.month,//8月
      D:double(dd.date),//04日
      d:dd.date,//4日
      W:dd.Day,//日
      w:dd.day,//Sun
      H:double(dd.hours),//7点
      h:dd.hours,//07点
      G:dd.G,//AM07点
      g:dd.g,//AM3点
      I:double(dd.minutes),//08分
      i:dd.minutes,//8分
      S:double(dd.seconds),//09秒
      s:dd.seconds,//9秒
      L:double(parseInt(dd.millisecond*0.1, 10)),//08毫秒
      l:dd.millisecond
    };
    for(var i in oType){
      format = format.replace(i,oType[i]);
    }
    return format;
  },
  countdown:function(group) {//倒计时:秒数,毫秒过程,秒过程,完成
    group = $.extend({
      process:function(){},
      complete:function(){}
    },group);
    var ctInterval,
        timeArr = group.t.toString().split('.'),
        rs = timeArr[0],
        ms = Math.floor((timeArr[1]||0)/10);
    var format = function(t,t2){
      var d = parseInt(t/24/3600,10),
          h = parseInt((t-d*24*3600)/3600,10),
          H = h+d*24,
          i = parseInt((t-d*24*3600-h*3600)/60,10),
          s = t-d*24*3600-h*3600-i*60,
          date = {
            d:d,
            h:h,
            H:H,
            i:i,
            s:s,
            ms:t2||0
          };
      $.each(date,function(n,v){
        date[n] = v>9?''+v:'0'+v;
      });
      return date;
    },
    takeCount = function(){
      if(ms<0){
        rs--;
        ms = 99;
      }
      if(rs>=0){
        group.process(format(rs,ms));
      }
      if(rs<0){
        group.complete();
        clearInterval(ctInterval);
      }
      ms--;
    };
    takeCount();
    ctInterval = setInterval(takeCount,10);
  },
  clipboard:function(v,handler){//复制到剪切板 仅IE
    if(window.clipboardData){
      window.clipboardData.setData('Text',v);
      if(handler){handler(v);}
    }else{
      alert('\u5f53\u524d\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u6b64\u590d\u5236\u529f\u80fd\uff0c\u8bf7\u4f7f\u7528ctrl+c\u6216\u9f20\u6807\u53f3\u952e\u3002');
    }
  },
  ZeroClipboard:function(path){//复制到剪切板 flash
    window.ZeroClipboard.config({
      swfPath:(path||'swf/')+'ZeroClipboard.swf'
    });
  },
  addBookmark:function($o,group){//加入到收藏夹
    var ua = navigator.userAgent.toLowerCase(),
        ctrl = ua.indexOf('mac')!=-1?'Command':'Ctrl',
        failure = '\u60a8\u7684\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\uff0c\u8bf7\u5c1d\u8bd5 '+ctrl+'+D \u624b\u52a8\u6536\u85cf\uff01';
    group = $.extend({
      title:document.title,
      href:location.href,
      way:'click'
    },group);
   if(window.sidebar){
      $o.attr({
        rel:'sidebar',
        href:group.href,
        title:group.title
      });
    }else{
      $o.on(group.way,function(){
        try{
          window.external.addFavorite(group.href,group.title);
        }catch(e){
          alert(failure);
        }
        return false;
      });
    }
  },
  lock:function(obj,handler,group){//事件锁定
    var $obj = $(obj),
        lock = function(flag){
          $obj.each(function(i,e){
            $(e).data('lock',flag);
          });
        },
        f = function(){
          var $this = $(this);
          if(!$this.data('lock')){
            lock(1);
            handler(this,obj);
          }
          return false;
        };
    group = $.extend({
      way:'click',
      parent:''
    },group);
    if(!handler){
      lock(0);
    }else if(handler===true){
      lock(1);
    }else if(group.parent){
      $(group.parent).on(group.way,obj,f);
    }else{
      $obj.on(group.way,f);
    }
  },
  seamless:function($o,group) {//无缝滚动
    group = $.extend({
      t:40
    },group);
    if(group.height){
      $o.height(group.height);
    }
    $o.css('overflow','hidden').children().clone().appendTo($o);
    var $a = $o.children().eq(0),
        $b = $o.children().eq(1),
        aH = $a.outerHeight(true),
        marquee = function(){
          var aT = $a.offset().top,
              bT = $b.offset().top,
              oS = $o.scrollTop();
          if(bT-aT<=oS){
            $o.scrollTop(oS-aH);
          }else{
            $o.scrollTop(oS+1);
          }
        },
        marInterval = setInterval(marquee,group.t);
    $o.hover(function(){
      clearInterval(marInterval);
    }, function() {
      marInterval = setInterval(marquee,group.t);
    });
  },
  focusMode:function($o,v,flag){//input提示:DOM,值,placeholder使用标识
    if(!flag&&'placeholder' in document.createElement('input')){
      $o.attr('placeholder',v);
    }else{
      $o.val(v).focus(function(){
        var $this = $(this);
        $this.addClass('input-focus');
        if($this.val()==v){
          $this.val('');
        }
      }).blur(function(){
        var $this = $(this);
        $this.removeClass('input-focus');
        if($this.val()===''){
          $this.val(v);
        }
      });
    }
  },
  tab:function($o,group){
    group = $.extend({
      way:'click',
      btn:'.tab-btn',
      curr:'tab-curr',
      box:'.tab-box',
      one:'.tab-one'
    },group);
    $o.on(group.way,group.btn,function(){
      var $this = $(this),
          index = $this.index();
      if(group.success){
        group.success(this,index);
      }
      $this.addClass(group.curr).siblings(group.btn).removeClass(group.curr);
      $o.find(group.box).each(function(){
        $(this).find(group.one).eq(index).show().siblings(group.one).hide();
      });
    });
  },
  page:function(x,y,z){//配置页码:总页码,当前页码,默认显示页码数量
    y = !y?1:y;
    z = !z?10:z;
    var currClass = 'page-curr',
        oneClass = 'page-one',
        prevHtml = '<span class="page-btn page-prev '+(y==1?'page-disabled page-prev-disabled':oneClass)+'" data-page="'+(y-1)+'">\u4e0a\u4e00\u9875</span>',
        nextHtml = '<span class="page-btn page-next '+(y==x?'page-disabled page-next-disabled':oneClass)+'" data-page="'+(y+1)+'">\u4e0b\u4e00\u9875</span>',
        moreHtml = '<span class="page-more '+oneClass+'" data-page="'+(y+z-3>x-1?(y>x-2?x-2:x):y+z-3)+'">...</span>',
        middleHtml = '',
        loopPage = function(m,n){
          var loopHtml = [];
          for(var i=m;i<=n;i++){
            loopHtml.push('<span class="'+oneClass+(i==y?' '+currClass:'')+'" data-page="'+i+'">'+i+"</span>");
          }
          return loopHtml.join('');
        };
    if(x>z){
      if(y<z-1){
        middleHtml = loopPage(1,z-2)+moreHtml+loopPage(x,x);
      }else if(y>x-2){
        middleHtml = loopPage(1,1)+moreHtml+loopPage(x-(z-3),x);
      }else{
        middleHtml = loopPage(y-(z-3),y)+moreHtml+loopPage(x,x);
      }
    }else{
      middleHtml = loopPage(1,x);
    }
    return prevHtml+middleHtml+nextHtml;
  },
  baiduShare:function(share){
    window._bd_share_config = {
      share:share
    };
    $.getScript('http://bdimg.share.baidu.com/static/api/js/share.js');
  }
};

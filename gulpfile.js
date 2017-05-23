var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create(),
    pngquant = require('imagemin-pngquant'),
    buildUrl = 'dev',

//.on('error',console.error.bind(console))

/* 合并文件 */
gulp.task('concat',function(){
  gulp.src(['',''])// 按照[]里的顺序合并文件
    .pipe($.concat('lib.js'))
    .pipe(gulp.dest('build/'+buildUrl+'/js'));
});

/* sass任务 */
gulp.task('sass',function(){
  gulp.src(['src/**/sass/*.scss','!src/**/sass/base.scss'])
    .pipe($.sass({
      outputStyle:'compact'// 配置输出方式,默认为nested
    }).on('error',$.sass.logError))
    .pipe(gulp.dest('src/css'))
    .pipe($.cleanCss())
    .pipe(gulp.dest('build/'+buildUrl+'/css'));
});

/* css任务 */
var cssFilter = $.filter(['src/css/**/*.css','!src/css/**/*.min.css'],{restore: true});
gulp.task('css',function(){
  gulp.src('src/css/**/*.css')
    .pipe(cssFilter)// 过滤掉min.css
    .pipe($.rename({suffix:'.min'}))// 添加后缀名称
    .pipe($.autoprefixer({browsers:['Last 2 versions','IE 8','IE 9','IE 10']}))// css3前缀
    .pipe($.cleanCss({compatibility:'ie7,properties.ieBangHack'}))// 兼容至IE7 保留IEhack
    .pipe(cssFilter.restore)// 返回未过滤之前
    .pipe($.changed('build/js'))// 对比文件是否有过改动
    .pipe(gulp.dest('build/css'));
});

/* js任务 */
var jsFilter = $.filter(['src/js/**/*.js','!src/js/**/*.min.js'],{restore: true});
gulp.task('js',function(){
  gulp.src('src/js/**/*.js')
    .pipe(jsFilter)// 过滤掉min.js
    //.pipe($.jshint())//js检查(未完成)
    .pipe($.rename({suffix:'.min'}))// 添加后缀名称
    .pipe($.uglify({preserveComments:'some'}))// 压缩文件,保留部分注释
    .pipe(jsFilter.restore)// 返回未过滤之前
    .pipe($.changed('build/js'))// 对比文件是否有过改动
    .pipe(gulp.dest('build/js'));
});

/* html嵌套任务 */
gulp.task('html',function () {
  gulp.src(['src/*.html','!src/global-*.html'])
    .pipe($.fileInclude({
      prefix:'@@',
      basepath:'@file'
    }))
    .pipe($.htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest('build'));
});

/* html任务 */
gulp.task('html',function () {
  gulp.src(['src/*.html','!src/global-*.html'])
    .pipe($.fileInclude({
      prefix:'@@',
      basepath:'@file'
    }))
    .pipe($.htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest('build'));
});

/* 图片任务 */
gulp.task('img',function(){
  gulp.src('src/img/**/*.{png,jpg,gif,svg}') // 指明源文件路径、并进行文件匹配
    .pipe($.imagemin({
      progressive:true,// 无损压缩JPG图片
      svgoPlugins:[{removeViewBox:false}],// 不移除svg的viewbox属性
      use:[pngquant]// 使用pngquant插件进行深度压缩
    }))
    .pipe(gulp.dest('build/img')); // 输出路径
});

/* markdowm任务 */
gulp.task('markdown',function(){
  gulp.src('intro.md')
    .pipe($.markdown())
    .pipe(gulp.dest('build'));
});

/* 监听任务 */
gulp.task('watch',function(){
  gulp.watch('src/sass/*.scss',['sass']);// 监听sass任务
});

/* 代理服务器 //http://www.browsersync.cn/docs/gulp/ */
gulp.task('serve',function(){
  browserSync.init({
    files:['**'],
    proxy:'http://192.168.11.191/FrontEnd/test/gulp/build',// 设置本地服务器的地址
    port:8080// 设置访问的端口号
  });
});


/* 版本生成 */
gulp.task('rev', function(){
  gulp.src(['build/**/*.css', 'build/**/*.js'])
    .pipe($.rev())
    .pipe(gulp.dest(opt.distFolder))
    .pipe($.rev.manifest())
    .pipe(gulp.dest(opt.distFolder))
})
/* 版本替换 */
gulp.task('revreplace', ['rev'], function(){
  var manifest = gulp.src('./' + opt.distFolder + '/rev-manifest.json');
  gulp.src(opt.srcFolder + '/index.html')
    .pipe($.revReplace({manifest: manifest}))
    .pipe(gulp.dest(opt.distFolder));
});




/* requirejs任务 */
gulp.task('build',function(cb){
  $.requiresjs.optimize({
    appDir: 'src',// app顶级目录，非必选项。如果指定值，baseUrl则会以此为相对路径
    baseUrl: 'js/',// 模块根目录，默认情况下所有模块资源都相对此目录。
    dir: 'built',// 输出目录
    locale: "en-us", // 国际化配置
    paths: {
      'app': './app',
      'app-base': './app-base',
      'core-base': './lib'
    },
    shim: {
      'highcharts': {
        exports: 'Highcharts'
      },
      'highcharts-3d': {
        deps: ['highcharts']
      }
    },
    modules: [
      {
        name: 'core-base',
        include: [
          'jquery',
          'app/lib',
          'app/controller/Base',
          'app/model/Base'
        ]
      }
    ]
  }, function(buildResponse){
    console.log('build response', buildResponse);
    cb();
  },cb);
});





/* 执行任务（开发模式） */
gulp.task('dev',[]);

/* 执行任务（发布模式） */
gulp.task('bulid',function(){

});
gulp.task('default', ['build']);

# gulp前端自动化构建流程 #


## 构建说明： ##

### 开发环境 ###

- 图片构建：开发环境不做任何处理

- JS构建：开发环境不做任何处理

- CSS构建：开发环境监听.scss文件变化，执行sass任务

- 开发环境执行browsersync任务，实时刷新浏览器

### 发布环境 ###
- 图片构建：
1. 执行imagemin压缩任务

- JS构建：
1. 先将requirejs进行r.js合并
2. 执行uglify压缩任务
3. 添加.min后缀
 
- CSS构建：
1. 监听.scss文件变化，执行sass任务
2. 执行autoprefixer任务，添加css3后缀
3. 执行cleanCss任务，压缩优化css
4. 添加.min后缀

- html构建：
1. 执行fileInclude嵌套任务
2. 执行rev版本生成任务
3. 执行revreplace版本替换任务
4. 执行htmlmin压缩任务

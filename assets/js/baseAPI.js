// 每次调用jquery的Ajax请求都会 先调用这个函数
// 这个函数中有 Ajax 给我们提供的配置对象
// 优点：请求根路径发生修改 我们只需要在此修改  全局生效！！！
$.ajaxPrefilter(function(options){
    // options.url 是请求地址
    // 再发起请求之前拼接完整的 URL地址
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})
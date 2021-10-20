// 每次调用jquery的Ajax请求都会 先调用这个函数
// 这个函数中有 Ajax 给我们提供的配置对象
// 优点：请求根路径发生修改 我们只需要在此修改  全局生效！！！
$.ajaxPrefilter(function (options) {
    // options.url 是请求地址
    // 再发起请求之前拼接完整的 URL地址
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // 给所有需要权限的接口拼接口令 indexOf 提取字符串 没有 返回-1  有就是0
    if (options.url.indexOf('/my/') !== -1) {  // 包含为0
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }
    // 全局同一挂载 complete回调
    options.complete =
        function (res) {
            console.log(res);
            // responseJSON 服务器返回数据
            // console.log(res.responseJSON);
            // 判断请求是否成功
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('token');
                location.href = '/login.html';
                console.log(11);
            }
        }
})
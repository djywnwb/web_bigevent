$(function () {
    // 调用 getUserInfo获得用户基本信息
    getUserInfo();

})
var layer = layui.layer
$("#btnLogout").on('click', function () {
    // 提示用户是否退出
    layer.confirm('确定退出登陆?', { icon: 3, title: '提示' }, function (index) {
        //do something
        // 退出登陆
        // 1.清除本地存储token
        localStorage.removeItem('token');
        // 2.重新跳转登陆页面
        location.href = '/login.html'


        // 关闭询问框
        layer.close(index);
    });
})




// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: 'get',
        url: '/my/userinfo',
        /* headers: {
            Authorization: localStorage.getItem('token') || '',

        },       //权限请求头 */
        // 成功的回调函数
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败！");
            }
            //   渲染头像
            renderAvatar(res.data);
        },

        // 失败的回调函数
        // error:function(){}
        // 无论成功或者失败都会执行函数
        /* complete: function (res) {
            console.log(res);
            // responseJSON 服务器返回数据
            // console.log(res.responseJSON);
            // 判断请求是否成功
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('token');
                location.href = '/login.html';
                console.log(11);
            }
        } */


    })
}

// 封装渲染头像的函数
function renderAvatar(user) {
    // 渲染用户名有优先级  先昵称后用户名
    var name = user.nickname || user.username;
    // 设置欢迎文本
    $("#welcome").html('欢迎&nbsp;&nbsp;' + name);
    // 如果用户有头像则渲染用户头像 没有则是默认头像
    if (user.user_pic != null) {
        // 渲染用户头像
        $(".layui-nav-img")
            .attr('src', user.user_pic)
            .show()
        $(".text-avatar").hide();

    } else {
        // 渲染默认头像
        $(".layui-nav-img").hide();
        // 首字母 字符串区第一位   第一位字母转大写
        var first = name[0].toUpperCase();
        $(".text-avatar").html(first);


    }

}




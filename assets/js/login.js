$(function () {
    // 点击去注册账号的a
    $("#link_reg").on('click', function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })
    // 点击去登陆账号的a
    $("#link_login").on('click', function () {
        $(".login-box").show();
        $(".reg-box").hide();
    })


    // 自定义校验规则
    // 1. 获取  layui 中的 form 对象
    var form = layui.form;
    // 提取提示框效果
    var layer = layui.layer;

    // 2.form.verify() 自定义校验规则

    form.verify({
        pwd: [/^[\S]{6,15}$/, '密码必须6到15位，且不能出现空格'],
        //  校验两次密码是否一致
        repwd: function (value) { //value：表单的值、item：表单的DOM对象
            // 拿到密码框的值
            var pwd = $(".reg-box [name=password]").val();
            // 判定是否和当前的确认密码框的值一致

            if (value != pwd) {
                return '两次密码不一致';
            }
        }

    });

    // 监听注册表单注册事件
    $("#form_reg").on('submit', function (e) {
        e.preventDefault();
        // 发起Ajax的POST请求
        var data = { username: $("#form_reg [name=username]").val(), password: $("#form_reg [name=password]").val() };

        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功！请登陆!');
            // 注册成功后跳转登陆
            $("#link_login").click();
        })
    })

    // 监听登陆表单的提交事件
    $("#form_login").submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/login',
            // 快速获取表单数据 数据为查询字符串格式
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg('登陆失败！');
                }
                layer.msg('登陆成功！');
                // 把登录成功获得的 token 字符串，保存到本地存储中
                localStorage.setItem('token',res.token);
                // console.log(res.token);
                // 跳转后台首页
                location.href = '/index.html';
            }
        })
    })







})
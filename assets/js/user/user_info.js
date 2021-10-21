$(function () {
    var form = layui.form;
    var layer = layui.layer;
    // 验证表单
    form.verify({
        nickname: [
            // 昵称验证
            /^[\S]{1,8}$/,
            '昵称必须1到6位，且不能出现空格'
        ]
    })

    
    initUserInfo()
    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            tapy: 'GET',
            url: '/my/userinfo',
            // 成功回调
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取信息失败！')
                }
                layer.msg('获取信息成功！');
                // 调用方法可快速为表单赋值
                form.val('formUserInfo',res.data);
            }
        })
    }

    // 更新用户信息
    $(".layui-form").on('submit',function(e){
        // 阻止表单默认行为
        
        e.preventDefault();
        $.ajax({
            type:'POST',
            url:'/my/userinfo',
            data: $(".layui-form").serialize(),
            success:function(res){
                if(res.status !==0){
                    return layer.msg("更新用户信息失败！");
                }
                layer.msg("更新用户信息成功！");
                //在父页面重新渲染数据 window.parent：  window 就是 iframe 
                // 调用iframe 父级的方法 调用 getUserInfo获得用户基本信息
                window.parent.getUserInfo();
                
            }

            
        })
        

    })

    // 重置表单的数据
    $("#btnReset").on('click',function(e){
        // 阻止按钮的表单提交
        e.preventDefault();
        // 重新获取用户当前信息
        initUserInfo();

    })






})
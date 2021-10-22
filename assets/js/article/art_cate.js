$(function () {
    initArtCateList();
    var layer = layui.layer;
    var form = layui.form;
    // 1.获取文章分类的方法
    function initArtCateList() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！")
                }
                // 限制只要后三篇文章
                res.data = res.data.splice(-3); //裁剪数据
                var htmlStr = template('tpl-table', res);
                $("tbody").html(htmlStr)
            }
        })
    }
    // 关闭弹出框索引
    var index = null;
    // 为添加类别绑定点击事件
    $("#btnAddCate").on('click', function () {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            // offset: ['100px', '50px'],
            title: '添加文章分类',
            // 标签内容
            content: $("#dialog-add").html(), //标签结构
        });
    })


    //  通过事件委托绑定
    $("body").on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("新增分类失败!");
                }
                layer.msg("新增分类成功!");
                // 成功后重新获取文章,渲染文章
                initArtCateList();
                layer.close(index);

            }
        })
    })
    // 修改弹出层索引
    var indexeEdit = null;
    // 事件委托绑定编辑按钮
    $("tbody").on('click', '.btn-edit', function (e) {
        indexeEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            // offset: ['100px', '50px'],
            title: '添加文章分类',
            // 标签内容
            content: $("#dialog-edit").html(), //标签结构
        });

        // 编辑自定义属性
        // 点击打印自定义属性
        var id = $(this).attr('data-Id');
        // 发起Ajax请求根据id获得分类数据
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败！")
                }
                //成功就 把获取的数据加载到对应的input表单里
                form.val('form-edit', res.data);
            }
        })

    })







    // 通过事件委托给编辑表单绑定事件
    $("body").on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新失败！');
                }
                //    关闭编辑框
                layer.close(indexeEdit);
                // 重新更新数据
                initArtCateList();
                // 提示框
                layer.msg('更新分类数据成功！')
            }
        })

    })



    // 删除功能制作
    // 1.给每个删除按钮，以事件委托的方式注册点击事件
    $("tbody").on('click', '.btn-del', function () {
        // 2.点击后获得对应id 赋值给变量
        var id = $(this).attr('data-Id');
        // 3.点击删除后弹出，弹出层
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            // 4.当用户点击确认按钮，就发起AJAX请求，
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    }
                    layer.msg(res.message, { icon: 1 });
                    // 重新更新数据
                    initArtCateList();
                }
            })

            // 5.请求发起成功后关闭弹出层 并提示删除成功
            // 关闭框
            layer.close(index);
        });


    })

})
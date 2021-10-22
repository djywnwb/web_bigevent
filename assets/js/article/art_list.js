
var layer = layui.layer;

var form = layui.form;

var laypage = layui.laypage;
// 美化时间过滤器
template.defaults.imports.dataFormat = function (data) {
    const dt = new Date(data);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss


}
// 补零函数
function padZero(n) {
    return n < 9 ? '0' + n : n;
}



//  查询参数对象         向服务器发送给的数据
var q = {
    pagenum: 1,   // 页码值 ，默认请求第一页
    pagesize: 2,   // 每页默认显示两条数据，
    cate_id: '',    // 文章分类id
    state: '',     // 文章的发布状态

}
initTable();
initCate();
// 1.封装文章初始化加载函数
function initTable() {
    // 1.通过ajax获得文章数据
    $.ajax({
        type: 'get',
        url: '/my/article/list',
        data: q,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg("获取文章列表失败！")
            }

            // 然后渲染到页面
            var htmlStr = template('load-list', res);
            $("tbody").html(htmlStr);
            // 调用渲染分页方法
            renderPage(res.total);
        }
    })

}


// 初始化文章分类

function initCate() {
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章列表失败！');
            }
            // 限制只要后三篇文章
            res.data = res.data.splice(-3);
            // 调用模板引擎渲染
            var htmlStr = template('tpl-cate', res);
            $("[name=cate_id]").html(htmlStr);
            // 让layui查询渲染页面
            form.render();
        }
    })
}


// 1.监听筛选表单提交时间
$("#form-serch").on("submit", function (e) {
    e.preventDefault();
    // 获取表单选中项值
    var cate_id = $('[name=cate_id]').val();
    var state = $('[name=state]').val();
    //  为查询参数对象 q 对应的属性赋值
    q.cate_id = cate_id;
    q.state = state;
    // 根据最新的筛选条件重新筛选数据
    initTable();
})


// 定义渲染分页函数
function renderPage(total) {

    // 调用layui的方法渲染分页
    laypage.render({
        elem: 'pagBox',       // 分页容器的ID
        count: total,         // 总数据条数
        limit: q.pagesize,    //每页显示几条数据
        curr: q.pagenum,      // 设置默认被选中的分页
        layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
        limits: [2, 3, 5, 10],
        jump: function (obj, first) {  //回调 obj里有所有数据
            // 可以通过first值判断，来判断是通过哪种方式，出发的jump回调
            // 如果first值为true说明是通过laypage.render() 触发
            // 否则就是用户点击触发的
            // 1.把最新值给q查询参数对象中
            q.pagenum = obj.curr;
            // 1.把最新的条目数给q查询参数对象中
            q.pagesize = obj.limit;
            // 根据最新的q获取对应的数据列表
            if (!first) {
                initTable();

            }
            // q.pagesize = obj.limit;
            // 2.然后重新渲染

        }


    })
    // 1.拿用户点击的数据
    $("tbody").on('click', '.btn-delete', function () {
        // 删除按钮个数
        var len = $(".btn-delete").length;  //2
        console.log(len);
        // 获取文章id
        var id = $(this).attr('data-Id');

        layer.confirm('确认要删除吗?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    // 当数据删除后 判断当前这页是否还有剩余数据
                    // 如果没有数据了， 则让页码值-1后
                    // 再重新调用  删除成功后为0   之前为1
                    // 如果len的值为1 删完后就没有数据了 页码值就需要减1
                    if (len == 1) {
                        //  页码最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })



            layer.close(index);
        });
    })
}












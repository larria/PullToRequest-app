# 移动端下拉加载通用功能模块

--------------

`html/css资源借鉴自头条项目部分（王浩男）：http://cj.sina.cn/`

#### 资源引入

```html
<!-- 建议在head标签引入 -->
<link rel="stylesheet" href="css/PullToRequest.css">
<script src="js/PullToRequest.js"></script>
```

#### html

```html
<!-- 必须有父容器 -->
<div class="list_w">
    <!-- 下拉加载模块html部分，注意必须和list部分同级 -->
    <div class="feed-refresh">
        <i class="loading-icon"></i>
        <i class="pull-icon"></i>
        <span class="loading-words">正在加载...</span>
        <span class="pull-words">下拉刷新</span>
        <span class="release-words">松开立即刷新</span>
    </div>
    <!-- 下拉加载模块html部分 end -->
    <!-- list部分，必须具备明确id -->
    <ul id="list">
        ...
    </ul>
</div>
```

#### 业务JS调用

```javascript
// 创建下拉加载业务对象
var p0 = pullToRequest({
    // 动画运动对象
    list : 'list',
    // 可选，监听触摸的把手元素，一般就是list本身
    // handle : 'list',
    // 拉取过界后的响应回调
    onPullSuc : function () {
        // 异步业务逻辑，这里假设2s后复位
        setTimeout(function () {
            p0.homing();
        }, 2000);
    }
});
```

--------------
var pullToRequest = (function () {
    var pullTipWrap, handle, list, pullWrapHth, onPullSuc, disabled;
    var pullObj = {};
    var init = function (conf) {
        _initConf(conf);
        _addEvent();
        return pullObj;
    };
    pullObj.enable = function (enable) {
        disabled = !enable;
    };
    // 供外部调用：异步操作完成后通知组件复位
    pullObj.homing = function () {
        pullTipWrap.style.transform = list.style.transform = 'translate3d(0, 0, 0)';
        pullTipWrap.classList.remove('load');
        disabled = false;
    };
    pullObj.destructor = function () {
        // body...
    };
    function _initConf (conf) {
        // elements
        list = _id(conf.list);
        handle = conf.handle ? _id(conf.handle) : list;
        pullTipWrap = list.parentNode.getElementsByClassName('feed-refresh')[0];
        // init set
        list.style.willChange = 'transform';
        onPullSuc = conf.onPullSuc;
        pullWrapHth = pullTipWrap.offsetHeight;
    }
    function _addEvent () {
        var beginPull, startY, curY, intervalY, shouldTrigger;
        // 下拉跟手比率
        var pullPCT = 0.5, pullPCT2 = 0.2;
        handle.addEventListener('touchstart', __touchStart, false);
        handle.addEventListener('touchmove', __touchMove, false);
        handle.addEventListener('touchend', __touchEnd, false);
        handle.addEventListener('touchcancel', __touchEnd, false);
        function __touchStart (e) {
            // 符合下拉加载前提条件，开始下拉
            if(document.body.scrollTop < 5 && !disabled) {
                beginPull = true;
                startY = e.touches[0].pageY;
                list.style.transition = 'transform 0s ease';
            }
        }
        function __touchMove (e) {
            if(beginPull) {
                curY = e.touches[0].pageY;
                intervalY = curY - startY;
                // 如操作为向下拉动，启用下拉逻辑
                if(intervalY > 0) {
                    e.preventDefault();
                    // 如拉到了比tip元素高度还高的距离，为改善用户体验，tip固定住不再动，list单独动
                    if(intervalY > pullWrapHth / pullPCT) {
                        // tip固定住
                        pullTipWrap.style.transform = 'translate3d(0, ' + pullWrapHth + 'px, 0)';
                        // list单独动，且减小跟手比率
                        list.style.transform = 'translate3d(0, ' + (pullWrapHth + (intervalY - pullWrapHth / pullPCT) * pullPCT2) + 'px, 0)';
                        // 如拉到了确认行为的高度阀值，显示对应提示，并准备放手后触发下拉成功的回调
                        if(intervalY > pullWrapHth / pullPCT + 40) {
                            pullTipWrap.classList.add('release');
                            shouldTrigger = true;
                        }
                    // 如没有拉到比tip元素高度还长的区域，tip和list一起动
                    } else {
                        pullTipWrap.classList.remove('release');
                        pullTipWrap.style.transform = list.style.transform = 'translate3d(0, ' + pullPCT * intervalY + 'px, 0)';
                        shouldTrigger = false;
                    }
                }
            }
        }
        function __touchEnd (e) {
            if(beginPull) {
                // pullTipWrap.style.transform = list.style.transform = 'translate3d(0, 0, 0)';
                pullTipWrap.classList.remove('release');
                pullTipWrap.style.transform = list.style.transform = 'translate3d(0, 0, 0)';
                if(shouldTrigger) {
                    pullTipWrap.classList.add('load');
                    pullTipWrap.style.transform = list.style.transform = 'translate3d(0, ' + pullWrapHth + 'px, 0)';
                    list.style.transition = 'transform 0.25s ease';
                    disabled = true;
                    // trigger request
                    typeof onPullSuc === 'function' && onPullSuc();
                }
                startY = null;
                beginPull = false;
                shouldTrigger = false;
            }
        }
    }
    function _id (id) {
        return document.getElementById(id);
    }
    return init;
})();
// 左侧导航栏切换功能
(function() {
    const leftRail = document.getElementById('leftRail');
    const toggleBtn = document.getElementById('leftRailToggle');
    const iconElement = toggleBtn.querySelector('.iconfont');
    
    if (!leftRail || !toggleBtn) {
        console.error('左侧导航栏元素未找到');
        return;
    }
    
    // 切换导航栏显示/隐藏
    function toggleLeftRail() {
        const isHidden = leftRail.classList.contains('hidden');
        
        if (isHidden) {
            // 显示导航栏
            leftRail.classList.remove('hidden');
            // 切换图标为 icon-fanhui（返回/向左）
            iconElement.classList.remove('icon-gengduo');
            iconElement.classList.add('icon-fanhui');
        } else {
            // 隐藏导航栏
            leftRail.classList.add('hidden');
            // 切换图标为 icon-gengduo（更多/向右）
            iconElement.classList.remove('icon-fanhui');
            iconElement.classList.add('icon-gengduo');
        }
    }
    
    // 绑定点击事件
    toggleBtn.addEventListener('click', toggleLeftRail);
})();

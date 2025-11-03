document.addEventListener('DOMContentLoaded', function() {
    // 获取元素
    const searchTrigger = document.getElementById('nav-search-trigger');
    const searchOverlay = document.getElementById('nav-search-overlay');
    const searchInput = document.getElementById('nav-search-input');
    const searchBtn = document.getElementById('nav-search-btn');
    const searchClose = document.getElementById('nav-search-close');
    
    if (!searchTrigger || !searchOverlay || !searchInput || !searchBtn || !searchClose) {
        console.warn('搜索模块元素未找到');
        return;
    }
    
    // 存储原始滚动位置
    let scrollPosition = 0;
    
    // 阻止滚动的函数
    function preventScroll(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    
    // 显示搜索模块
    function showSearch() {
        // 保存当前滚动位置
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        
        searchOverlay.classList.add('active');
        
        // 延迟聚焦输入框，确保动画完成后再聚焦
        setTimeout(() => {
            searchInput.focus();
        }, 300);
        
        // 阻止body滚动
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = '100%';
        
        // 阻止所有滚动事件
        window.addEventListener('wheel', preventScroll, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });
        window.addEventListener('scroll', preventScroll, { passive: false });
        
        // 阻止容器的滚动
        const container = document.querySelector('.pages-container');
        if (container) {
            container.addEventListener('wheel', preventScroll, { passive: false });
            container.addEventListener('touchmove', preventScroll, { passive: false });
            container.addEventListener('scroll', preventScroll, { passive: false });
        }
    }
    
    // 隐藏搜索模块
    function hideSearch() {
        searchOverlay.classList.remove('active');
        
        // 恢复body滚动
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // 恢复滚动位置
        window.scrollTo(0, scrollPosition);
        
        // 移除滚动事件监听
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
        window.removeEventListener('scroll', preventScroll);
        
        // 移除容器的滚动事件监听
        const container = document.querySelector('.pages-container');
        if (container) {
            container.removeEventListener('wheel', preventScroll);
            container.removeEventListener('touchmove', preventScroll);
            container.removeEventListener('scroll', preventScroll);
        }
        
        // 清空输入框
        searchInput.value = '';
    }
    
    // 执行搜索
    function performSearch() {
        const keyword = searchInput.value.trim();
        if (keyword) {
            // 这里可以添加实际的搜索逻辑
            console.log('搜索关键词:', keyword);
            // 例如：跳转到搜索页面或执行AJAX搜索
            // window.location.href = `/search?q=${encodeURIComponent(keyword)}`;
        }
    }
    
    // 点击搜索图标显示搜索模块
    searchTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showSearch();
    });
    
    // 点击搜索按钮执行搜索
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        performSearch();
    });
    
    // 点击关闭按钮隐藏搜索模块
    searchClose.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        hideSearch();
    });
    
    // 点击背景遮罩关闭搜索模块
    searchOverlay.addEventListener('click', function(e) {
        // 如果点击的是遮罩层本身（不是子元素），则关闭
        if (e.target === searchOverlay) {
            hideSearch();
        }
    });
    
    // 阻止搜索容器内的点击事件冒泡
    const searchContainer = searchOverlay.querySelector('.nav-search-container');
    if (searchContainer) {
        searchContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // 按ESC键关闭搜索模块
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            hideSearch();
        }
    });
    
    // 按Enter键执行搜索
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
});


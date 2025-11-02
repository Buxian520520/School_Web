// 新闻模块轮播控制
(function() {
    'use strict';
    
    // 获取DOM元素
    const newsItems = document.querySelectorAll('.news-ul li');
    const mainImage = document.getElementById('news-main-image');
    const mainDate = document.getElementById('news-main-date');
    const mainTitle = document.getElementById('news-main-title');
    const mainContent = document.getElementById('news-main-content');
    const prevBtn = document.getElementById('news-prev-btn');
    const nextBtn = document.getElementById('news-next-btn');
    const pageCurrent = document.querySelector('.news-page-current');
    const pageTotal = document.querySelector('.news-page-total');
    
    if (!newsItems.length || !mainImage || !mainDate || !mainTitle || !mainContent) {
        console.warn('新闻模块元素未找到');
        return;
    }
    
    let currentIndex = 0;
    let autoInterval = null;
    let isHovering = false;
    const AUTO_INTERVAL_TIME = 3000; // 自动切换间隔（毫秒）
    
    // 更新主显示区域的内容
    function updateMainContent(index) {
        const item = newsItems[index];
        if (!item) return;
        
        const image = item.getAttribute('data-image');
        const date = item.getAttribute('data-date');
        const title = item.getAttribute('data-title');
        const content = item.getAttribute('data-content');
        
        // 更新内容（添加淡入淡出效果）
        if (mainImage) {
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = image;
                mainImage.style.opacity = '1';
            }, 150);
        }
        
        if (mainDate) mainDate.textContent = date;
        if (mainTitle) mainTitle.textContent = title;
        if (mainContent) mainContent.textContent = content;
        
        // 更新li的激活状态
        newsItems.forEach((li, i) => {
            li.classList.toggle('active', i === index);
        });
        
        // 更新页码显示
        if (pageCurrent) {
            pageCurrent.textContent = index + 1;
        }
        
        currentIndex = index;
    }
    
    // 初始化主显示区域内容
    function initMainContent() {
        updateMainContent(0);
        
        // 添加图片过渡效果
        if (mainImage) {
            mainImage.style.transition = 'opacity 0.3s ease';
        }
        
        // 初始化总页数
        if (pageTotal) {
            pageTotal.textContent = newsItems.length;
        }
    }
    
    // 切换到上一个
    function goToPrev() {
        stopAutoCycle();
        currentIndex = (currentIndex - 1 + newsItems.length) % newsItems.length;
        updateMainContent(currentIndex);
        startAutoCycle();
    }
    
    // 切换到下一个
    function goToNext() {
        stopAutoCycle();
        currentIndex = (currentIndex + 1) % newsItems.length;
        updateMainContent(currentIndex);
        startAutoCycle();
    }
    
    // 自动循环切换
    function startAutoCycle() {
        if (autoInterval) {
            clearInterval(autoInterval);
        }
        
        autoInterval = setInterval(() => {
            if (!isHovering) {
                currentIndex = (currentIndex + 1) % newsItems.length;
                updateMainContent(currentIndex);
            }
        }, AUTO_INTERVAL_TIME);
    }
    
    // 停止自动循环
    function stopAutoCycle() {
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
        }
    }
    
    // 为每个li添加鼠标悬停事件
    newsItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            isHovering = true;
            stopAutoCycle();
            updateMainContent(index);
        });
        
        item.addEventListener('mouseleave', function() {
            isHovering = false;
            startAutoCycle();
        });
    });
    
    // 为导航按钮添加点击事件
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            goToPrev();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            goToNext();
        });
    }
    
    // 初始化
    initMainContent();
    startAutoCycle();
    
    // 页面可见性变化时控制自动循环
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoCycle();
        } else {
            if (!isHovering) {
                startAutoCycle();
            }
        }
    });
})();


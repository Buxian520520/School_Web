// 教学科研模块自动切换控制
(function() {
    'use strict';
    
    // 获取DOM元素
    const studyItems = document.querySelectorAll('.study-shadow .study-item');
    const mainImage = document.getElementById('study-main-image');
    const mainTitle = document.getElementById('study-main-title');
    
    if (!studyItems.length) {
        console.warn('教学科研模块元素未找到');
        return;
    }
    
    let currentIndex = 0;
    let autoInterval = null;
    let isHovering = false;
    const AUTO_INTERVAL_TIME = 3000; // 自动切换间隔（毫秒）
    
    // 更新激活状态和大图内容
    function updateActiveState(index) {
        const item = studyItems[index];
        if (!item) return;
        
        // 更新li的激活状态
        studyItems.forEach((li, i) => {
            li.classList.toggle('active', i === index);
        });
        
        // 更新大图
        const image = item.getAttribute('data-image');
        const title = item.getAttribute('data-title');
        
        if (mainImage && image) {
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = image;
                mainImage.style.opacity = '1';
            }, 150);
        }
        
        // 更新标题
        if (mainTitle && title) {
            mainTitle.textContent = title;
        }
        
        currentIndex = index;
    }
    
    // 自动循环切换
    function startAutoCycle() {
        if (autoInterval) {
            clearInterval(autoInterval);
        }
        
        autoInterval = setInterval(() => {
            if (!isHovering) {
                currentIndex = (currentIndex + 1) % studyItems.length;
                updateActiveState(currentIndex);
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
    studyItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            isHovering = true;
            stopAutoCycle();
            updateActiveState(index);
        });
        
        item.addEventListener('mouseleave', function() {
            isHovering = false;
            startAutoCycle();
        });
    });
    
    // 初始化大图过渡效果
    if (mainImage) {
        mainImage.style.transition = 'opacity 0.3s ease';
    }
    
    // 初始化
    updateActiveState(0);
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


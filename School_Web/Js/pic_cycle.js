// 轮播图功能 - 无缝衔接版本
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.showdiv .flow-pic ul');
    const items = document.querySelectorAll('.showdiv .flow-pic ul li');
    const buttonText = document.querySelector('.showdiv .flow-pic .button .txt');
    const prevBtn = document.querySelector('.showdiv .flow-pic .button .left');
    const nextBtn = document.querySelector('.showdiv .flow-pic .button .right');
    
    if (!carousel || items.length === 0) {
        console.warn('轮播图元素未找到');
        return;
    }
    
    // 配置参数
    const itemWidth = 458 + 46; // 图片宽度 + 右边距
    const originalItemsCount = items.length - 2; // 原始图片数量（去掉复制的两张）
    let currentIndex = 1; // 从第一个原始图片开始（索引1）
    let autoPlayInterval;
    let isAnimating = false;
    
    // 初始化位置
    function initializeCarousel() {
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        updateButtonText();
    }
    
    // 更新按钮文本
    function updateButtonText() {
        if (buttonText) {
            // 显示原始图片的索引（1-5）
            buttonText.textContent = `${getOriginalIndex(currentIndex)}/${originalItemsCount}`;
        }
    }
    
    // 获取原始图片索引
    function getOriginalIndex(index) {
        if (index === 0) return originalItemsCount; // 开头的复制图片对应最后一张
        if (index === items.length - 1) return 1; // 结尾的复制图片对应第一张
        return index; // 其他情况直接返回
    }
    
    // 切换到指定索引
    function goToSlide(index, withAnimation = true) {
        if (isAnimating) return;
        
        isAnimating = true;
        currentIndex = index;
        
        if (withAnimation) {
            carousel.style.transition = 'transform 0.8s ease-in-out';
        } else {
            carousel.style.transition = 'none';
        }
        
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        updateButtonText();
        
        // 动画结束后处理边界情况
        if (withAnimation) {
            setTimeout(() => {
                handleBoundaryCases();
                isAnimating = false;
            }, 800);
        } else {
            isAnimating = false;
        }
    }
    
    // 处理边界情况（无缝跳转）
    function handleBoundaryCases() {
        // 如果到达复制的最后一张（实际是第一张的复制）
        if (currentIndex === items.length - 1) {
            carousel.style.transition = 'none';
            currentIndex = 1; // 跳转到真正的第一张
            carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            updateButtonText();
        }
        // 如果到达复制的第一张（实际是最后一张的复制）
        else if (currentIndex === 0) {
            carousel.style.transition = 'none';
            currentIndex = items.length - 2; // 跳转到真正的最后一张
            carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            updateButtonText();
        }
    }
    
    // 下一张图片
    function nextSlide() {
        if (isAnimating) return;
        goToSlide(currentIndex + 1);
    }
    
    // 上一张图片
    function prevSlide() {
        if (isAnimating) return;
        goToSlide(currentIndex - 1);
    }
    
    // 自动播放
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            if (!isAnimating) {
                nextSlide();
            }
        }, 3000); // 3秒切换
    }
    
    // 停止自动播放
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // 初始化
    function init() {
        initializeCarousel();
        startAutoPlay();
        
        // 鼠标悬停时暂停自动播放
        const flowPic = document.querySelector('.showdiv .flow-pic');
        if (flowPic) {
            flowPic.addEventListener('mouseenter', stopAutoPlay);
            flowPic.addEventListener('mouseleave', startAutoPlay);
        }
        
        // 按钮事件
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                stopAutoPlay();
                prevSlide();
                setTimeout(startAutoPlay, 3000);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                stopAutoPlay();
                nextSlide();
                setTimeout(startAutoPlay, 3000);
            });
        }
        
        // 监听窗口大小变化，重新计算位置
        window.addEventListener('resize', function() {
            initializeCarousel();
        });
    }
    
    // 启动轮播图
    init();
});
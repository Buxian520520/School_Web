// 图书馆页面图片轮播图功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取轮播图相关元素
    const carousel = document.querySelector('.lib-carousel-list');
    const items = document.querySelectorAll('.lib-carousel-list li');
    
    // 检查元素是否存在
    if (!carousel || items.length === 0) {
        console.warn('轮播图元素未找到');
        return;
    }
    
    // 配置参数
    let itemWidth = 0; // 每张图片宽度，动态计算
    const originalItemsCount = items.length - 2; // 原始图片数量（去掉开头和结尾的复制图片）
    let currentIndex = 1; // 从第一个原始图片开始（索引1）
    let isAnimating = false; // 动画状态锁
    let autoPlayTimer = null; // 自动播放定时器
    const autoPlayDuration = 3000; // 自动播放时长（毫秒）
    
    // 计算轮播图宽度
    function calculateItemWidth() {
        // 获取hero容器的实际宽度
        const heroElement = document.querySelector('.hero');
        if (heroElement) {
            itemWidth = heroElement.offsetWidth;
        } else {
            itemWidth = window.innerWidth;
        }
        return itemWidth;
    }
    
    // 初始化轮播图位置
    function initializeCarousel() {
        calculateItemWidth();
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        startAutoPlay();
    }
    
    // 处理边界情况（实现无限循环）
    function handleBoundaryCases() {
        // 如果到达复制的最后一张（实际是第一张的复制）
        if (currentIndex === items.length - 1) {
            carousel.style.transition = 'none';
            currentIndex = 1; // 跳转到真正的第一张
            carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }
        // 如果到达复制的第一张（实际是最后一张的复制）
        else if (currentIndex === 0) {
            carousel.style.transition = 'none';
            currentIndex = items.length - 2; // 跳转到真正的最后一张
            carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        }
    }
    
    // 切换到指定索引
    function goToSlide(index, withAnimation = true) {
        if (isAnimating) return;
        
        isAnimating = true;
        currentIndex = index;
        
        // 设置过渡效果
        if (withAnimation) {
            carousel.style.transition = 'transform 0.8s ease-in-out';
        } else {
            carousel.style.transition = 'none';
        }
        
        // 应用变换
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        
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
    
    // 下一张图片
    function nextSlide() {
        if (isAnimating) return;
        // 直接切换到下一张图片（继续向前滑动）
        goToSlide(currentIndex + 1);
    }
    
    // 开始自动播放
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(() => {
            if (!isAnimating) {
                nextSlide();
            }
        }, autoPlayDuration);
    }
    
    // 停止自动播放
    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }
    
    // 初始化函数
    function init() {
        // 初始化轮播图位置
        initializeCarousel();
        
        // 鼠标悬停时暂停自动播放
        const carouselContainer = document.querySelector('.lib-carousel');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', stopAutoPlay);
            carouselContainer.addEventListener('mouseleave', startAutoPlay);
        }
        
        // 监听窗口大小变化，重新计算位置
        window.addEventListener('resize', function() {
            calculateItemWidth(); // 重新计算宽度
            initializeCarousel();
        });
    }
    
    // 启动轮播图
    init();
});

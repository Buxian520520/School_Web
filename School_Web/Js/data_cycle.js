document.addEventListener('DOMContentLoaded', function() {
    // 获取轮播图相关元素
    const dataBd = document.querySelector('.data-bd');
    const list = dataBd.querySelector('ul');
    const originalItems = Array.from(dataBd.querySelectorAll('li'));
    const prevBtn = document.querySelector('.data-view .wp .button .left');
    const nextBtn = document.querySelector('.data-view .wp .button .right');
    
    if (originalItems.length < 3) {
        console.warn('至少需要3张图片进行轮播');
        return;
    }
    
    const visibleCount = 3; // 一次显示3张
    const totalItems = originalItems.length;
    const maxIndex = Math.max(originalItems.length - visibleCount, 0);

    // 计算单个项目的总宽度（宽度 + 左右外边距）
    function calculateItemWidth() {
        const firstItem = list.children[0] || originalItems[0];
        const style = window.getComputedStyle(firstItem);
        const width = parseFloat(style.width);
        const marginRight = parseFloat(style.marginRight);
        const marginLeft = parseFloat(style.marginLeft);
        return width + marginLeft + marginRight;
    }
    
    let itemWidth = 0;
    let currentIndex = 0;
    let isAnimating = false;
    let autoPlayInterval;
    
    // 不再克隆，直接使用原始节点
    const allItems = Array.from(list.querySelectorAll('li'));
    
    // 设置初始位置（显示原始的第0、1、2张）
    function setInitialPosition() {
        // 左起第一张
        currentIndex = 0;
        itemWidth = calculateItemWidth();
        list.style.transition = 'none';
        list.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        updateItemsState();
    }
    
    // 更新图片状态（active和adjacent）
    function updateItemsState() {
        allItems.forEach((item, index) => {
            item.classList.remove('active', 'adjacent');
            
            // 视觉中的第一张放大（左起第一张）
            if (index === currentIndex) {
                item.classList.add('active');
            }
            // 左右相邻图片
            else if (index === currentIndex - 1 || index === currentIndex + 1) {
                item.classList.add('adjacent');
            }
        });
    }
    
    // 更新轮播图位置
    function updateCarousel(withAnimation = true) {
        if (isAnimating) return;
        
        isAnimating = true;
        
        const translateX = -currentIndex * itemWidth;
        
        if (withAnimation) {
            list.style.transition = 'transform 0.6s ease-in-out';
        } else {
            list.style.transition = 'none';
        }
        
        list.style.transform = `translateX(${translateX}px)`;
        updateItemsState();
        
        if (withAnimation) {
            setTimeout(() => {
                handleBoundary();
                isAnimating = false;
            }, 600);
        } else {
            isAnimating = false;
        }
    }
    
    // 处理循环边界
    function handleBoundary() {
        // 末尾后跳回第一张；开头前跳到最后一组起始（避免空位）
        if (currentIndex > maxIndex) {
            list.style.transition = 'none';
            currentIndex = 0;
            list.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            updateItemsState();
        } else if (currentIndex < 0) {
            list.style.transition = 'none';
            currentIndex = maxIndex;
            list.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            updateItemsState();
        }
    }
    
    // 下一张
    function nextSlide() {
        if (isAnimating) return;
        currentIndex++;
        updateCarousel();
    }
    
    // 上一张
    function prevSlide() {
        if (isAnimating) return;
        currentIndex--;
        updateCarousel();
    }
    
    // 自动播放
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            if (!isAnimating) {
                nextSlide();
            }
        }, 4000);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // 绑定事件
    function bindEvents() {
        // 按钮事件
        prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            prevSlide();
            setTimeout(startAutoPlay, 4000);
        });
        
        nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            nextSlide();
            setTimeout(startAutoPlay, 4000);
        });
        
        // 鼠标悬停仅暂停/恢复自动播放，不影响放大状态
        dataBd.addEventListener('mouseenter', () => {
            stopAutoPlay();
        });
        dataBd.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
        
        const buttonArea = document.querySelector('.data-view .wp .button');
        buttonArea.addEventListener('mouseenter', () => {
            stopAutoPlay();
        });
        buttonArea.addEventListener('mouseleave', () => {
            startAutoPlay();
        });

        // 窗口变化时，重新计算宽度并修正位置
        window.addEventListener('resize', () => {
            const previousItemWidth = itemWidth;
            itemWidth = calculateItemWidth();
            // 根据新宽度重设translate，保持第一张在左边
            list.style.transition = 'none';
            list.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        });
    }
    
    // 初始化
    function init() {
        setInitialPosition();
        bindEvents();
        startAutoPlay();
    }
    
    // 启动轮播图
    init();
});
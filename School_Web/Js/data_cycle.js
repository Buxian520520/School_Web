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
    // 仅在末尾追加前两张的克隆（用于末尾视觉延展）
    const appendCount = visibleCount - 1; // 2
    for (let i = 0; i < appendCount; i++) {
        const clone = originalItems[i].cloneNode(true);
        list.appendChild(clone);
    }
    const maxIndex = Math.max(totalItems - visibleCount, 0); // 最后一个合法起始索引

    // 计算单个项目的总宽度（宽度 + 左右外边距）
    function calculateItemWidth() {
        const firstItem = originalItems[0] || list.children[0];
        const style = window.getComputedStyle(firstItem);
        const width = parseFloat(style.width);
        const marginRight = parseFloat(style.marginRight);
        const marginLeft = parseFloat(style.marginLeft);
        return width + marginLeft + marginRight;
    }
    
    let itemWidth = 0;
    let currentIndex = 0; // 初始显示最前3张
    let isAnimating = false;
    let autoPlayInterval;
    let direction = 1; // 1 向后，-1 向前（到边界反弹）
    const TRANSITION_MS = 800;
    
    // allItems 包含末尾克隆
    let allItems = Array.from(list.querySelectorAll('li'));
    
    // 设置初始位置（显示原始的第0、1、2张）
    function setInitialPosition() {
        // 初始在第一个真实元素（索引0）
        currentIndex = 0;
        itemWidth = calculateItemWidth();
        list.style.transition = 'none';
        list.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        updateItemsState();
    }
    
    // 更新图片状态（active和adjacent）
    function updateItemsState() {
        allItems = Array.from(list.querySelectorAll('li'));
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
    
    // 无缝切换到指定索引
    function goToSlide(index, withAnimation = true) {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex = index;

        if (withAnimation) {
            list.style.transition = `transform ${TRANSITION_MS}ms ease-in-out`;
        } else {
            list.style.transition = 'none';
        }

        list.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        updateItemsState();

        if (withAnimation) {
            setTimeout(() => {
                handleBoundary();
                isAnimating = false;
            }, TRANSITION_MS);
        } else {
            isAnimating = false;
        }
    }
    
    // 边界控制（不跳转）：仅在合法范围内切换
    function handleBoundary() {
        if (currentIndex > maxIndex) {
            currentIndex = maxIndex;
        }
        if (currentIndex < 0) {
            currentIndex = 0;
        }
    }
    
    // 下一张
    function nextSlide() {
        if (isAnimating) return;
        if (currentIndex < maxIndex) {
            goToSlide(currentIndex + 1, true);
        }
    }
    
    // 上一张
    function prevSlide() {
        if (isAnimating) return;
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1, true);
        }
    }
    
    // 自动播放
    function startAutoPlay() {
        stopAutoPlay();
        autoPlayInterval = setInterval(() => {
            if (isAnimating) return;
            // 在边界反弹
            if (currentIndex === maxIndex) direction = -1;
            if (currentIndex === 0) direction = 1;
            if (direction === 1) {
                nextSlide();
            } else {
                prevSlide();
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
// 首页轮播图功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取首页轮播图相关元素
    const carousel = document.querySelector('.home-carousel-list');
    const items = document.querySelectorAll('.home-carousel-list li');
    const progressItems = document.querySelectorAll('.home-carousel-progress-item');
    const progressBars = document.querySelectorAll('.home-carousel-progress-bar');
    
    // 检查元素是否存在
    if (!carousel || items.length === 0 || progressItems.length === 0) {
        console.warn('首页轮播图元素未找到');
        return;
    }
    
    // 配置参数
    let itemWidth = window.innerWidth; // 每张图片宽度为视口宽度
    const originalItemsCount = items.length - 2; // 原始图片数量（去掉开头和结尾的复制图片）
    let currentIndex = 1; // 从第一个原始图片开始（索引1）
    let currentProgressIndex = 0; // 当前进度条索引（0-4）
    let isAnimating = false; // 动画状态锁
    let progressTimer = null; // 进度条定时器
    const autoPlayDuration = 3000; // 自动播放时长（毫秒）
    
    // 初始化轮播图位置
    function initializeCarousel() {
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        // 重置所有进度条
        resetAllProgress();
        // 开始当前进度条的读条
        startProgress(currentProgressIndex);
    }
    
    // 重置所有进度条
    function resetAllProgress() {
        progressBars.forEach((bar, index) => {
            bar.style.transition = 'none';
            bar.style.width = '0%';
        });
    }
    
    // 开始指定索引的进度条动画
    function startProgress(index) {
        if (index >= 0 && index < progressBars.length) {
            // 清除之前的定时器
            if (progressTimer) {
                clearTimeout(progressTimer);
                progressTimer = null;
            }
            
            const currentBar = progressBars[index];
            if (currentBar) {
                // 先重置当前进度条（无动画）
                currentBar.style.transition = 'none';
                currentBar.style.width = '0%';
                
                // 使用requestAnimationFrame确保重置生效后再开始动画
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        currentBar.style.transition = `width ${autoPlayDuration}ms linear`;
                        currentBar.style.width = '100%';
                        
                        // 设置定时器，在进度条完成后切换到下一张
                        progressTimer = setTimeout(() => {
                            if (!isAnimating) {
                                nextSlide();
                            }
                        }, autoPlayDuration);
                    });
                });
            }
        }
    }
    
    // 处理边界情况（实现无限循环）
    function handleBoundaryCases() {
        // 如果到达复制的最后一张（实际是第一张的复制）
        if (currentIndex === items.length - 1) {
            carousel.style.transition = 'none';
            currentIndex = 1; // 跳转到真正的第一张
            carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            currentProgressIndex = 0; // 重置进度条索引
        }
        // 如果到达复制的第一张（实际是最后一张的复制）
        else if (currentIndex === 0) {
            carousel.style.transition = 'none';
            currentIndex = items.length - 2; // 跳转到真正的最后一张
            carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            currentProgressIndex = originalItemsCount - 1; // 设置为最后一张的进度条
        }
    }
    
    // 切换到指定索引
    function goToSlide(index, withAnimation = true) {
        if (isAnimating) return;
        
        isAnimating = true;
        
        // 先停止当前进度条动画，但不立即重置（避免闪烁）
        if (progressTimer) {
            clearTimeout(progressTimer);
            progressTimer = null;
        }
        
        // 停止当前进度条的动画（保持当前宽度，不重置）
        const currentBar = progressBars[currentProgressIndex];
        if (currentBar) {
            // 获取当前宽度并保持
            const computedStyle = window.getComputedStyle(currentBar);
            const currentWidth = computedStyle.width;
            // 移除transition，防止动画继续
            currentBar.style.transition = 'none';
            currentBar.style.width = currentWidth;
        }
        
        currentIndex = index;
        
        // 设置过渡效果
        if (withAnimation) {
            carousel.style.transition = 'transform 0.8s ease-in-out';
        } else {
            carousel.style.transition = 'none';
        }
        
        // 应用变换
        carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        
        // 动画结束后处理边界情况并开始新的进度条
        if (withAnimation) {
            setTimeout(() => {
                handleBoundaryCases();
                
                // 更新进度条索引（映射到0-4）
                // currentIndex从1开始，对应原始图片1-5
                // 进度条索引从0开始，对应0-4
                // 注意：处理边界情况后，currentIndex可能已经改变
                currentProgressIndex = (currentIndex - 1) % originalItemsCount;
                
                isAnimating = false;
                // 重置所有进度条并开始当前进度条的读条
                resetAllProgress();
                startProgress(currentProgressIndex);
            }, 800);
        } else {
            // 更新进度条索引
            currentProgressIndex = (currentIndex - 1) % originalItemsCount;
            isAnimating = false;
            resetAllProgress();
            startProgress(currentProgressIndex);
        }
    }
    
    // 下一张图片
    function nextSlide() {
        if (isAnimating) return;
        // 直接切换到下一张图片（继续向前滑动）
        goToSlide(currentIndex + 1);
    }
    
    // 控制进度条的显示/隐藏（只在首页显示）
    function updateProgressVisibility() {
        const homePage = document.querySelector('.page.home');
        const progressContainer = document.querySelector('.home-carousel-progress');
        
        if (homePage && progressContainer) {
            const container = document.querySelector('.pages-container');
            const currentScrollTop = container.scrollTop;
            const isOnHomePage = currentScrollTop < window.innerHeight;
            
            // 只在首页时显示进度条
            progressContainer.style.display = isOnHomePage ? 'flex' : 'none';
        }
    }
    
    // 初始化函数
    function init() {
        // 初始化轮播图位置
        initializeCarousel();
        
        // 初始显示进度条
        updateProgressVisibility();
        
        // 监听滚动事件，控制进度条显示
        const container = document.querySelector('.pages-container');
        if (container) {
            container.addEventListener('scroll', updateProgressVisibility);
        }
        
        // 为 ul 添加点击事件，点击 ul 时阻止任何操作
        const progressContainer = document.querySelector('.home-carousel-progress');
        if (progressContainer) {
            progressContainer.addEventListener('click', function(e) {
                // 如果点击的是 ul 本身而不是 li，阻止事件传播和默认行为
                if (e.target === progressContainer) {
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
                // 如果点击的不是 li 元素，也阻止操作
                if (!e.target.closest('.home-carousel-progress-item')) {
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }
            });
        }
        
        // 为每个进度条添加点击事件
        progressItems.forEach((item, index) => {
            item.addEventListener('click', function(e) {
                // 确保点击的是当前 li 或其子元素（不包含 ul）
                // e.currentTarget 是 li，e.target 是实际点击的元素
                if (e.target === progressContainer) {
                    return; // 如果点击的是 ul，直接返回
                }
                
                // 阻止事件冒泡
                e.stopPropagation();
                
                // 清除当前的进度条定时器
                if (progressTimer) {
                    clearTimeout(progressTimer);
                    progressTimer = null;
                }
                
                // 目标图片索引（原始图片索引从1开始，所以index+1）
                const targetIndex = index + 1;
                
                // 计算当前进度条索引
                const currentProgressIndex = (currentIndex - 1) % originalItemsCount;
                
                // 如果点击的是当前显示的图片，不需要跳转，只需要重置进度条
                if (currentIndex === targetIndex && !isAnimating) {
                    resetAllProgress();
                    startProgress(index);
                    return;
                }
                
                // 如果正在动画中，不处理点击（避免重复操作）
                if (isAnimating) {
                    return;
                }
                
                // 点击切换图片：先切换，进度条重置会在动画完成后自动执行
                goToSlide(targetIndex);
            });
        });
        
        // 监听窗口大小变化，重新计算位置
        window.addEventListener('resize', function() {
            itemWidth = window.innerWidth; // 重新计算宽度
            initializeCarousel();
        });
    }
    
    // 启动轮播图
    init();
});

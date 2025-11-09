/* ============================================
   3D六边形轮播图组件 - JavaScript部分
   确保HTML结构中的ID匹配
   ============================================ */

(function() {
    'use strict';
    
    // 等待DOM加载完成
    function initHexagonCarousel() {
        // 获取轮播元素
        const carousel = document.getElementById('hexagonCarousel');
        const container = document.getElementById('hexagonCarouselContainer');
        
        // 如果元素不存在，直接返回
        if (!carousel || !container) {
            return;
        }
        
        const items = carousel.querySelectorAll('li');
        const itemCount = items.length;
        
        if (itemCount === 0) {
            return;
        }
        
        // ========== 配置参数 ==========
        const config = {
            angle: 360 / itemCount, // 自动计算每个项目的角度（360度 / 项目数）
            intervalTime: 3000, // 轮播间隔时间（毫秒）
            tiltAngle: -15, // 俯视角度（负值表示向上倾斜，形成俯视效果）
            spacingFactor: 1.05 // 间距因子（越大间距越大，防止重叠，建议1.0-1.5）
        };
        
        // ========== 获取第一个元素的尺寸 ==========
        function getItemSize() {
            if (items.length === 0) return { width: 300, height: 169 };
            const firstItem = items[0];
            const computedStyle = window.getComputedStyle(firstItem);
            return {
                width: parseFloat(computedStyle.width) || firstItem.offsetWidth,
                height: parseFloat(computedStyle.height) || firstItem.offsetHeight
            };
        }
        
        // ========== 自动计算半径，避免重叠 ==========
        function calculateRadius(itemWidth, itemAngle) {
            // 将角度转换为弧度
            const angleInRadians = (itemAngle * Math.PI) / 180;
            // 计算相邻元素之间的弧长：半径 × 角度（弧度）
            // 为了不重叠，弧长应该 >= 元素宽度 × 间距因子
            const minArcLength = itemWidth * config.spacingFactor;
            // 计算最小半径：半径 = 弧长 / 角度（弧度）
            const minRadius = minArcLength / angleInRadians;
            // 返回一个稍大的半径，确保有足够的安全边距（缩小倍数以减少间距）
            return minRadius * 1.02;
        }
        
        // ========== 自动设置容器大小 ==========
        function setContainerSize(itemSize, radius) {
            // 容器宽度 = 元素宽度 + 半径的2倍 + 边距（减少边距使更紧凑）
            const containerWidth = itemSize.width + radius * 2 + 60;
            // 容器高度 = 元素高度 + 半径的1.5倍 + 边距（考虑俯视角度，减少边距）
            const containerHeight = itemSize.height + radius * 1.5 + 60;
            container.style.width = containerWidth + 'px';
            container.style.height = containerHeight + 'px';
            // 更新透视距离，使其与容器大小匹配
            const perspective = Math.max(containerWidth, containerHeight) * 1.5;
            container.style.perspective = perspective + 'px';
        }
        
        // ========== 自动设置元素居中 ==========
        function setItemCenter(item) {
            const itemSize = getItemSize();
            item.style.marginLeft = -itemSize.width / 2 + 'px';
            item.style.marginTop = -itemSize.height / 2 + 'px';
        }
        
        // ========== 初始化轮播图 ==========
        let timerId = null; // 保证只有一个定时器，避免闪频

        function updateFrontBackClasses(currentAngle) {
            items.forEach((item, index) => {
                const rawAngle = index * config.angle - currentAngle;
                // 归一化到 [-180, 180)
                let normalized = ((rawAngle + 180) % 360 + 360) % 360 - 180;
                const isBack = Math.abs(normalized) > 90;
                if (isBack) {
                    item.classList.add('is-back');
                } else {
                    item.classList.remove('is-back');
                }
            });
        }

        function initCarousel() {
            const itemSize = getItemSize();
            const radius = calculateRadius(itemSize.width, config.angle);
            
            // 设置容器大小
            setContainerSize(itemSize, radius);
            
            // 初始化每个li的位置和角度
            items.forEach((item, index) => {
                // 设置居中
                setItemCenter(item);
                
                // 计算每个项目的旋转角度
                const rotateY = index * config.angle;
                // 设置旋转和位置
                item.style.transform = `rotateY(${rotateY}deg) translateZ(${radius}px)`;
            });
            
            // 应用初始倾斜角度
            let currentAngle = 0;
            carousel.style.transform = `rotateX(${config.tiltAngle}deg) rotateY(-${currentAngle}deg)`;
            updateFrontBackClasses(currentAngle);
            
            // 旋转轮播图的函数
            function rotateCarousel(direction = 1) {
                currentAngle += config.angle * direction;
                carousel.style.transform = `rotateX(${config.tiltAngle}deg) rotateY(-${currentAngle}deg)`;
                updateFrontBackClasses(currentAngle);
            }
            
            // 下一张（向右旋转）
            function nextSlide() {
                rotateCarousel(1);
                // 重置自动播放定时器
                resetAutoPlay();
            }
            
            // 上一张（向左旋转）
            function prevSlide() {
                rotateCarousel(-1);
                // 重置自动播放定时器
                resetAutoPlay();
            }
            
            // 重置自动播放
            function resetAutoPlay() {
                if (timerId) {
                    clearInterval(timerId);
                }
                timerId = setInterval(() => rotateCarousel(1), config.intervalTime);
            }
            
            // 设置定时自动轮播
            resetAutoPlay();
            
            // 绑定按钮事件
            const prevBtn = document.getElementById('hexagonPrevBtn');
            const nextBtn = document.getElementById('hexagonNextBtn');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    prevSlide();
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    nextSlide();
                });
            }
        }
        
        // 初始化轮播图
        initCarousel();
        
        // 如果元素尺寸动态改变，可以调用 initCarousel() 重新初始化
        // 也可以监听窗口大小变化，自动调整
        window.addEventListener('resize', function() {
            // 延迟执行，等待CSS应用
            setTimeout(initCarousel, 100);
        });
    }
    
    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHexagonCarousel);
    } else {
        initHexagonCarousel();
    }
})();

/* ============================================
   使用说明：
   1. 只需修改 .hexagon-carousel li 的 width 和 height
   2. 所有布局计算会自动进行，无需手动调整
   3. 如需修改轮播间隔、俯视角度等，修改 config 对象中的参数
   ============================================ */


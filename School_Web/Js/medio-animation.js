document.addEventListener('DOMContentLoaded', function() {
    const emailShadow = document.querySelector('.email-shadow');
    const leftBlock = document.querySelector('.email-shadow .left');
    const rightBlock = document.querySelector('.email-shadow .right');
    const container = document.querySelector('.pages-container');
    const nextPage = document.querySelector('.page.next');
    
    if (!emailShadow || !leftBlock || !rightBlock) {
        console.warn('邮箱和链接模块元素未找到');
        return;
    }
    
    if (!container) {
        console.warn('页面容器未找到');
        return;
    }
    
    if (!nextPage) {
        console.warn('第二个页面未找到');
        return;
    }
    
    let isVisible = false;
    
    // 检测是否滚动到第二个页面的最底部
    function isAtBottom() {
        // 检测 .page.next 是否滚动到底部
        const nextPageScrollTop = nextPage.scrollTop;
        const nextPageScrollHeight = nextPage.scrollHeight;
        const nextPageClientHeight = nextPage.clientHeight;
        
        // 如果 .page.next 有内部滚动
        if (nextPageScrollHeight > nextPageClientHeight) {
            const distanceFromBottom = nextPageScrollHeight - nextPageScrollTop - nextPageClientHeight;
            return distanceFromBottom <= 30;
        }
        
        // 如果没有内部滚动，检测容器是否滚动到第二个页面的底部
        // 即容器的滚动位置是否达到了第二个页面的底部位置
        const containerScrollTop = container.scrollTop;
        const containerScrollHeight = container.scrollHeight;
        const containerClientHeight = container.clientHeight;
        
        // 计算第二个页面的底部位置
        const nextPageTop = nextPage.offsetTop;
        const nextPageHeight = nextPage.offsetHeight;
        const nextPageBottom = nextPageTop + nextPageHeight;
        
        // 检测视口底部是否到达了第二个页面的底部
        const viewportBottom = containerScrollTop + containerClientHeight;
        const distanceFromNextPageBottom = nextPageBottom - viewportBottom;
        
        return distanceFromNextPageBottom <= 30;
    }
    
    // 检查并更新动画状态
    function checkAndUpdateAnimation() {
        const atBottom = isAtBottom();
        
        if (atBottom) {
            // 到达第二个页面最底部时，显示动画（从两边向中间移动）
            if (!isVisible) {
                isVisible = true;
                // 使用 setTimeout 确保过渡效果生效
                setTimeout(() => {
                    leftBlock.classList.remove('animate-out');
                    rightBlock.classList.remove('animate-out');
                    leftBlock.classList.add('animate-in');
                    rightBlock.classList.add('animate-in');
                }, 10);
            }
        } else {
            // 离开底部时，隐藏动画（向两边移动消失，有过渡效果）
            if (isVisible) {
                isVisible = false;
                // 使用 setTimeout 确保过渡效果生效
                setTimeout(() => {
                    leftBlock.classList.remove('animate-in');
                    rightBlock.classList.remove('animate-in');
                    leftBlock.classList.add('animate-out');
                    rightBlock.classList.add('animate-out');
                }, 10);
            }
        }
    }
    
    // 同时监听容器的滚动和第二个页面的滚动
    container.addEventListener('scroll', checkAndUpdateAnimation, { passive: true });
    
    // 如果第二个页面有内部滚动，也监听其滚动事件
    if (nextPage.scrollHeight > nextPage.clientHeight) {
        nextPage.addEventListener('scroll', checkAndUpdateAnimation, { passive: true });
    }
    
    // 初始检查
    checkAndUpdateAnimation();
    
    // 初始状态：确保元素在页面加载时是隐藏的（向外移动并透明）
    if (!isAtBottom()) {
        leftBlock.classList.add('animate-out');
        rightBlock.classList.add('animate-out');
        isVisible = false;
    } else {
        // 如果初始就在底部，显示动画
        leftBlock.classList.add('animate-in');
        rightBlock.classList.add('animate-in');
        isVisible = true;
    }
    
    // 邮箱图标旋转功能
    const emailIcon = document.querySelector('.email-shadow .left .logo img');
    
    if (emailIcon) {
        // 鼠标进入左侧块时，邮箱图标绕y轴旋转360度
        leftBlock.addEventListener('mouseenter', function() {
            // 移除之前的旋转类，以便可以重复触发动画
            emailIcon.classList.remove('rotate-y');
            // 使用 setTimeout 确保动画可以重复触发
            setTimeout(() => {
                emailIcon.classList.add('rotate-y');
            }, 10);
        });
        
        // 鼠标离开左侧块时，邮箱图标再次绕y轴旋转360度
        leftBlock.addEventListener('mouseleave', function() {
            // 移除之前的旋转类，以便可以重复触发动画
            emailIcon.classList.remove('rotate-y');
            // 使用 setTimeout 确保动画可以重复触发
            setTimeout(() => {
                emailIcon.classList.add('rotate-y');
            }, 10);
        });
        
        // 监听动画结束，移除类以便下次可以再次触发
        emailIcon.addEventListener('animationend', function() {
            emailIcon.classList.remove('rotate-y');
        });
    }
});

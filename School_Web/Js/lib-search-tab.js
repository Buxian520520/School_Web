// 搜索框标签切换逻辑
(function() {
    // 获取所有tab元素和seg元素
    const tabs = document.querySelectorAll('.search-tabs .tab');
    const seg = document.querySelector('.search-bar .seg');
    const searchInput = document.querySelector('.search-input');
    
    // 定义每个tab对应的seg显示文本和占位符文本
    const tabConfig = {
        '资源统一检索': {
            segText: '全部',
            placeholder: '请输入你的检索内容'
        },
        'SPIS学术资源': {
            segText: 'SPIS',
            placeholder: '请输入你的搜索内容'
        },
        '馆藏查询': {
            segText: '任意词',
            placeholder: '请输入检索词进行检索'
        },
        'SCI': {
            segText: 'SCI',
            placeholder: '请输入你的搜索内容'
        },
        'EI': {
            segText: 'EI',
            placeholder: '请输入你的搜索内容'
        },
        '百度文库': {
            segText: '文库',
            placeholder: '请输入你的搜索内容'
        }
    };
    
    // 为每个tab添加点击事件
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabText = this.textContent.trim();
            const config = tabConfig[tabText];
            
            if (config) {
                // 更新seg显示的文本（保留下拉箭头）
                seg.textContent = config.segText + ' ▾';
                
                // 更新输入框占位符
                if (searchInput) {
                    searchInput.placeholder = config.placeholder;
                }
                
                // 移除所有tab的active类
                tabs.forEach(t => t.classList.remove('active'));
                
                // 为当前点击的tab添加active类
                this.classList.add('active');
            }
        });
    });
})();


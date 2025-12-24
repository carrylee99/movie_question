// 主应用逻辑
class GoutCareApp {
    constructor() {
        this.currentTab = 'home';
        this.currentRecordTab = 'uric';
        this.filteredFoods = [...foodDatabase];
        this.init();
    }

    // 初始化应用
    init() {
        this.bindEvents();
        this.loadUserStage();
        this.updateDailyIntake();
        this.loadRecords();
        this.initTools();
    }

    // 绑定事件
    bindEvents() {
        // 导航切换
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // 阶段选择
        document.querySelectorAll('.stage-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectStage(e.target.dataset.stage);
            });
        });

        // 记录标签切换
        document.querySelectorAll('.record-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchRecordTab(e.target.dataset.recordTab);
            });
        });

        // 食物过滤
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterFoods(e.target.dataset.filter);
            });
        });

        // 表单提交
        document.getElementById('uricForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addUricRecord();
        });

        document.getElementById('attackForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAttackRecord();
        });

        // 疼痛等级滑块
        document.getElementById('painLevel').addEventListener('input', (e) => {
            document.getElementById('painValue').textContent = e.target.value;
        });

        // 疼痛等级评估
        document.querySelectorAll('.pain-level').forEach(level => {
            level.addEventListener('click', (e) => {
                this.selectPainLevel(e.target.dataset.level);
            });
        });

        // 单位换算
        document.getElementById('umolInput').addEventListener('input', (e) => {
            this.convertUmolToMg(e.target.value);
        });

        document.getElementById('mgInput').addEventListener('input', (e) => {
            this.convertMgToUmol(e.target.value);
        });

        // 模态框
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // 搜索
        document.getElementById('foodSearch').addEventListener('input', (e) => {
            this.searchFood(e.target.value);
        });
    }

    // 切换标签页
    switchTab(tabName) {
        // 更新导航按钮状态
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // 显示对应内容
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;

        // 根据标签页加载相应内容
        if (tabName === 'food') {
            this.displayFoods();
        } else if (tabName === 'guide') {
            this.displayStageGuide();
        }
    }

    // 选择健康阶段
    selectStage(stage) {
        // 更新按钮状态
        document.querySelectorAll('.stage-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-stage="${stage}"]`).classList.add('selected');

        // 保存用户选择
        dataManager.setCurrentStage(stage);

        // 更新页面主题
        document.body.className = stage;

        // 显示阶段指导
        this.displayStageGuide();
    }

    // 加载用户阶段
    loadUserStage() {
        const stage = dataManager.getCurrentStage();
        if (stage) {
            document.body.className = stage;
            const stageBtn = document.querySelector(`[data-stage="${stage}"]`);
            if (stageBtn) {
                stageBtn.classList.add('selected');
            }
            this.displayStageGuide();
        }
    }

    // 显示阶段指导
    displayStageGuide() {
        const stage = dataManager.getCurrentStage();
        const guideContainer = document.getElementById('stageGuide');
        
        if (!stage) {
            guideContainer.innerHTML = '<p>请先在首页选择您的健康阶段</p>';
            return;
        }

        const guide = stageGuides[stage];
        let html = `
            <div class="stage-header" style="border-left: 4px solid ${guide.color}; padding-left: 1rem; margin-bottom: 2rem;">
                <h2 style="color: ${guide.color};">${guide.title}</h2>
            </div>
        `;

        guide.sections.forEach(section => {
            html += `
                <div class="guide-section">
                    <h3>${section.title}</h3>
                    <ul class="guide-list">
                        ${section.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        });

        guideContainer.innerHTML = html;
    }

    // 切换记录标签
    switchRecordTab(tabName) {
        // 更新标签按钮状态
        document.querySelectorAll('.record-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-record-tab="${tabName}"]`).classList.add('active');

        // 显示对应内容
        document.querySelectorAll('.record-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentRecordTab = tabName;

        // 加载对应记录
        if (tabName === 'uric') {
            this.displayUricRecords();
        } else if (tabName === 'attack') {
            this.displayAttackRecords();
        } else if (tabName === 'diet') {
            this.displayDietRecords();
        }
    }

    // 搜索食物
    searchFood(query = '') {
        const searchInput = document.getElementById('foodSearch');
        const searchQuery = query || searchInput.value.toLowerCase().trim();
        
        if (searchQuery === '') {
            this.filteredFoods = [...foodDatabase];
        } else {
            this.filteredFoods = foodDatabase.filter(food => 
                food.name.toLowerCase().includes(searchQuery) ||
                food.category.toLowerCase().includes(searchQuery) ||
                food.description.toLowerCase().includes(searchQuery)
            );
        }
        
        this.displayFoods();
    }

    // 过滤食物
    filterFoods(filter) {
        // 更新过滤按钮状态
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // 过滤食物
        if (filter === 'all') {
            this.filteredFoods = [...foodDatabase];
        } else {
            this.filteredFoods = foodDatabase.filter(food => food.level === filter);
        }

        this.displayFoods();
    }

    // 显示食物列表
    displayFoods() {
        const container = document.getElementById('foodResults');
        
        if (this.filteredFoods.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">未找到相关食物</p>';
            return;
        }

        const html = this.filteredFoods.map(food => `
            <div class="food-item">
                <div class="food-info">
                    <h4>${food.name}</h4>
                    <p>${food.description} | ${food.purine}mg/100g</p>
                    <span class="purine-level ${food.level}">
                        ${food.level === 'low' ? '低嘌呤' : 
                          food.level === 'medium' ? '中嘌呤' : '高嘌呤'}
                    </span>
                </div>
                <div class="food-actions">
                    <button onclick="app.addToDaily('${food.name}', ${food.purine})">
                        添加到今日
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    // 添加到今日摄入
    addToDaily(foodName, purine) {
        const amount = prompt('请输入食用量(克):', '100');
        if (amount && !isNaN(amount) && amount > 0) {
            const actualPurine = (purine * parseFloat(amount)) / 100;
            dataManager.updateDailyIntake(null, actualPurine, foodName);
            dataManager.addDietRecord({
                foodName: foodName,
                purine: actualPurine,
                amount: parseFloat(amount)
            });
            this.updateDailyIntake();
            alert(`已添加 ${foodName} ${amount}g 到今日饮食记录`);
        }
    }

    // 更新每日摄入量显示
    updateDailyIntake() {
        const today = dataManager.getDailyIntake();
        const purineElement = document.getElementById('dailyPurine');
        const progressElement = document.getElementById('intakeProgress');
        
        if (purineElement) {
            purineElement.textContent = Math.round(today.purine);
            
            // 更新进度条
            const percentage = Math.min((today.purine / 150) * 100, 100);
            progressElement.style.width = percentage + '%';
            
            // 根据摄入量改变颜色
            if (today.purine < 75) {
                progressElement.style.background = '#43e97b';
            } else if (today.purine < 150) {
                progressElement.style.background = '#fee140';
            } else {
                progressElement.style.background = '#ff6b6b';
            }
        }
    }

    // 添加尿酸记录
    addUricRecord() {
        const date = document.getElementById('uricDate').value;
        const value = document.getElementById('uricValue').value;

        if (!date || !value) {
            alert('请填写完整信息');
            return;
        }

        if (dataManager.addUricRecord({ date, value })) {
            alert('记录添加成功');
            document.getElementById('uricForm').reset();
            this.displayUricRecords();
        } else {
            alert('记录添加失败');
        }
    }

    // 显示尿酸记录
    displayUricRecords() {
        const records = dataManager.getUricRecords();
        const container = document.getElementById('uricRecords');

        if (records.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">暂无记录</p>';
            return;
        }

        const html = records.map(record => `
            <div class="record-item">
                <div class="record-info">
                    <h4>${record.date}</h4>
                    <p>尿酸值: ${record.value} μmol/L</p>
                </div>
                <button onclick="app.deleteUricRecord(${record.id})" style="background: #ff6b6b;">
                    删除
                </button>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    // 删除尿酸记录
    deleteUricRecord(id) {
        if (confirm('确定要删除这条记录吗？')) {
            if (dataManager.deleteUricRecord(id)) {
                this.displayUricRecords();
            }
        }
    }

    // 添加发作记录
    addAttackRecord() {
        const date = document.getElementById('attackDate').value;
        const location = document.getElementById('attackLocation').value;
        const painLevel = document.getElementById('painLevel').value;
        const trigger = document.getElementById('attackTrigger').value;

        if (!date || !location) {
            alert('请填写完整信息');
            return;
        }

        if (dataManager.addAttackRecord({ date, location, painLevel, trigger })) {
            alert('记录添加成功');
            document.getElementById('attackForm').reset();
            document.getElementById('painValue').textContent = '5';
            this.displayAttackRecords();
        } else {
            alert('记录添加失败');
        }
    }

    // 显示发作记录
    displayAttackRecords() {
        const records = dataManager.getAttackRecords();
        const container = document.getElementById('attackRecords');

        if (records.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">暂无记录</p>';
            return;
        }

        const html = records.map(record => `
            <div class="record-item">
                <div class="record-info">
                    <h4>${new Date(record.date).toLocaleString()}</h4>
                    <p>部位: ${record.location} | 疼痛等级: ${record.painLevel}/10</p>
                    ${record.trigger ? `<p>诱因: ${record.trigger}</p>` : ''}
                </div>
                <button onclick="app.deleteAttackRecord(${record.id})" style="background: #ff6b6b;">
                    删除
                </button>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    // 删除发作记录
    deleteAttackRecord(id) {
        if (confirm('确定要删除这条记录吗？')) {
            if (dataManager.deleteAttackRecord(id)) {
                this.displayAttackRecords();
            }
        }
    }

    // 显示饮食记录
    displayDietRecords() {
        const today = dataManager.getDailyIntake();
        const container = document.getElementById('todayDiet');

        if (today.foods.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">今日暂无饮食记录</p>';
            return;
        }

        const html = `
            <h4>今日已摄入嘌呤: ${Math.round(today.purine)}mg</h4>
            <div class="diet-list">
                ${today.foods.map((food, index) => `
                    <div class="diet-item" style="padding: 0.5rem; border-bottom: 1px solid #f0f0f0;">
                        <span>${food.name}</span>
                        <span>${Math.round(food.purine)}mg</span>
                    </div>
                `).join('')}
            </div>
            <button onclick="app.resetDailyIntake()" style="background: #ff6b6b; margin-top: 1rem;">
                清空今日记录
            </button>
        `;

        container.innerHTML = html;
    }

    // 重置今日摄入
    resetDailyIntake() {
        if (confirm('确定要清空今日饮食记录吗？')) {
            dataManager.resetDailyIntake();
            this.updateDailyIntake();
            this.displayDietRecords();
        }
    }

    // 加载所有记录
    loadRecords() {
        this.displayUricRecords();
        this.displayAttackRecords();
        this.displayDietRecords();
    }

    // 初始化工具
    initTools() {
        // 设置今天的日期为默认值
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('uricDate').value = today;
        
        const now = new Date().toISOString().slice(0, 16);
        document.getElementById('attackDate').value = now;
    }

    // 疼痛等级选择
    selectPainLevel(level) {
        // 更新选中状态
        document.querySelectorAll('.pain-level').forEach(el => {
            el.classList.remove('selected');
        });
        document.querySelector(`[data-level="${level}"]`).classList.add('selected');

        // 显示描述
        const description = painDescriptions[level];
        document.getElementById('painDescription').textContent = description;
    }

    // 单位换算
    convertUmolToMg(umolValue) {
        if (umolValue && !isNaN(umolValue)) {
            const mgValue = (parseFloat(umolValue) * conversionFactors.umolToMg).toFixed(2);
            document.getElementById('mgInput').value = mgValue;
        } else {
            document.getElementById('mgInput').value = '';
        }
    }

    convertMgToUmol(mgValue) {
        if (mgValue && !isNaN(mgValue)) {
            const umolValue = (parseFloat(mgValue) * conversionFactors.mgToUmol).toFixed(0);
            document.getElementById('umolInput').value = umolValue;
        } else {
            document.getElementById('umolInput').value = '';
        }
    }

    // 显示应急指导
    showEmergencyGuide() {
        document.getElementById('emergencyModal').style.display = 'block';
    }

    // 关闭模态框
    closeModal() {
        document.getElementById('emergencyModal').style.display = 'none';
    }
}

// 全局函数
function switchTab(tabName) {
    app.switchTab(tabName);
}

function showEmergencyGuide() {
    app.showEmergencyGuide();
}

// 初始化应用
const app = new GoutCareApp();

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function() {
    // 设置默认日期
    const today = new Date().toISOString().split('T')[0];
    const uricDateInput = document.getElementById('uricDate');
    if (uricDateInput && !uricDateInput.value) {
        uricDateInput.value = today;
    }
    
    const now = new Date().toISOString().slice(0, 16);
    const attackDateInput = document.getElementById('attackDate');
    if (attackDateInput && !attackDateInput.value) {
        attackDateInput.value = now;
    }
    
    // 显示初始食物列表
    app.displayFoods();
});
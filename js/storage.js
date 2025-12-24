// 本地存储管理
class LocalStorage {
    constructor() {
        this.prefix = 'goutcare_';
    }

    // 设置数据
    set(key, value) {
        try {
            const data = JSON.stringify(value);
            localStorage.setItem(this.prefix + key, data);
            return true;
        } catch (error) {
            console.error('存储数据失败:', error);
            return false;
        }
    }

    // 获取数据
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(this.prefix + key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('读取数据失败:', error);
            return defaultValue;
        }
    }

    // 删除数据
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('删除数据失败:', error);
            return false;
        }
    }

    // 清空所有数据
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('清空数据失败:', error);
            return false;
        }
    }

    // 获取所有键
    getAllKeys() {
        const keys = Object.keys(localStorage);
        return keys.filter(key => key.startsWith(this.prefix))
                  .map(key => key.replace(this.prefix, ''));
    }
}

// 数据管理类
class DataManager {
    constructor() {
        this.storage = new LocalStorage();
        this.initializeData();
    }

    // 初始化数据
    initializeData() {
        // 初始化用户设置
        if (!this.storage.get('userSettings')) {
            this.storage.set('userSettings', {
                currentStage: null,
                dailyPurineLimit: 150,
                theme: 'auto',
                notifications: true
            });
        }

        // 初始化记录数据
        if (!this.storage.get('uricRecords')) {
            this.storage.set('uricRecords', []);
        }

        if (!this.storage.get('attackRecords')) {
            this.storage.set('attackRecords', []);
        }

        if (!this.storage.get('dietRecords')) {
            this.storage.set('dietRecords', []);
        }

        if (!this.storage.get('dailyIntake')) {
            this.storage.set('dailyIntake', {});
        }
    }

    // 用户设置管理
    getUserSettings() {
        return this.storage.get('userSettings');
    }

    updateUserSettings(settings) {
        const current = this.getUserSettings();
        const updated = { ...current, ...settings };
        return this.storage.set('userSettings', updated);
    }

    setCurrentStage(stage) {
        return this.updateUserSettings({ currentStage: stage });
    }

    getCurrentStage() {
        return this.getUserSettings().currentStage;
    }

    // 尿酸记录管理
    getUricRecords() {
        return this.storage.get('uricRecords', []);
    }

    addUricRecord(record) {
        const records = this.getUricRecords();
        const newRecord = {
            id: Date.now(),
            date: record.date,
            value: parseFloat(record.value),
            timestamp: new Date().toISOString()
        };
        records.push(newRecord);
        records.sort((a, b) => new Date(b.date) - new Date(a.date));
        return this.storage.set('uricRecords', records);
    }

    deleteUricRecord(id) {
        const records = this.getUricRecords();
        const filtered = records.filter(record => record.id !== id);
        return this.storage.set('uricRecords', filtered);
    }

    // 发作记录管理
    getAttackRecords() {
        return this.storage.get('attackRecords', []);
    }

    addAttackRecord(record) {
        const records = this.getAttackRecords();
        const newRecord = {
            id: Date.now(),
            date: record.date,
            location: record.location,
            painLevel: parseInt(record.painLevel),
            trigger: record.trigger || '',
            timestamp: new Date().toISOString()
        };
        records.push(newRecord);
        records.sort((a, b) => new Date(b.date) - new Date(a.date));
        return this.storage.set('attackRecords', records);
    }

    deleteAttackRecord(id) {
        const records = this.getAttackRecords();
        const filtered = records.filter(record => record.id !== id);
        return this.storage.set('attackRecords', filtered);
    }

    // 饮食记录管理
    getDietRecords() {
        return this.storage.get('dietRecords', []);
    }

    addDietRecord(record) {
        const records = this.getDietRecords();
        const newRecord = {
            id: Date.now(),
            date: record.date || new Date().toISOString().split('T')[0],
            foodName: record.foodName,
            purine: parseFloat(record.purine),
            amount: parseFloat(record.amount || 100),
            timestamp: new Date().toISOString()
        };
        records.push(newRecord);
        return this.storage.set('dietRecords', records);
    }

    deleteDietRecord(id) {
        const records = this.getDietRecords();
        const filtered = records.filter(record => record.id !== id);
        return this.storage.set('dietRecords', filtered);
    }

    // 每日摄入量管理
    getDailyIntake(date = null) {
        const targetDate = date || new Date().toISOString().split('T')[0];
        const dailyData = this.storage.get('dailyIntake', {});
        return dailyData[targetDate] || { purine: 0, foods: [] };
    }

    updateDailyIntake(date, purine, foodName) {
        const dailyData = this.storage.get('dailyIntake', {});
        const targetDate = date || new Date().toISOString().split('T')[0];
        
        if (!dailyData[targetDate]) {
            dailyData[targetDate] = { purine: 0, foods: [] };
        }
        
        dailyData[targetDate].purine += purine;
        dailyData[targetDate].foods.push({
            name: foodName,
            purine: purine,
            timestamp: new Date().toISOString()
        });
        
        return this.storage.set('dailyIntake', dailyData);
    }

    resetDailyIntake(date = null) {
        const targetDate = date || new Date().toISOString().split('T')[0];
        const dailyData = this.storage.get('dailyIntake', {});
        dailyData[targetDate] = { purine: 0, foods: [] };
        return this.storage.set('dailyIntake', dailyData);
    }

    // 数据导出
    exportData() {
        const data = {
            userSettings: this.getUserSettings(),
            uricRecords: this.getUricRecords(),
            attackRecords: this.getAttackRecords(),
            dietRecords: this.getDietRecords(),
            dailyIntake: this.storage.get('dailyIntake', {}),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        return JSON.stringify(data, null, 2);
    }

    // 数据导入
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.userSettings) {
                this.storage.set('userSettings', data.userSettings);
            }
            if (data.uricRecords) {
                this.storage.set('uricRecords', data.uricRecords);
            }
            if (data.attackRecords) {
                this.storage.set('attackRecords', data.attackRecords);
            }
            if (data.dietRecords) {
                this.storage.set('dietRecords', data.dietRecords);
            }
            if (data.dailyIntake) {
                this.storage.set('dailyIntake', data.dailyIntake);
            }
            
            return true;
        } catch (error) {
            console.error('导入数据失败:', error);
            return false;
        }
    }

    // 获取统计数据
    getStatistics() {
        const uricRecords = this.getUricRecords();
        const attackRecords = this.getAttackRecords();
        const dietRecords = this.getDietRecords();
        
        return {
            totalUricRecords: uricRecords.length,
            totalAttackRecords: attackRecords.length,
            totalDietRecords: dietRecords.length,
            latestUricValue: uricRecords.length > 0 ? uricRecords[0].value : null,
            lastAttackDate: attackRecords.length > 0 ? attackRecords[0].date : null,
            averageUricValue: uricRecords.length > 0 ? 
                uricRecords.reduce((sum, record) => sum + record.value, 0) / uricRecords.length : null
        };
    }
}

// 创建全局数据管理实例
const dataManager = new DataManager();
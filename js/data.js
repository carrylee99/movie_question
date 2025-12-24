// 食物嘌呤数据库
const foodDatabase = [
    // 高嘌呤食物 (>150mg/100g)
    { name: "动物内脏", category: "肉类", purine: 300, level: "high", description: "肝、肾、心等" },
    { name: "沙丁鱼", category: "海鲜", purine: 295, level: "high", description: "罐装或新鲜" },
    { name: "凤尾鱼", category: "海鲜", purine: 280, level: "high", description: "小鱼干" },
    { name: "鲭鱼", category: "海鲜", purine: 250, level: "high", description: "青花鱼" },
    { name: "酵母", category: "其他", purine: 680, level: "high", description: "啤酒酵母" },
    { name: "肉汤", category: "汤类", purine: 200, level: "high", description: "浓缩肉汤" },
    { name: "啤酒", category: "饮品", purine: 15, level: "high", description: "含酒精饮品" },
    { name: "白酒", category: "饮品", purine: 0, level: "high", description: "高度酒精" },
    { name: "海带", category: "蔬菜", purine: 96, level: "high", description: "干海带" },
    { name: "紫菜", category: "蔬菜", purine: 274, level: "high", description: "干紫菜" },
    
    // 中嘌呤食物 (50-150mg/100g)
    { name: "猪肉", category: "肉类", purine: 122, level: "medium", description: "瘦肉" },
    { name: "牛肉", category: "肉类", purine: 83, level: "medium", description: "瘦牛肉" },
    { name: "羊肉", category: "肉类", purine: 111, level: "medium", description: "瘦羊肉" },
    { name: "鸡肉", category: "肉类", purine: 137, level: "medium", description: "去皮鸡肉" },
    { name: "鸭肉", category: "肉类", purine: 138, level: "medium", description: "去皮鸭肉" },
    { name: "鲤鱼", category: "海鲜", purine: 137, level: "medium", description: "淡水鱼" },
    { name: "鲈鱼", category: "海鲜", purine: 70, level: "medium", description: "海鲈鱼" },
    { name: "带鱼", category: "海鲜", purine: 135, level: "medium", description: "海鱼" },
    { name: "虾", category: "海鲜", purine: 62, level: "medium", description: "河虾海虾" },
    { name: "蟹", category: "海鲜", purine: 82, level: "medium", description: "螃蟹" },
    { name: "豆腐", category: "豆制品", purine: 68, level: "medium", description: "嫩豆腐" },
    { name: "豆浆", category: "豆制品", purine: 27, level: "medium", description: "新鲜豆浆" },
    { name: "绿豆", category: "豆类", purine: 75, level: "medium", description: "干绿豆" },
    { name: "红豆", category: "豆类", purine: 53, level: "medium", description: "干红豆" },
    { name: "花生", category: "坚果", purine: 79, level: "medium", description: "生花生" },
    { name: "芦笋", category: "蔬菜", purine: 23, level: "medium", description: "新鲜芦笋" },
    { name: "菠菜", category: "蔬菜", purine: 57, level: "medium", description: "新鲜菠菜" },
    { name: "蘑菇", category: "蔬菜", purine: 28, level: "medium", description: "鲜蘑菇" },
    { name: "香菇", category: "蔬菜", purine: 214, level: "medium", description: "干香菇" },
    { name: "燕麦", category: "谷物", purine: 94, level: "medium", description: "燕麦片" },
    
    // 低嘌呤食物 (<50mg/100g)
    { name: "大米", category: "谷物", purine: 18, level: "low", description: "白米饭" },
    { name: "面条", category: "谷物", purine: 17, level: "low", description: "小麦面条" },
    { name: "面包", category: "谷物", purine: 13, level: "low", description: "白面包" },
    { name: "土豆", category: "蔬菜", purine: 7, level: "low", description: "马铃薯" },
    { name: "红薯", category: "蔬菜", purine: 12, level: "low", description: "地瓜" },
    { name: "白菜", category: "蔬菜", purine: 5, level: "low", description: "大白菜" },
    { name: "萝卜", category: "蔬菜", purine: 6, level: "low", description: "白萝卜" },
    { name: "胡萝卜", category: "蔬菜", purine: 8, level: "low", description: "红萝卜" },
    { name: "冬瓜", category: "蔬菜", purine: 6, level: "low", description: "新鲜冬瓜" },
    { name: "黄瓜", category: "蔬菜", purine: 7, level: "low", description: "新鲜黄瓜" },
    { name: "西红柿", category: "蔬菜", purine: 11, level: "low", description: "番茄" },
    { name: "茄子", category: "蔬菜", purine: 13, level: "low", description: "新鲜茄子" },
    { name: "青椒", category: "蔬菜", purine: 15, level: "low", description: "甜椒" },
    { name: "洋葱", category: "蔬菜", purine: 13, level: "low", description: "圆葱" },
    { name: "苹果", category: "水果", purine: 1, level: "low", description: "新鲜苹果" },
    { name: "香蕉", category: "水果", purine: 11, level: "low", description: "新鲜香蕉" },
    { name: "橙子", category: "水果", purine: 2, level: "low", description: "新鲜橙子" },
    { name: "葡萄", category: "水果", purine: 8, level: "low", description: "新鲜葡萄" },
    { name: "西瓜", category: "水果", purine: 2, level: "low", description: "新鲜西瓜" },
    { name: "牛奶", category: "乳制品", purine: 1, level: "low", description: "纯牛奶" },
    { name: "酸奶", category: "乳制品", purine: 1, level: "low", description: "无糖酸奶" },
    { name: "鸡蛋", category: "蛋类", purine: 4, level: "low", description: "鸡蛋白" },
    { name: "蛋黄", category: "蛋类", purine: 2, level: "low", description: "鸡蛋黄" },
    { name: "白糖", category: "调料", purine: 0, level: "low", description: "蔗糖" },
    { name: "蜂蜜", category: "调料", purine: 1, level: "low", description: "天然蜂蜜" },
    { name: "植物油", category: "调料", purine: 0, level: "low", description: "食用油" },
    { name: "茶叶", category: "饮品", purine: 3, level: "low", description: "绿茶红茶" },
    { name: "咖啡", category: "饮品", purine: 0, level: "low", description: "纯咖啡" },
    { name: "矿泉水", category: "饮品", purine: 0, level: "low", description: "纯净水" }
];

// 阶段指导数据
const stageGuides = {
    prevention: {
        title: "预防期指导",
        color: "#4facfe",
        sections: [
            {
                title: "饮食建议",
                items: [
                    "每日嘌呤摄入量控制在150mg以下",
                    "多吃低嘌呤食物：蔬菜、水果、牛奶",
                    "适量摄入中嘌呤食物：瘦肉、鱼类",
                    "避免高嘌呤食物：内脏、海鲜、浓汤",
                    "限制酒精摄入，特别是啤酒"
                ]
            },
            {
                title: "生活习惯",
                items: [
                    "每日饮水2000-3000ml",
                    "保持适当运动，避免剧烈运动",
                    "控制体重，避免肥胖",
                    "规律作息，充足睡眠",
                    "避免过度疲劳和精神压力"
                ]
            },
            {
                title: "定期检查",
                items: [
                    "每3-6个月检查血尿酸水平",
                    "监测肾功能和血脂",
                    "定期体检，关注并发症",
                    "记录饮食和生活习惯"
                ]
            }
        ]
    },
    remission: {
        title: "缓解期指导",
        color: "#43e97b",
        sections: [
            {
                title: "饮食管理",
                items: [
                    "继续低嘌呤饮食，每日<150mg",
                    "增加碱性食物摄入：蔬菜、水果",
                    "适量优质蛋白：鸡蛋、牛奶、豆腐",
                    "避免高嘌呤食物和酒精",
                    "控制果糖摄入，少喝甜饮料"
                ]
            },
            {
                title: "药物治疗",
                items: [
                    "按医嘱服用降尿酸药物",
                    "定期监测药物副作用",
                    "不要随意停药或调整剂量",
                    "记录用药时间和效果"
                ]
            },
            {
                title: "运动锻炼",
                items: [
                    "选择低强度有氧运动",
                    "每周运动3-5次，每次30分钟",
                    "避免剧烈运动和关节损伤",
                    "运动后及时补充水分"
                ]
            }
        ]
    },
    initial: {
        title: "初期指导",
        color: "#fee140",
        sections: [
            {
                title: "症状识别",
                items: [
                    "关注关节疼痛和肿胀",
                    "注意夜间疼痛加重",
                    "观察皮肤发红和发热",
                    "记录疼痛部位和程度"
                ]
            },
            {
                title: "应对措施",
                items: [
                    "立即停止高嘌呤食物摄入",
                    "大量饮水，促进尿酸排泄",
                    "患肢制动，避免活动",
                    "可进行局部冷敷缓解疼痛",
                    "及时就医，不要拖延"
                ]
            },
            {
                title: "药物使用",
                items: [
                    "按医嘱使用止痛药物",
                    "可使用秋水仙碱缓解症状",
                    "避免使用阿司匹林",
                    "注意药物副作用"
                ]
            }
        ]
    },
    acute: {
        title: "急性发作期指导",
        color: "#ff6b6b",
        sections: [
            {
                title: "紧急处理",
                items: [
                    "立即停止所有活动，卧床休息",
                    "抬高患肢，减少血液循环",
                    "局部冷敷15-20分钟",
                    "避免按摩和热敷",
                    "立即就医或联系医生"
                ]
            },
            {
                title: "药物治疗",
                items: [
                    "按医嘱服用秋水仙碱",
                    "使用非甾体抗炎药止痛",
                    "严重时可使用糖皮质激素",
                    "不要使用降尿酸药物",
                    "注意药物剂量和副作用"
                ]
            },
            {
                title: "饮食禁忌",
                items: [
                    "完全禁止酒精类饮品",
                    "避免所有高嘌呤食物",
                    "暂停肉类和海鲜摄入",
                    "以清淡流质食物为主",
                    "大量饮水，每日3000ml以上"
                ]
            },
            {
                title: "注意事项",
                items: [
                    "密切观察症状变化",
                    "记录疼痛程度和持续时间",
                    "如症状加重立即就医",
                    "避免任何关节活动",
                    "保持心情平静，避免焦虑"
                ]
            }
        ]
    }
};

// 疼痛等级描述
const painDescriptions = {
    1: "无痛 - 完全没有疼痛感",
    2: "轻微 - 几乎感觉不到的疼痛",
    3: "轻度 - 轻微的不适感",
    4: "轻中度 - 可以忍受的疼痛",
    5: "中度 - 明显的疼痛，但可以正常活动",
    6: "中重度 - 疼痛影响日常活动",
    7: "重度 - 疼痛严重，难以集中注意力",
    8: "严重 - 疼痛剧烈，影响睡眠",
    9: "极重度 - 疼痛难以忍受",
    10: "最痛 - 无法想象的剧烈疼痛"
};

// 健康文章数据
const healthArticles = [
    {
        id: 1,
        title: "痛风的基本认识",
        category: "科普",
        content: "痛风是一种由于嘌呤代谢紊乱导致血尿酸增高的疾病...",
        readTime: "5分钟"
    },
    {
        id: 2,
        title: "痛风急性发作的处理",
        category: "护理",
        content: "当痛风急性发作时，正确的处理方法可以有效缓解症状...",
        readTime: "3分钟"
    },
    {
        id: 3,
        title: "痛风患者的饮食指南",
        category: "科普",
        content: "合理的饮食是痛风管理的重要组成部分...",
        readTime: "8分钟"
    },
    {
        id: 4,
        title: "降尿酸药物的使用",
        category: "用药",
        content: "降尿酸药物的正确使用对痛风治疗至关重要...",
        readTime: "6分钟"
    }
];

// 常用单位换算
const conversionFactors = {
    umolToMg: 0.0168, // μmol/L to mg/dl
    mgToUmol: 59.48   // mg/dl to μmol/L
};
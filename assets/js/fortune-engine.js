/**
 * 籤詩引擎
 */
const FortuneEngine = {
    systems: null,
    fortuneData: {},

    /**
     * 初始化 - 使用內嵌系統資料
     * 注意：本站為純前端純內嵌架構，不使用 fetch() 載入 JSON，
     * 以確保 file:/// 協定與靜態託管環境（如 GitHub Pages）皆能正確運作，
     * 並避免舊版 data/fortune/*.json 檔案覆蓋內嵌於 *-data.js 的最新資料。
     */
    async init() {
        this.systems = this.getEmbeddedSystems();
        return this.systems;
    },

    /**
     * 內嵌的系統資料（備案，當 fetch 失敗時使用）
     */
    getEmbeddedSystems() {
        return [
            {
                systemId: "guanyin_100",
                name: "觀音一百籤",
                shortName: "觀音籤",
                deity: "觀世音菩薩",
                total: 100,
                dataFile: "data/fortune/guanyin-100.json",
                canvasStyle: "gold_lotus_ink",
                categories: ["總論", "事業", "求財", "感情", "婚姻", "健康", "家宅", "考試", "官司", "出行", "失物", "人際", "修心建議"],
                sourceIds: ["chance_guanyin_100"],
                status: "complete"
            },
            {
                systemId: "guandi_100",
                name: "關聖帝君一百籤",
                shortName: "關帝籤",
                deity: "關聖帝君",
                total: 100,
                dataFile: "data/fortune/guandi-100.json",
                canvasStyle: "red_temple_stick",
                categories: ["總論", "事業", "求財", "感情", "婚姻", "健康", "官司", "出行", "失物"],
                sourceIds: ["wikisource_guandi"],
                status: "complete"
            },
            {
                systemId: "liu_shi_jia_zi_60",
                name: "六十甲子籤",
                shortName: "六十甲子",
                deity: "通用",
                total: 60,
                dataFile: "data/fortune/liu-shi-jia-zi-60.json",
                canvasStyle: "rice_paper_red",
                categories: ["總論", "事業", "求財", "感情", "婚姻", "健康", "家宅", "考試", "官司", "出行", "失物"],
                sourceIds: ["chance_60jiazi"],
                status: "complete"
            },
            {
                systemId: "jiangdong_100",
                name: "護國嘉濟江東王靈籤",
                shortName: "江東王籤",
                deity: "江東王",
                total: 100,
                dataFile: "data/fortune/jiangdong-100.json",
                canvasStyle: "gold_temple",
                categories: ["總論", "事業", "求財", "感情", "婚姻", "健康", "官司", "出行", "失物"],
                sourceIds: ["wikisource_jiangdong"],
                status: "complete"
            },
            {
                systemId: "sizhen_49",
                name: "四聖真君靈籤",
                shortName: "四聖籤",
                deity: "四聖真君",
                total: 49,
                dataFile: "data/fortune/sizhen-49.json",
                canvasStyle: "purple_divine",
                categories: ["總論", "事業", "求財", "感情", "婚姻", "健康", "官司", "出行", "失物"],
                sourceIds: ["wikisource_sizhen"],
                status: "complete"
            },
            {
                systemId: "futian_120",
                name: "扶天廣聖如意靈籤",
                shortName: "扶天籤",
                deity: "扶天廣聖",
                total: 120,
                dataFile: "data/fortune/futian-120.json",
                canvasStyle: "green_taoist",
                categories: ["總論", "事業", "求財", "感情", "婚姻", "健康", "官司", "出行", "失物"],
                sourceIds: ["wikisource_futian"],
                status: "complete"
            },
            {
                systemId: "zhusheng_99",
                name: "註生娘娘靈籤",
                shortName: "註生娘娘籤",
                deity: "註生娘娘",
                total: 30,
                dataFile: "data/fortune/zhusheng-99.json",
                canvasStyle: "pink_motherly",
                categories: ["總論", "求子", "生育", "感情", "婚姻", "健康", "家宅"],
                sourceIds: ["wikisource_zhusheng"],
                status: "complete"
            },
            {
                systemId: "baosheng_60",
                name: "保生大帝六十籤（大龍峒保安宮版）",
                shortName: "保生籤",
                deity: "保生大帝",
                total: 60,
                dataFile: "data/fortune/baosheng-60.json",
                canvasStyle: "beige_divine",
                categories: ["總論", "事業", "求財", "感情", "婚姻", "健康", "家宅", "考試", "官司", "出行", "失物"],
                sourceIds: ["ai_guide_baosheng"],
                status: "complete"
            },
            {
                systemId: "tianhou_100",
                name: "媽祖天后宮一百籤（澎湖天后宮版）",
                shortName: "天后宮籤",
                deity: "媽祖",
                total: 100,
                dataFile: "data/fortune/tianhou-100.json",
                canvasStyle: "teal_temple",
                categories: ["總論", "事業", "求財", "感情", "婚姻", "健康", "家宅", "考試", "官司", "出行", "失物"],
                sourceIds: ["ai_guide_tianhou"],
                status: "complete"
            },
            {
                systemId: "luzu_60",
                name: "台北指南宮呂祖靈籤六十首",
                shortName: "呂祖籤",
                deity: "呂洞賓",
                total: 60,
                dataFile: "data/fortune/luzu-60.json",
                canvasStyle: "indigo_immortal",
                categories: ["總論", "事業", "求財", "感情", "婚姻", "健康", "家宅", "考試", "官司", "出行", "失物"],
                sourceIds: ["ai_guide_luzu"],
                status: "complete"
            },
            {
                systemId: "xuantian_49",
                name: "玄天上帝感應靈籤四十九首",
                shortName: "玄天籤",
                deity: "玄天上帝",
                total: 49,
                dataFile: "data/fortune/xuantian-49.json",
                canvasStyle: "obsidian_xuan",
                categories: ["總論", "事業", "求財", "感情", "婚姻", "健康", "家宅", "考試", "出行", "失物", "人際", "修心建議"],
                sourceIds: ["ai_guide_xuantian"],
                status: "complete"
            }
        ];
    },

    /**
     * 取得所有系統
     */
    getSystems() {
        return this.systems || [];
    },

    /**
     * 載入指定系統的籤詩資料
     * 注意：直接使用內嵌資料，不透過 fetch() 載入外部 JSON，
     * 避免舊版 data/fortune/*.json 檔案在靜態託管環境下覆蓋內嵌資料。
     */
    async loadFortuneData(systemId) {
        if (this.fortuneData[systemId]) {
            return this.fortuneData[systemId];
        }

        const system = this.systems.find(s => s.systemId === systemId);
        if (!system) {
            throw new Error(`System not found: ${systemId}`);
        }

        const embeddedData = this.getEmbeddedFortuneData(systemId, system.total);
        this.fortuneData[systemId] = embeddedData;
        return embeddedData;
    },

    /**
     * 內嵌的籤詩資料（備案 - 從外部 JS 檔案載入）
     */
    getEmbeddedFortuneData(systemId, total) {
        // 觀音籤
        if (systemId === 'guanyin_100' && typeof GUANYIN_100_DATA !== 'undefined') {
            return { systemId, name: '觀音一百籤', items: GUANYIN_100_DATA };
        }

        // 六十甲子籤
        if (systemId === 'liu_shi_jia_zi_60' && typeof LIUSHIJIAZI_60_DATA !== 'undefined') {
            return { systemId, name: '六十甲子籤', items: LIUSHIJIAZI_60_DATA };
        }

        // 關聖帝君籤
        if (systemId === 'guandi_100' && typeof GUANDI_100_DATA !== 'undefined') {
            return { systemId, name: '關聖帝君一百籤', items: GUANDI_100_DATA };
        }

        // 護國嘉濟江東王靈籤
        if (systemId === 'jiangdong_100' && typeof JIANGDONG_100_DATA !== 'undefined') {
            return { systemId, name: '護國嘉濟江東王靈籤', items: JIANGDONG_100_DATA };
        }

        // 四聖真君靈籤
        if (systemId === 'sizhen_49' && typeof SIZHEN_100_DATA !== 'undefined') {
            return { systemId, name: '四聖真君靈籤', items: SIZHEN_100_DATA };
        }

        // 扶天廣聖如意靈籤
        if (systemId === 'futian_120' && typeof FUTIAN_120_DATA !== 'undefined') {
            return { systemId, name: '扶天廣聖如意靈籤', items: FUTIAN_120_DATA };
        }

        // 註生娘娘靈籤
        if (systemId === 'zhusheng_99' && typeof ZHUSHENG_99_DATA !== 'undefined') {
            return { systemId, name: '註生娘娘靈籤', items: ZHUSHENG_99_DATA };
        }

        // 保生大帝六十籤
        if (systemId === 'baosheng_60' && typeof BAOSHENG_60_DATA !== 'undefined') {
            return { systemId, name: '保生大帝六十籤（大龍峒保安宮版）', items: BAOSHENG_60_DATA };
        }

        // 媽祖天后宮一百籤
        if (systemId === 'tianhou_100' && typeof TIANHOU_100_DATA !== 'undefined') {
            return { systemId, name: '媽祖天后宮一百籤（澎湖天后宮版）', items: TIANHOU_100_DATA };
        }

        // 台北指南宮呂祖靈籤六十首
        if (systemId === 'luzu_60' && typeof LUZU_60_DATA !== 'undefined') {
            return { systemId, name: '台北指南宮呂祖靈籤六十首', items: LUZU_60_DATA };
        }

        // 玄天上帝感應靈籤四十九首
        if (systemId === 'xuantian_49' && typeof XUANTIAN_49_DATA !== 'undefined') {
            return { systemId, name: '玄天上帝感應靈籤四十九首', items: XUANTIAN_49_DATA };
        }

        // 其他系統用佔位符
        const items = [];
        for (let i = 1; i <= total; i++) {
            items.push(this.createPlaceholderFortune(i, total, systemId));
        }
        return { systemId, name: systemId, items };
    },

    /**
     * 建立佔位符籤詩
     */
    createPlaceholderFortune(i, total, systemId) {
        const levels = ["大吉", "上吉", "中吉", "小吉", "吉", "中平", "中平", "凶", "下下"];
        const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
        const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        
        return {
            no: i,
            displayNo: `第${i}籤`,
            stemBranch: `${stems[(i-1) % 10]}${branches[(i-1) % 12]}`,
            level: levels[(i - 1) % levels.length],
            title: `第${i}籤`,
            poem: ["此籤詩文尚未建檔", "請使用 HTTP 伺服器開啟", "以載入完整籤詩資料", "或聯繫管理員更新"],
            story: "此籤典故尚未建檔。",
            classicMeaning: "此籤詩意尚未建檔。請使用 HTTP 伺服器開啟以載入完整資料。",
            plainMeaning: `此籤(${systemId}第${i}首)白話解釋尚未建檔。觀音一百籤已有完整資料，其他系統請使用 HTTP 伺服器開啟。`,
            categoryReadings: {
                "總論": `此籤(${systemId}第${i}首)資料尚未建檔。觀音一百籤已有完整資料。`,
                "事業": "資料載入中...",
                "求財": "資料載入中...",
                "感情": "資料載入中...",
                "婚姻": "資料載入中...",
                "健康": "資料載入中...",
                "家宅": "資料載入中...",
                "考試": "資料載入中...",
                "官司": "資料載入中...",
                "出行": "資料載入中...",
                "失物": "資料載入中...",
                "人際": "資料載入中...",
                "修心建議": "資料載入中..."
            },
            actionAdvice: ["此系統資料尚未完整建檔，觀音一百籤已有完整資料"],
            warnings: ["占卜結果僅供參考，不代表絕對結果"],
            sourceIds: ["placeholder"],
            dataQuality: { poemChecked: false, meaningRewritten: false, traditionalChineseChecked: false }
        };
    },

    /**
     * 建立佔位符籤詩
     */
    createPlaceholderFortune(i, total) {
        const levels = ["大吉", "上吉", "中吉", "小吉", "吉", "中平", "中平", "凶", "下下"];
        const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
        const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        
        return {
            no: i,
            displayNo: `第${i}籤`,
            stemBranch: `${stems[(i-1) % 10]}${branches[(i-1) % 12]}`,
            level: levels[(i - 1) % levels.length],
            title: `第${i}籤`,
            poem: ["此籤詩文尚未建檔", "請使用 HTTP 伺服器開啟", "以載入完整籤詩資料", "或聯繫管理員更新"],
            story: "此籤典故尚未建檔。",
            classicMeaning: "此籤詩意尚未建檔。請使用 HTTP 伺服器開啟以載入完整資料。",
            plainMeaning: "此籤白話解釋尚未建檔。請使用本地 HTTP 伺服器（python -m http.server 8000）開啟本網站，即可載入完整的100首觀音籤詩資料。",
            categoryReadings: {
                "總論": "此籤資料尚未建檔。請使用 HTTP 伺服器開啟以載入完整資料。",
                "事業": "資料載入中...",
                "求財": "資料載入中...",
                "感情": "資料載入中...",
                "婚姻": "資料載入中...",
                "健康": "資料載入中...",
                "家宅": "資料載入中...",
                "考試": "資料載入中...",
                "官司": "資料載入中...",
                "出行": "資料載入中...",
                "失物": "資料載入中...",
                "人際": "資料載入中...",
                "修心建議": "資料載入中..."
            },
            actionAdvice: ["請使用 HTTP 伺服器開啟以載入完整資料"],
            warnings: ["占卜結果僅供參考，不代表絕對結果", "此籤資料尚未建檔，請使用 HTTP 伺服器開啟"],
            sourceIds: ["placeholder"],
            dataQuality: { poemChecked: false, meaningRewritten: false, traditionalChineseChecked: false }
        };
    },

    /**
     * 抽籤
     * @param {string} systemId - 籤詩系統 ID
     * @returns {Object} - 籤詩結果
     */
    async drawFortune(systemId) {
        const data = await this.loadFortuneData(systemId);
        const total = data.items.length;
        const index = RandomEngine.drawByThousandMode(total);
        return data.items[index];
    },

    /**
     * 取得系統資訊
     */
    getSystemInfo(systemId) {
        return this.systems.find(s => s.systemId === systemId);
    }
};

// 匯出
window.FortuneEngine = FortuneEngine;

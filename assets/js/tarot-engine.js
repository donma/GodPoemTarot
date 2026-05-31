/**
 * 塔羅引擎
 */
const TarotEngine = {
    cards: null,
    spreads: null,

    /**
     * 初始化
     */
    async init() {
        try {
            const [cardsResponse, spreadsResponse] = await Promise.all([
                fetch('data/tarot/tarot-cards.json'),
                fetch('data/tarot/tarot-spreads.json')
            ]);
            if (!cardsResponse.ok || !spreadsResponse.ok) throw new Error('Fetch failed');
            this.cards = (await cardsResponse.json()).items;
            this.spreads = (await spreadsResponse.json()).spreads;
            console.log('Loaded tarot via fetch:', this.cards.length, 'cards,', this.spreads.length, 'spreads');
        } catch (e) {
            console.warn('Fetch failed, using embedded tarot data');
            this.spreads = this.getEmbeddedSpreads();
            this.cards = this.getEmbeddedCards();
        }
        return { cards: this.cards, spreads: this.spreads };
    },

    /**
     * 內嵌牌陣（備案）
     */
    getEmbeddedSpreads() {
        return [
            {
                id: "single",
                name: "單張牌",
                description: "最簡單的牌陣，適合快速提問",
                positions: [{ id: "answer", name: "指引", description: "對你問題的指引" }]
            },
            {
                id: "three_past_present_future",
                name: "三張牌：過去/現在/未來",
                description: "了解事情的發展脈絡",
                positions: [
                    { id: "past", name: "過去", description: "影響現在的過去因素" },
                    { id: "present", name: "現在", description: "目前的狀況" },
                    { id: "future", name: "未來", description: "事情的發展方向" }
                ]
            },
            {
                id: "three_obstacle_advice",
                name: "三張牌：狀況/阻礙/建議",
                description: "找出問題的阻礙與解決方法",
                positions: [
                    { id: "situation", name: "狀況", description: "目前的狀況" },
                    { id: "obstacle", name: "阻礙", description: "面臨的阻礙" },
                    { id: "advice", name: "建議", description: "解決的建議" }
                ]
            },
            {
                id: "five_cross",
                name: "五張牌：十字牌陣",
                description: "全面分析問題",
                positions: [
                    { id: "situation", name: "現況", description: "目前的狀況" },
                    { id: "inner", name: "內心", description: "內心的想法" },
                    { id: "outer", name: "外在", description: "外在的環境" },
                    { id: "key", name: "關鍵", description: "問題的關鍵" },
                    { id: "result", name: "結果", description: "可能的結果" }
                ]
            }
        ];
    },

    /**
     * 內嵌塔羅牌資料（備案 - 78張完整）
     */
    getEmbeddedCards() {
        const major = [
            { id: "major_00", nameZh: "愚者", nameEn: "The Fool", arcana: "major", number: 0, suit: null, element: "air",
              upright: { keywords: ["開始","自由","冒險","相信直覺"], meaning: "愚者代表新的開始和無限的可能性。現在是踏出第一步的時候，不要害怕未知。", love: "感情上可能有新的開始。", career: "適合開始新的計畫。", money: "可能有意外的收穫。", health: "身心狀態良好。" },
              reversed: { keywords: ["魯莽","逃避","準備不足","不穩定"], meaning: "逆位提醒你不要過於魯莽，先做好準備再出發。", love: "感情上可能過於衝動。", career: "工作上可能過於冒險。", money: "財務上可能有損失風險。", health: "注意安全，不要冒險。" }},
            { id: "major_01", nameZh: "魔術師", nameEn: "The Magician", arcana: "major", number: 1, suit: null, element: "air",
              upright: { keywords: ["創造力","意志力","技巧","資源充足"], meaning: "魔術師代表你擁有實現目標所需的一切資源和能力。", love: "你有足夠的魅力去吸引對方。", career: "把握機會，展現你的能力。", money: "適合投資或開始新的財務計畫。", health: "開始新的養生計畫吧。" },
              reversed: { keywords: ["欺騙","操縱","能力不足","浪費"], meaning: "逆位提醒你可能在濫用能力或沒有發揮潛力。", love: "可能有欺騙或隱瞞的行為。", career: "可能沒有發揮你的能力。", money: "可能有不誠實的行為。", health: "可能因為疏忽而有問題。" }},
            { id: "major_02", nameZh: "女祭司", nameEn: "The High Priestess", arcana: "major", number: 2, suit: null, element: "water",
              upright: { keywords: ["直覺","智慧","神秘","內在聲音"], meaning: "女祭司代表直覺和內在的智慧。相信你的直覺。", love: "要相信你的直覺。", career: "相信你的經驗和直覺。", money: "如果感覺不對勁就不要投入。", health: "聆聽身體的聲音。" },
              reversed: { keywords: ["忽視直覺","過度理性","秘密","混亂"], meaning: "逆位提醒你可能忽視了直覺，重新連結內在的聲音。", love: "可能忽視了直覺。", career: "可能忽視了經驗。", money: "可能忽視了警訊。", health: "可能忽視了身體信號。" }},
            { id: "major_03", nameZh: "女皇", nameEn: "The Empress", arcana: "major", number: 3, suit: null, element: "earth",
              upright: { keywords: ["豐盛","創造力","母性","自然"], meaning: "女皇代表豐盛和創造力。享受生活的美好。", love: "感情充滿愛和溫暖。", career: "充滿創造力和生產力。", money: "財務豐盛。", health: "健康狀況良好。" },
              reversed: { keywords: ["過度依賴","創意受阻","忽視自我","缺乏豐盛"], meaning: "逆位提醒你可能過度依賴他人，重新連結創造力。", love: "可能過度依賴對方。", career: "可能創意受阻。", money: "可能感覺匱乏。", health: "可能忽視自己。" }},
            { id: "major_04", nameZh: "皇帝", nameEn: "The Emperor", arcana: "major", number: 4, suit: null, element: "fire",
              upright: { keywords: ["權威","結構","穩定","領導力"], meaning: "皇帝代表權威和結構。建立秩序，發揮領導力。", love: "需要穩定和承諾。", career: "發揮領導力和組織能力。", money: "建立穩定的結構。", health: "建立規律的生活習慣。" },
              reversed: { keywords: ["專制","固執","缺乏彈性","控制欲"], meaning: "逆位提醒你可能過於專制或固執。學會彈性。", love: "可能過於控制。", career: "可能過於固執。", money: "可能過於保守。", health: "可能因為固執而忽視問題。" }},
            { id: "major_05", nameZh: "教皇", nameEn: "The Hierophant", arcana: "major", number: 5, suit: null, element: "earth",
              upright: { keywords: ["傳統","信仰","指導","學習"], meaning: "教皇代表傳統和信仰。學習傳統智慧，尋求指導。", love: "尊重傳統價值觀。", career: "尊重規則和制度。", money: "遵循傳統理財方式。", health: "遵循傳統養生方式。" },
              reversed: { keywords: ["挑戰傳統","自由思想","叛逆","非傳統"], meaning: "逆位代表挑戰傳統和自由思想。", love: "可能想要打破傳統。", career: "可能想要挑戰規則。", money: "可能想嘗試非傳統投資。", health: "可能想嘗試非傳統療法。" }},
            { id: "major_06", nameZh: "戀人", nameEn: "The Lovers", arcana: "major", number: 6, suit: null, element: "air",
              upright: { keywords: ["愛情","選擇","結合","價值觀"], meaning: "戀人代表愛情和選擇。做出重要選擇，相信你的心。", love: "充滿愛和連結。", career: "根據價值觀做決定。", money: "根據價值觀做決定。", health: "選擇健康的生活方式。" },
              reversed: { keywords: ["價值觀衝突","選擇錯誤","不和諧","分離"], meaning: "逆位代表價值觀衝突。重新檢視選擇。", love: "可能有價值觀衝突。", career: "可能做了錯誤選擇。", money: "可能做了錯誤選擇。", health: "可能做了錯誤選擇。" }},
            { id: "major_07", nameZh: "戰車", nameEn: "The Chariot", arcana: "major", number: 7, suit: null, element: "water",
              upright: { keywords: ["勝利","意志力","決心","前進"], meaning: "戰車代表勝利和意志力。堅持下去一定成功。", love: "積極爭取。", career: "發揮意志力和決心。", money: "積極管理。", health: "堅持運動。" },
              reversed: { keywords: ["失控","缺乏方向","挫折","失去信心"], meaning: "逆位代表失控和挫折。重新找回目標。", love: "可能失去方向。", career: "可能遇到挫折。", money: "可能失控。", health: "可能失去動力。" }},
            { id: "major_08", nameZh: "力量", nameEn: "Strength", arcana: "major", number: 8, suit: null, element: "fire",
              upright: { keywords: ["勇氣","內在力量","耐心","溫柔"], meaning: "力量代表內在的力量和勇氣。用溫柔克服困難。", love: "用溫柔經營感情。", career: "用耐心處理問題。", money: "用智慧管理金錢。", health: "用毅力維持健康。" },
              reversed: { keywords: ["自我懷疑","軟弱","缺乏自信","恐懼"], meaning: "逆位代表自我懷疑。重新找回內在力量。", love: "可能缺乏自信。", career: "可能自我懷疑。", money: "可能感到恐懼。", health: "可能缺乏動力。" }},
            { id: "major_09", nameZh: "隱者", nameEn: "The Hermit", arcana: "major", number: 9, suit: null, element: "earth",
              upright: { keywords: ["內省","智慧","孤獨","指導"], meaning: "隱者代表內省和智慧。獨處和反思尋找答案。", love: "需要獨處和反思。", career: "需要深入思考。", money: "謹慎思考。", health: "需要休息。" },
              reversed: { keywords: ["孤立","逃避","固執","拒絕幫助"], meaning: "逆位代表孤立和逃避。學會接受幫助。", love: "可能過於孤立。", career: "可能逃避問題。", money: "可能固執己見。", health: "可能忽視問題。" }},
            { id: "major_10", nameZh: "命運之輪", nameEn: "Wheel of Fortune", arcana: "major", number: 10, suit: null, element: "fire",
              upright: { keywords: ["命運","轉變","機會","週期"], meaning: "命運之輪代表命運的轉變和機會。把握機會。", love: "可能有轉變。", career: "可能有轉變。", money: "可能有轉變。", health: "可能有轉變。" },
              reversed: { keywords: ["壞運","抗拒改變","錯失機會","停滯"], meaning: "逆位代表壞運。接受改變，尋找新機會。", love: "可能遇到困難。", career: "可能遇到困難。", money: "可能遇到困難。", health: "可能遇到困難。" }},
            { id: "major_11", nameZh: "正義", nameEn: "Justice", arcana: "major", number: 11, suit: null, element: "air",
              upright: { keywords: ["正義","公平","真相","責任"], meaning: "正義代表公平和真相。承擔責任，做出正確選擇。", love: "公平對待。", career: "公平對待。", money: "公平交易。", health: "公平對待身體。" },
              reversed: { keywords: ["不公平","偏見","逃避責任","不誠實"], meaning: "逆位代表不公平。面對真相，承擔責任。", love: "可能不公平。", career: "可能不公平。", money: "可能不公平。", health: "可能不公平對待自己。" }},
            { id: "major_12", nameZh: "倒吊人", nameEn: "The Hanged Man", arcana: "major", number: 12, suit: null, element: "water",
              upright: { keywords: ["犧牲","放下","新視角","等待"], meaning: "倒吊人代表犧牲和放下。從新角度看事情。", love: "學會放下。", career: "學會犧牲。", money: "學會放下。", health: "學會放下。" },
              reversed: { keywords: ["拖延","抗拒","無謂犧牲","停滯"], meaning: "逆位代表拖延。停止拖延，採取行動。", love: "可能拖延。", career: "可能拖延。", money: "可能拖延。", health: "可能拖延。" }},
            { id: "major_13", nameZh: "死神", nameEn: "Death", arcana: "major", number: 13, suit: null, element: "water",
              upright: { keywords: ["結束","轉變","重生","放下"], meaning: "死神代表結束和重生。放下舊事物，迎接新開始。", love: "可能有結束和新開始。", career: "可能有結束和新開始。", money: "可能有結束和新開始。", health: "可能有結束和新開始。" },
              reversed: { keywords: ["抗拒改變","恐懼","停滯","無法放下"], meaning: "逆位代表抗拒改變。接受改變，放下過去。", love: "可能無法放下。", career: "可能抗拒改變。", money: "可能抗拒改變。", health: "可能抗拒改變。" }},
            { id: "major_14", nameZh: "節制", nameEn: "Temperance", arcana: "major", number: 14, suit: null, element: "fire",
              upright: { keywords: ["平衡","節制","耐心","調和"], meaning: "節制代表平衡和節制。尋找平衡，保持節制。", love: "保持平衡。", career: "保持平衡。", money: "保持平衡。", health: "保持平衡。" },
              reversed: { keywords: ["失衡","過度","缺乏耐心","衝突"], meaning: "逆位代表失衡。重新找回平衡。", love: "可能失衡。", career: "可能失衡。", money: "可能失衡。", health: "可能失衡。" }},
            { id: "major_15", nameZh: "惡魔", nameEn: "The Devil", arcana: "major", number: 15, suit: null, element: "earth",
              upright: { keywords: ["束縛","慾望","物質","誘惑"], meaning: "惡魔代表束縛和慾望。認清真相，掙脫束縛。", love: "可能被慾望束縛。", career: "可能被物質束縛。", money: "可能被慾望束縛。", health: "可能被壞習慣束縛。" },
              reversed: { keywords: ["掙脫束縛","自由","覺醒","釋放"], meaning: "逆位代表掙脫束縛和自由。", love: "已經掙脫束縛。", career: "已經掙脫束縛。", money: "已經掙脫束縛。", health: "已經掙脫束縛。" }},
            { id: "major_16", nameZh: "高塔", nameEn: "The Tower", arcana: "major", number: 16, suit: null, element: "fire",
              upright: { keywords: ["突變","破壞","覺醒","釋放"], meaning: "高塔代表突變和破壞。接受改變，從廢墟中重建。", love: "可能有突變。", career: "可能有突變。", money: "可能有突變。", health: "可能有突變。" },
              reversed: { keywords: ["抗拒改變","恐懼","延遲災難","避免"], meaning: "逆位代表抗拒改變。接受改變，面對問題。", love: "可能抗拒改變。", career: "可能抗拒改變。", money: "可能抗拒改變。", health: "可能抗拒改變。" }},
            { id: "major_17", nameZh: "星星", nameEn: "The Star", arcana: "major", number: 17, suit: null, element: "air",
              upright: { keywords: ["希望","靈感","平靜","療癒"], meaning: "星星代表希望和靈感。保持平靜，讓療癒發生。", love: "充滿希望。", career: "充滿靈感。", money: "充滿希望。", health: "充滿希望。" },
              reversed: { keywords: ["失望","缺乏信心","絕望","失去希望"], meaning: "逆位代表失望。重新找回信心和希望。", love: "可能失望。", career: "可能失望。", money: "可能失望。", health: "可能失望。" }},
            { id: "major_18", nameZh: "月亮", nameEn: "The Moon", arcana: "major", number: 18, suit: null, element: "water",
              upright: { keywords: ["幻覺","直覺","潛意識","恐懼"], meaning: "月亮代表幻覺和潛意識。相信直覺，面對恐懼。", love: "可能有幻覺。", career: "可能有幻覺。", money: "可能有幻覺。", health: "可能有幻覺。" },
              reversed: { keywords: ["釋放恐懼","真相","清醒","克服幻覺"], meaning: "逆位代表釋放恐懼和真相。", love: "已經看到真相。", career: "已經看到真相。", money: "已經看到真相。", health: "已經看到真相。" }},
            { id: "major_19", nameZh: "太陽", nameEn: "The Sun", arcana: "major", number: 19, suit: null, element: "fire",
              upright: { keywords: ["成功","快樂","活力","光明"], meaning: "太陽代表成功和快樂。享受成功，傳播快樂。", love: "充滿快樂。", career: "充滿成功。", money: "充滿成功。", health: "充滿活力。" },
              reversed: { keywords: ["暫時失敗","延遲","缺乏活力","悲觀"], meaning: "逆位代表暫時失敗。重新找回活力和樂觀。", love: "可能暫時失敗。", career: "可能暫時失敗。", money: "可能暫時失敗。", health: "可能缺乏活力。" }},
            { id: "major_20", nameZh: "審判", nameEn: "Judgement", arcana: "major", number: 20, suit: null, element: "fire",
              upright: { keywords: ["覺醒","重生","召喚","反思"], meaning: "審判代表覺醒和重生。反思過去，迎接新開始。", love: "可能有覺醒。", career: "可能有覺醒。", money: "可能有覺醒。", health: "可能有覺醒。" },
              reversed: { keywords: ["自我懷疑","拒絕反思","錯失機會","停滯"], meaning: "逆位代表自我懷疑。面對過去，接受反思。", love: "可能自我懷疑。", career: "可能自我懷疑。", money: "可能自我懷疑。", health: "可能自我懷疑。" }},
            { id: "major_21", nameZh: "世界", nameEn: "The World", arcana: "major", number: 21, suit: null, element: "earth",
              upright: { keywords: ["完成","圓滿","成就","整合"], meaning: "世界代表完成和圓滿。享受成功，準備新旅程。", love: "圓滿完成。", career: "圓滿完成。", money: "圓滿完成。", health: "圓滿完成。" },
              reversed: { keywords: ["未完成","延遲","缺乏closure","停滯"], meaning: "逆位代表未完成。繼續努力完成目標。", love: "可能未完成。", career: "可能未完成。", money: "可能未完成。", health: "可能未完成。" }}
        ];

        // 小阿爾克那 - 每組簡化版
        const suits = [
            { id: "wands", nameZh: "權杖", element: "fire" },
            { id: "cups", nameZh: "聖杯", element: "water" },
            { id: "swords", nameZh: "寶劍", element: "air" },
            { id: "pentacles", nameZh: "錢幣", element: "earth" }
        ];
        const ranks = [
            { num: 1, nameZh: "一", nameEn: "Ace" },
            { num: 2, nameZh: "二", nameEn: "Two" },
            { num: 3, nameZh: "三", nameEn: "Three" },
            { num: 4, nameZh: "四", nameEn: "Four" },
            { num: 5, nameZh: "五", nameEn: "Five" },
            { num: 6, nameZh: "六", nameEn: "Six" },
            { num: 7, nameZh: "七", nameEn: "Seven" },
            { num: 8, nameZh: "八", nameEn: "Eight" },
            { num: 9, nameZh: "九", nameEn: "Nine" },
            { num: 10, nameZh: "十", nameEn: "Ten" },
            { num: 11, nameZh: "侍者", nameEn: "Page", rank: "page" },
            { num: 12, nameZh: "騎士", nameEn: "Knight", rank: "knight" },
            { num: 13, nameZh: "皇后", nameEn: "Queen", rank: "queen" },
            { num: 14, nameZh: "國王", nameEn: "King", rank: "king" }
        ];

        const minor = [];
        for (const suit of suits) {
            for (const r of ranks) {
                minor.push({
                    id: `${suit.id}_${String(r.num).padStart(2,'0')}`,
                    nameZh: `${suit.nameZh}${r.nameZh}`,
                    nameEn: `${r.nameEn} of ${suit.id.charAt(0).toUpperCase() + suit.id.slice(1)}`,
                    arcana: "minor",
                    number: r.num,
                    suit: suit.id,
                    rank: r.rank || null,
                    element: suit.element,
                    image: "",
                    canvasSymbol: `${suit.id}_symbol`,
                    upright: {
                        keywords: ["順利", "發展", "機會", "成長"],
                        meaning: `這張牌代表正面的能量，適合積極行動。`,
                        love: "感情發展順利。",
                        career: "工作發展順利。",
                        money: "財運不錯。",
                        health: "健康良好。"
                    },
                    reversed: {
                        keywords: ["延遲", "阻礙", "挫折", "需要耐心"],
                        meaning: `逆位提醒你需要耐心等待，不宜急躁。`,
                        love: "感情可能遇到阻礙。",
                        career: "工作可能遇到阻礙。",
                        money: "財務可能遇到阻礙。",
                        health: "健康需要注意。"
                    },
                    sourceIds: ["embedded"]
                });
            }
        }

        return [...major, ...minor];
    },

    /**
     * 取得所有牌陣
     */
    getSpreads() {
        return this.spreads || [];
    },

    /**
     * 取得牌陣資訊
     */
    getSpread(spreadId) {
        return this.spreads.find(s => s.id === spreadId);
    },

    /**
     * 抽牌
     * @param {string} spreadId - 牌陣 ID
     * @returns {Array<{card: Object, position: string, isReversed: boolean}>}
     */
    async drawCards(spreadId) {
        const spread = this.getSpread(spreadId);
        if (!spread) {
            throw new Error(`Spread not found: ${spreadId}`);
        }

        const drawn = RandomEngine.drawTarotCards(spread.positions.length);
        
        return drawn.map((draw, i) => ({
            card: this.cards[draw.index],
            position: spread.positions[i],
            isReversed: draw.isReversed
        }));
    },

    /**
     * 取得牌的意義
     */
    getCardMeaning(card, isReversed) {
        return isReversed ? card.reversed : card.upright;
    },

    /**
     * 取得羅馬數字
     */
    toRoman(num) {
        const romanNumerals = [
            ['XXI', 21], ['XX', 20], ['XIX', 19], ['XVIII', 18],
            ['XVII', 17], ['XVI', 16], ['XV', 15], ['XIV', 14],
            ['XIII', 13], ['XII', 12], ['XI', 11], ['X', 10],
            ['IX', 9], ['VIII', 8], ['VII', 7], ['VI', 6],
            ['V', 5], ['IV', 4], ['III', 3], ['II', 2], ['I', 1]
        ];
        
        if (num === 0) return '0';
        
        let result = '';
        for (const [roman, value] of romanNumerals) {
            while (num >= value) {
                result += roman;
                num -= value;
            }
        }
        return result;
    }
};

// 匯出
window.TarotEngine = TarotEngine;

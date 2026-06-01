/**
 * UI 渲染引擎
 */
const UIRenderer = {
    isThrowing: false,
    
    /**
     * 初始化 UI
     */
    init() {
        console.log('UIRenderer.init() called');
        this.bindEvents();
        this.updateUI();
        
        // 延遲再次更新選單，確保引擎已載入
        setTimeout(() => {
            console.log('Delayed update of selects...');
            this.updateFortuneSystemSelect();
            this.updateTarotSpreadSelect();
        }, 500);
        
        console.log('UIRenderer initialized');
    },

    /**
     * 綁定事件
     */
    bindEvents() {
        // 擲筊按鈕
        const btnThrow = document.getElementById('btn-throw-cup');
        if (btnThrow) {
            btnThrow.addEventListener('click', () => this.handleThrowCup());
            console.log('Bound cup throw button');
        }
        
        // 求籤按鈕
        const btnFortune = document.getElementById('btn-draw-fortune');
        if (btnFortune) {
            btnFortune.addEventListener('click', () => this.handleDrawFortune());
            console.log('Bound fortune button');
        }
        
        // 塔羅抽牌按鈕
        const btnTarot = document.getElementById('btn-draw-tarot');
        if (btnTarot) {
            btnTarot.addEventListener('click', () => this.handleDrawTarot());
            console.log('Bound tarot button');
        }
        
        // 重新淨心按鈕
        const btnReset = document.getElementById('btn-reset');
        if (btnReset) {
            btnReset.addEventListener('click', () => this.handleReset());
            console.log('Bound reset button');
        }
    },

    /**
     * 更新 UI 狀態
     */
    updateUI() {
        const state = State.load();
        console.log('Current state:', state);
        
        // 更新解鎖狀態
        const lockedSection = document.getElementById('locked-section');
        const unlockedSection = document.getElementById('unlocked-section');
        
        if (state.isUnlocked) {
            lockedSection?.classList.add('hidden');
            unlockedSection?.classList.remove('hidden');
            console.log('App is unlocked');
        } else {
            lockedSection?.classList.remove('hidden');
            unlockedSection?.classList.add('hidden');
            console.log('App is locked');
        }
        
        // 更新進度條
        this.updateProgressBar(state.successiveHolyCount);
        
        // 更新籤詩系統選單
        this.updateFortuneSystemSelect();
        
        // 更新塔羅牌陣選單
        this.updateTarotSpreadSelect();
    },

    /**
     * 更新進度條
     */
    updateProgressBar(count) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${(count / 3) * 100}%`;
        }
        if (progressText) {
            progressText.textContent = `${count}/3 聖筊`;
        }
    },

    /**
     * 更新籤詩系統選單
     */
    updateFortuneSystemSelect() {
        const select = document.getElementById('fortune-system');
        if (!select) {
            console.warn('fortune-system select not found');
            return;
        }
        
        const systems = FortuneEngine.getSystems();
        console.log('Updating fortune select, systems count:', systems?.length);
        
        if (!systems || systems.length === 0) {
            console.warn('No fortune systems available');
            select.innerHTML = '<option value="">載入中...</option>';
            return;
        }
        
        select.innerHTML = systems.map(s => 
            `<option value="${s.systemId}">${s.name} (${s.total}張)</option>`
        ).join('');
        
        console.log('Fortune select updated with', systems.length, 'options');
    },

    /**
     * 更新塔羅牌陣選單
     */
    updateTarotSpreadSelect() {
        const select = document.getElementById('tarot-spread');
        if (!select) {
            console.warn('tarot-spread select not found');
            return;
        }
        
        const spreads = TarotEngine.getSpreads();
        console.log('Updating tarot select, spreads count:', spreads?.length);
        
        if (!spreads || spreads.length === 0) {
            console.warn('No tarot spreads available');
            select.innerHTML = '<option value="">載入中...</option>';
            return;
        }
        
        select.innerHTML = spreads.map(s => 
            `<option value="${s.id}">${s.name} (${s.positions.length}張)</option>`
        ).join('');
        
        console.log('Tarot select updated with', spreads.length, 'options');
    },

    /**
     * 處理擲筊
     */
    async handleThrowCup() {
        if (this.isThrowing) return;
        this.isThrowing = true;
        
        const btn = document.getElementById('btn-throw-cup');
        const resultDiv = document.getElementById('cup-result');
        const leftWrapper = document.getElementById('cup-left-wrapper');
        const rightWrapper = document.getElementById('cup-right-wrapper');
        
        if (!btn || !resultDiv || !leftWrapper || !rightWrapper) {
            console.error('Missing cup elements');
            this.isThrowing = false;
            return;
        }
        
        // 禁用按鈕
        btn.disabled = true;
        btn.textContent = '擲筊中...';
        resultDiv.innerHTML = '';
        
        // 移除之前的翻轉狀態
        leftWrapper.classList.remove('flipped');
        rightWrapper.classList.remove('flipped');
        
        // 拋出動畫
        leftWrapper.classList.add('throwing');
        rightWrapper.classList.add('throwing');
        
        // 等待拋出動畫
        await new Promise(resolve => setTimeout(resolve, 900));
        
        // 移除拋出動畫
        leftWrapper.classList.remove('throwing');
        rightWrapper.classList.remove('throwing');
        
        // 等一下再翻轉
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // 擲筊結果 (0 = 陽/平面, 1 = 陰/凸面)
        const leftResult = RandomEngine.getCryptoInt() % 2;
        const rightResult = RandomEngine.getCryptoInt() % 2;
        
        console.log('Cup results:', { left: leftResult, right: rightResult });
        
        // 翻轉顯示結果
        if (leftResult === 1) {
            leftWrapper.classList.add('flipped');
        }
        if (rightResult === 1) {
            rightWrapper.classList.add('flipped');
        }
        
        // 等待翻轉動畫
        await new Promise(resolve => setTimeout(resolve, 1300));
        
        // 判定結果
        // 0 = 陽面（平面）, 1 = 蓋面（凸面）
        let result;
        let resultName;
        let resultClass;
        let resultEmoji;
        
        if (leftResult !== rightResult) {
            // 一陽一蓋 = 聖筊
            result = 'holy';
            resultName = '聖筊';
            resultClass = 'result-holy';
            resultEmoji = '✨';
        } else if (leftResult === 0 && rightResult === 0) {
            // 兩蓋 = 笑筊
            result = 'laugh';
            resultName = '笑筊';
            resultClass = 'result-laugh';
            resultEmoji = '😄';
        } else {
            // 兩陽 = 蓋筊
            result = 'yin';
            resultName = '蓋筊';
            resultClass = 'result-yin';
            resultEmoji = '😔';
        }
        
        // 更新狀態
        const state = State.handleCupResult(result);
        console.log('State after cup:', state);
        
        // 顯示結果
        let resultHTML = `<div class="cup-result-content ${resultClass}">`;
        resultHTML += `<h3>${resultEmoji} ${resultName} ${resultEmoji}</h3>`;
        resultHTML += `<p style="font-size:1.1rem;">左：${leftResult === 0 ? '陽 ☀️' : '蓋 🌙'}　右：${rightResult === 0 ? '陽 ☀️' : '蓋 🌙'}</p>`;
        resultHTML += `<p style="font-size:1.2rem; margin-top:10px;">連續聖筊：<strong>${state.successiveHolyCount}</strong> / 3</p>`;
        
        if (state.isUnlocked) {
            resultHTML += `<div class="unlock-message">✨ 已解鎖！可以開始求籤與塔羅占卜 ✨</div>`;
        } else if (result === 'holy') {
            resultHTML += `<p style="margin-top: 10px; color: #c79a3b;">繼續擲筊，還需 ${3 - state.successiveHolyCount} 次聖筊</p>`;
        } else {
            resultHTML += `<p style="margin-top: 10px; color: #999;">連續中斷，請重新開始</p>`;
        }
        
        resultHTML += '</div>';
        resultDiv.innerHTML = resultHTML;
        
        // 更新 UI
        this.updateUI();
        
        // 啟用按鈕
        btn.disabled = false;
        btn.textContent = '擲筊';
        this.isThrowing = false;
    },

    /**
     * 處理求籤
     */
    async handleDrawFortune() {
        const systemId = document.getElementById('fortune-system')?.value;
        const category = document.getElementById('fortune-category')?.value;
        const question = document.getElementById('fortune-question')?.value;
        
        console.log('Drawing fortune:', { systemId, category, question });
        
        if (!systemId) {
            alert('請選擇籤詩系統');
            return;
        }
        
        const btn = document.getElementById('btn-draw-fortune');
        if (btn) {
            btn.disabled = true;
            btn.textContent = '求籤中...';
        }
        
        try {
            // 抽籤
            const fortune = await FortuneEngine.drawFortune(systemId);
            const system = FortuneEngine.getSystemInfo(systemId);
            
            console.log('Fortune drawn:', fortune);
            console.log('System info:', system);
            
            if (!fortune) {
                throw new Error('無法抽取籤詩');
            }
            
            // 顯示結果
            this.showFortuneResult(fortune, system, category, question);
            
            // 繪製 Canvas
            const canvas = document.getElementById('fortune-canvas');
            if (canvas && system) {
                // 計算所需高度
                const requiredHeight = this.calculateFortuneCanvasHeight(fortune, canvas.width);
                canvas.height = requiredHeight;
                FortuneCanvas.draw(canvas, fortune, system, system.canvasStyle);
            }
            
        } catch (e) {
            console.error('Failed to draw fortune:', e);
            alert('求籤失敗：' + e.message);
        }
        
        if (btn) {
            btn.disabled = false;
            btn.textContent = '求籤';
        }
    },

    /**
     * 顯示籤詩結果
     */
    showFortuneResult(fortune, system, category, question) {
        const resultDiv = document.getElementById('fortune-result');
        if (!resultDiv) return;
        
        const cr = fortune.categoryReadings || {};
        const levelClass = this.getLevelClass(fortune.level);
        
        // 聖意內容
        const shengYi = cr['聖意'] || '';
        
        // 其他分類（排除聖意）
        const otherCategories = Object.entries(cr).filter(([cat]) => cat !== '聖意');
        
        resultDiv.innerHTML = `
            <div class="fortune-result-card">
                <div class="fortune-result-header">
                    <span class="fortune-result-system">${system.name}</span>
                    <span class="fortune-result-no">${fortune.displayNo}</span>
                    <span class="fortune-result-level ${levelClass}">${fortune.level}</span>
                </div>
                
                <div class="fortune-result-poem">
                    ${fortune.poem.map(line => `<p>${line}</p>`).join('')}
                </div>
                
                ${fortune.story ? `
                <div class="fortune-result-section">
                    <div class="fortune-result-title">📜 故事典故</div>
                    <div class="fortune-result-text">${fortune.story}</div>
                </div>
                ` : ''}
                
                <div class="fortune-result-section">
                    <div class="fortune-result-title">💬 白話解釋</div>
                    <div class="fortune-result-text">${fortune.plainMeaning || fortune.classicMeaning || '暫無解釋'}</div>
                </div>
                
                ${shengYi ? `
                <div class="fortune-result-section">
                    <div class="fortune-result-title">🎋 聖意</div>
                    <div class="fortune-result-text fortune-result-shengyi">${shengYi}</div>
                </div>
                ` : ''}
                
                ${otherCategories.length > 0 ? `
                <div class="fortune-result-section">
                    <div class="fortune-result-title">📊 各項運勢</div>
                    <div class="fortune-result-categories">
                        ${otherCategories.map(([cat, text]) => `
                            <div class="fortune-cat-item ${cat === category ? 'active' : ''}">
                                <span class="fortune-cat-name">【${cat}】</span>
                                <span class="fortune-cat-text">${text}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${(fortune.actionAdvice || []).length > 0 ? `
                <div class="fortune-result-section fortune-result-advice">
                    <div class="fortune-result-title">✨ 行動建議</div>
                    <ul>
                        ${fortune.actionAdvice.map(a => `<li>${a}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div class="fortune-result-footer">
                    <div class="fortune-result-note">占卜結果僅供參考，不代表絕對結果</div>
                    <button onclick="UIRenderer.handleDownloadFortune()" class="btn btn-download-fortune">下載籤詩 PNG</button>
                </div>
            </div>
        `;
    },
    
    getLevelClass(level) {
        if (['上上','上吉','上籤','大吉'].includes(level)) return 'level-good';
        if (['中平','中吉','中籤'].includes(level)) return 'level-mid';
        return 'level-bad';
    },

    /**
     * 處理塔羅抽牌
     */
    async handleDrawTarot() {
        const spreadId = document.getElementById('tarot-spread')?.value;
        const question = document.getElementById('tarot-question')?.value;
        
        console.log('Drawing tarot:', { spreadId, question });
        
        if (!spreadId) {
            alert('請選擇牌陣');
            return;
        }
        
        const btn = document.getElementById('btn-draw-tarot');
        if (btn) {
            btn.disabled = true;
            btn.textContent = '抽牌中...';
        }
        
        try {
            // 洗牌動畫
            const container = document.getElementById('tarot-canvas-container');
            if (container) {
                container.innerHTML = '<div class="shuffle-animation">🔮 洗牌中...</div>';
            }
            
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // 抽牌
            const results = await TarotEngine.drawCards(spreadId);
            console.log('Tarot results:', results);
            
            if (!results || results.length === 0) {
                throw new Error('無法抽取塔羅牌');
            }
            
            // 顯示結果
            this.showTarotResult(results, question);
            
            // 繪製每張牌
            results.forEach((result, index) => {
                const canvas = document.getElementById(`tarot-canvas-${index}`);
                if (canvas && result.card) {
                    TarotCanvas.draw(canvas, result.card, result.isReversed);
                }
            });
            
        } catch (e) {
            console.error('Failed to draw tarot:', e);
            alert('抽牌失敗：' + e.message);
        }
        
        if (btn) {
            btn.disabled = false;
            btn.textContent = '抽牌';
        }
    },

    /**
     * 顯示塔羅結果
     */
    showTarotResult(results, question) {
        const containerDiv = document.getElementById('tarot-canvas-container');
        const resultDiv = document.getElementById('tarot-result');
        
        if (!containerDiv || !resultDiv) return;
        
        // 繪製 Canvas 區域
        containerDiv.innerHTML = results.map((result, index) => `
            <div class="tarot-card-item">
                <div class="tarot-position">${result.position.name}</div>
                <canvas id="tarot-canvas-${index}" width="280" height="420" class="tarot-canvas"></canvas>
                <div class="tarot-card-name">${result.card.nameZh} ${result.isReversed ? '(逆位)' : '(正位)'}</div>
            </div>
        `).join('');
        
        // 顯示解讀
        resultDiv.innerHTML = `
            <div class="tarot-result-content">
                <h2>塔羅占卜結果</h2>
                ${question ? `<p class="tarot-question">問題：${question}</p>` : ''}
                
                ${results.map(result => {
                    const cardMeaning = TarotEngine.getCardMeaning(result.card, result.isReversed);
                    return `
                        <div class="tarot-card-reading">
                            <h3>${result.position.name}：${result.card.nameZh} ${result.isReversed ? '(逆位)' : '(正位)'}</h3>
                            <p class="tarot-keywords">關鍵字：${cardMeaning.keywords.join('、')}</p>
                            <p>${cardMeaning.meaning}</p>
                            
                            <div class="tarot-details">
                                <div><strong>感情：</strong>${cardMeaning.love}</div>
                                <div><strong>事業：</strong>${cardMeaning.career}</div>
                                <div><strong>財務：</strong>${cardMeaning.money}</div>
                                <div><strong>健康：</strong>${cardMeaning.health}</div>
                            </div>
                        </div>
                    `;
                }).join('<hr>')}
                
                <button onclick="UIRenderer.handleDownloadTarot()" class="btn-download">下載塔羅 PNG</button>
            </div>
        `;
    },

    /**
     * 處理重新淨心
     */
    handleReset() {
        if (confirm('確定要重新淨心嗎？這會清除所有進度。')) {
            State.reset();
            
            // 重置筊杯顯示
            const leftWrapper = document.getElementById('cup-left-wrapper');
            const rightWrapper = document.getElementById('cup-right-wrapper');
            if (leftWrapper) leftWrapper.classList.remove('flipped');
            if (rightWrapper) rightWrapper.classList.remove('flipped');
            
            const resultDiv = document.getElementById('cup-result');
            if (resultDiv) resultDiv.innerHTML = '';
            
            this.updateUI();
        }
    },

    /**
     * 計算籤詩 Canvas 所需高度
     */
    calculateFortuneCanvasHeight(fortune, width) {
        const scale = width / 800;
        let height = 40; // 頂部間距
        
        // 系統名稱
        height += 35 * scale;
        height += 25; // 分隔線
        
        // 籤號 + 吉凶
        height += 40 * scale;
        height += 30; // 裝飾線
        
        // 標題
        height += 35 * scale;
        
        // 籤詩 (每行38px, 假設最多4行，每行可能換行)
        const poemLines = fortune.poem || [];
        poemLines.forEach(line => {
            // 估算是否需要換行 (每行約10個字)
            const wrappedLines = Math.ceil(line.length / 10);
            height += 38 * scale * wrappedLines;
        });
        height += 15 * scale;
        height += 25; // 分隔線
        
        // 白話解釋 (假設6行)
        height += 28 * scale; // 標題
        height += 24 * scale * 6; // 內容
        height += 15 * scale;
        
        // 聖意 (假設4行)
        height += 28 * scale; // 標題
        height += 22 * scale * 4; // 內容
        height += 10 * scale;
        
        // 底部
        height += 20; // 分隔線
        height += 30; // 標註
        height += 20; // 底部間距
        
        return Math.max(600, height);
    },

    /**
     * 處理下載籤詩
     */
    handleDownloadFortune() {
        const canvas = document.getElementById('fortune-canvas');
        if (canvas) {
            FortuneCanvas.downloadPNG(canvas, 'fortune.png');
        }
    },

    /**
     * 處理下載塔羅
     */
    handleDownloadTarot() {
        const canvas = document.getElementById('tarot-canvas-0');
        if (canvas) {
            TarotCanvas.downloadPNG(canvas, 'tarot.png');
        }
    }
};

// 匯出
window.UIRenderer = UIRenderer;

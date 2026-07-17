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
                await FortuneCanvas.draw(canvas, fortune, system, system.canvasStyle);
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
    escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
},

    formatTraditionalValue(value) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  const parts = [];
  if (value.summary) parts.push(value.summary);
  if (value.evidence?.traditionalClause) parts.push('古斷：' + value.evidence.traditionalClause);
  if (!parts.length && value.text) parts.push(value.text);
  return parts.join('；');
},

    showFortuneResult(fortune, system, category, question) {
  const resultDiv = document.getElementById('fortune-result');
  if (!resultDiv) return;

  const esc = value => this.escapeHTML(value);
  const levelClass = this.getLevelClass(fortune.level);
  const modernEntries = Object.entries(fortune.categoryReadings || {}).filter(([, text]) => text);
  const traditionalEntries = Object.entries(fortune.traditionalSections || {})
    .map(([name, value]) => [name, this.formatTraditionalValue(value)])
    .filter(([, text]) => text);
  const insufficient = fortune.insufficientDomains || [];
  const warnings = fortune.warnings || [];
  const sourceRefs = fortune.sourceRefs || [];

  resultDiv.innerHTML = `
    <div class="fortune-result-card">
      <div class="fortune-result-header">
        <span class="fortune-result-system">${esc(system.name)}</span>
        <span class="fortune-result-no">${esc(fortune.displayNo)}</span>
        <span class="fortune-result-level ${levelClass}">${esc(fortune.level)}</span>
      </div>

      <div class="fortune-result-poem">
        ${(fortune.poem || []).map(line => `<p>${esc(line)}</p>`).join('')}
      </div>

      ${fortune.plainMeaning ? `
      <div class="fortune-result-section">
        <div class="fortune-result-title">💬 白話解釋</div>
        <div class="fortune-result-text">${esc(fortune.plainMeaning)}</div>
      </div>` : ''}

      ${fortune.classicMeaning ? `
      <div class="fortune-result-section">
        <div class="fortune-result-title">🎋 傳統解曰</div>
        <div class="fortune-result-text">${esc(fortune.classicMeaning)}</div>
      </div>` : `
      <div class="fortune-result-section fortune-result-note-panel">
        此選定版本未找到可核對的傳統解曰，未以通用文字補寫。
      </div>`}

      ${traditionalEntries.length ? `
      <details class="fortune-result-details">
        <summary>傳統分項（${traditionalEntries.length}）</summary>
        <div class="fortune-result-categories">
          ${traditionalEntries.map(([name, text]) => `
          <div class="fortune-cat-item">
            <span class="fortune-cat-name">【${esc(name)}】</span>
            <span class="fortune-cat-text">${esc(text)}</span>
          </div>`).join('')}
        </div>
      </details>` : ''}

      ${modernEntries.length ? `
      <details class="fortune-result-details">
        <summary>現代領域解讀（${modernEntries.length}）</summary>
        <div class="fortune-result-categories">
          ${modernEntries.map(([name, text]) => `
          <div class="fortune-cat-item ${name === category ? 'active' : ''}">
            <span class="fortune-cat-name">【${esc(name)}】</span>
            <span class="fortune-cat-text">${esc(text)}</span>
          </div>`).join('')}
        </div>
      </details>` : ''}

      ${insufficient.length ? `
      <div class="fortune-result-section fortune-result-note-panel">
        <strong>未作無證據推導：</strong>${esc(insufficient.join('、'))}
      </div>` : ''}

      ${(fortune.story || fortune.storyDetail) ? `
      <details class="fortune-result-details">
        <summary>📜 ${esc(fortune.story || '故事與意象考釋')}</summary>
        ${fortune.storyDetail ? `<div class="fortune-result-text">${esc(fortune.storyDetail)}</div>` : ''}
      </details>` : ''}

      ${(fortune.actionAdvice || []).length ? `
      <div class="fortune-result-section fortune-result-advice">
        <div class="fortune-result-title">✨ 行動建議</div>
        <ul>${fortune.actionAdvice.map(advice => `<li>${esc(advice)}</li>`).join('')}</ul>
      </div>` : ''}

      ${sourceRefs.length ? `
      <details class="fortune-result-details">
        <summary>🔗 來源識別</summary>
        <div class="fortune-result-text">${sourceRefs.map(esc).join('、')}</div>
      </details>` : ''}

      <div class="fortune-result-footer">
        <div class="fortune-result-note">使用提醒：籤詩屬民俗文化與自我整理參考；健康、懷孕、法律、投資、交通、人身安全及其他重大事項，請統一以現實證據與合格專業意見判斷。</div>
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
        
        // 根據牌數選擇佈局
        const cardCount = results.length;
        let layoutClass = 'tarot-layout-single';
        let cardHTML = '';
        
        if (cardCount === 1) {
            layoutClass = 'tarot-layout-single';
            cardHTML = this.renderSingleCard(results[0], 0);
        } else if (cardCount === 3) {
            layoutClass = 'tarot-layout-three';
            cardHTML = results.map((r, i) => this.renderThreeCard(r, i)).join('');
        } else if (cardCount === 5) {
            layoutClass = 'tarot-layout-five';
            cardHTML = this.renderFiveCard(results);
        } else {
            cardHTML = results.map((r, i) => this.renderDefaultCard(r, i)).join('');
        }
        
        containerDiv.innerHTML = `
            <div class="tarot-spread-container ${layoutClass}">
                ${cardHTML}
            </div>
        `;
        
        // 顯示解讀 - 每張牌獨立卡片
        resultDiv.innerHTML = `
            <div class="tarot-result-card">
                <div class="tarot-result-header">
                    <div class="tarot-result-icon">🔮</div>
                    <h2>塔羅占卜結果</h2>
                    ${question ? `<p class="tarot-question">"${question}"</p>` : ''}
                </div>
                
                <div class="tarot-result-body">
                    ${results.map(result => {
                        const cardMeaning = TarotEngine.getCardMeaning(result.card, result.isReversed);
                        const reversedClass = result.isReversed ? 'reversed' : 'upright';
                        return `
                            <div class="tarot-reading-card">
                                <div class="tarot-reading-header">
                                    <span class="tarot-reading-position">${result.position.name}</span>
                                    <span class="tarot-reading-card-name">${result.card.nameZh}</span>
                                    <span class="tarot-reading-orientation ${reversedClass}">${result.isReversed ? '逆位' : '正位'}</span>
                                </div>
                                
                                <div class="tarot-reading-keywords">
                                    ${cardMeaning.keywords.map(k => `<span class="keyword-tag">${k}</span>`).join('')}
                                </div>
                                
                                <div class="tarot-reading-meaning">
                                    ${cardMeaning.meaning}
                                </div>
                                
                                <div class="tarot-reading-details">
                                    <div class="detail-item">
                                        <span class="detail-icon">💕</span>
                                        <span class="detail-label">感情</span>
                                        <span class="detail-text">${cardMeaning.love}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-icon">💼</span>
                                        <span class="detail-label">事業</span>
                                        <span class="detail-text">${cardMeaning.career}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-icon">💰</span>
                                        <span class="detail-label">財務</span>
                                        <span class="detail-text">${cardMeaning.money}</span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-icon">🏥</span>
                                        <span class="detail-label">健康</span>
                                        <span class="detail-text">${cardMeaning.health}</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="tarot-result-footer">
                    <div class="tarot-result-note">占卜結果僅供參考，命運掌握在自己手中</div>
                </div>
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
     * 渲染單張牌
     */
    renderSingleCard(result, index) {
        return `
            <div class="tarot-card-position">
                <div class="tarot-position-label">${result.position.name}</div>
                <canvas id="tarot-canvas-${index}" width="280" height="420" class="tarot-canvas"></canvas>
                <div class="tarot-card-info">
                    <span class="tarot-card-title">${result.card.nameZh}</span>
                    <span class="tarot-card-orient">${result.isReversed ? '逆位' : '正位'}</span>
                </div>
            </div>
        `;
    },

    /**
     * 渲染三張牌佈局
     */
    renderThreeCard(result, index) {
        const arrow = index < 2 ? '<div class="tarot-arrow">→</div>' : '';
        return `
            <div class="tarot-card-position">
                <div class="tarot-position-label">${result.position.name}</div>
                <canvas id="tarot-canvas-${index}" width="240" height="360" class="tarot-canvas"></canvas>
                <div class="tarot-card-info">
                    <span class="tarot-card-title">${result.card.nameZh}</span>
                    <span class="tarot-card-orient">${result.isReversed ? '逆位' : '正位'}</span>
                </div>
            </div>
            ${arrow}
        `;
    },

    /**
     * 渲染五張牌十字佈局
     */
    renderFiveCard(results) {
        // 十字牌陣: 
        //     [2]
        // [1] [0] [3]
        //     [4]
        const positions = [
            { class: 'center', index: 0 },
            { class: 'left', index: 1 },
            { class: 'top', index: 2 },
            { class: 'right', index: 3 },
            { class: 'bottom', index: 4 }
        ];
        
        return positions.map(pos => {
            const result = results[pos.index];
            return `
                <div class="tarot-card-position tarot-pos-${pos.class}">
                    <div class="tarot-position-label">${result.position.name}</div>
                    <canvas id="tarot-canvas-${pos.index}" width="200" height="300" class="tarot-canvas"></canvas>
                    <div class="tarot-card-info">
                        <span class="tarot-card-title">${result.card.nameZh}</span>
                        <span class="tarot-card-orient">${result.isReversed ? '逆位' : '正位'}</span>
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * 渲染預設牌佈局
     */
    renderDefaultCard(result, index) {
        return `
            <div class="tarot-card-position">
                <div class="tarot-position-label">${result.position.name}</div>
                <canvas id="tarot-canvas-${index}" width="240" height="360" class="tarot-canvas"></canvas>
                <div class="tarot-card-info">
                    <span class="tarot-card-title">${result.card.nameZh}</span>
                    <span class="tarot-card-orient">${result.isReversed ? '逆位' : '正位'}</span>
                </div>
            </div>
        `;
    },

    /**
     * 計算籤詩 Canvas 所需高度
     */
    calculateFortuneCanvasHeight(fortune, width) {
        const h = FortuneCanvas.calculateHeight(fortune);
        const scale = width / 800;
        return Math.round(h * scale) + 100;
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

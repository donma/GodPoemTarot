/**
 * 塔羅 Canvas 繪圖引擎 - Emoji 版
 */
const TarotCanvas = {
    // 大阿爾克那 emoji 對應
    MAJOR_EMOJI: {
        0: '🤡',   // 愚者
        1: '🧙',   // 魔術師
        2: '🌙',   // 女祭司
        3: '👑',   // 女皇
        4: '🏛️',   // 皇帝
        5: '📿',   // 教皇
        6: '💕',   // 戀人
        7: '🏆',   // 戰車
        8: '🦁',   // 力量
        9: '🏔️',   // 隱者
        10: '🎡',  // 命運之輪
        11: '⚖️',  // 正義
        12: '🙃',  // 倒吊人
        13: '💀',  // 死神
        14: '☯️',  // 節制
        15: '😈',  // 惡魔
        16: '🗼',  // 高塔
        17: '⭐',  // 星星
        18: '🌑',  // 月亮
        19: '☀️',  // 太陽
        20: '📯',  // 審判
        21: '🌍'   // 世界
    },

    // 小阿爾克那花色 emoji
    SUIT_EMOJI: {
        wands: '🪄',     // 權杖
        cups: '🏆',      // 聖杯
        swords: '⚔️',    // 寶劍
        pentacles: '⭐'  // 錢幣
    },

    // 小阿爾克那數字 emoji
    NUMBER_EMOJI: {
        1: '🅰️', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣',
        6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣', 10: '🔟',
        11: '🃏', 12: '♞', 13: '👸', 14: '🤴'
    },

    draw(canvas, card, isReversed) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        if (card.arcana === 'major') {
            this.drawMajorArcana(ctx, w, h, card, isReversed);
        } else {
            this.drawMinorArcana(ctx, w, h, card, isReversed);
        }
    },

    /**
     * 繪製大阿爾克那
     */
    drawMajorArcana(ctx, w, h, card, isReversed) {
        // 背景漸層
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        ctx.fillStyle = gradient;
        this.drawRoundedRectFill(ctx, 0, 0, w, h, 15);

        // 星空裝飾
        this.drawStars(ctx, w, h);

        // 金色邊框
        ctx.strokeStyle = '#d6b56d';
        ctx.lineWidth = 3;
        this.drawRoundedRect(ctx, 5, 5, w - 10, h - 10, 12);

        // 內框
        ctx.strokeStyle = '#c79a3b44';
        ctx.lineWidth = 1;
        this.drawRoundedRect(ctx, 12, 12, w - 24, h - 24, 10);

        // 羅馬數字
        ctx.fillStyle = '#d6b56d';
        ctx.font = 'bold 18px "Noto Serif TC", serif';
        ctx.textAlign = 'center';
        const roman = TarotEngine.toRoman(card.number);
        ctx.fillText(roman, w / 2, 35);

        // 大型 emoji
        const emoji = this.MAJOR_EMOJI[card.number] || '✨';
        ctx.save();
        ctx.translate(w / 2, h * 0.4);
        if (isReversed) ctx.scale(1, -1);
        ctx.font = '80px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 0, 0);
        ctx.restore();

        // 正逆位標記
        ctx.fillStyle = isReversed ? '#ff6b6b' : '#51cf66';
        ctx.font = 'bold 14px "Noto Sans TC", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(isReversed ? '逆位' : '正位', w - 18, 30);

        // 牌名
        ctx.fillStyle = '#d6b56d';
        ctx.font = 'bold 22px "Noto Serif TC", serif';
        ctx.textAlign = 'center';
        ctx.fillText(card.nameZh, w / 2, h - 55);

        ctx.fillStyle = '#a0a0b0';
        ctx.font = '12px "Noto Sans TC", sans-serif';
        ctx.fillText(card.nameEn, w / 2, h - 32);
    },

    /**
     * 繪製小阿爾克那
     */
    drawMinorArcana(ctx, w, h, card, isReversed) {
        const colors = this.getSuitColors(card.suit);

        // 背景漸層
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, colors.bg1);
        gradient.addColorStop(1, colors.bg2);
        ctx.fillStyle = gradient;
        this.drawRoundedRectFill(ctx, 0, 0, w, h, 15);

        // 邊框
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 3;
        this.drawRoundedRect(ctx, 5, 5, w - 10, h - 10, 12);

        // 數字
        ctx.fillStyle = colors.accent;
        ctx.font = 'bold 18px "Noto Serif TC", serif';
        ctx.textAlign = 'center';
        ctx.fillText(card.number, w / 2, 35);

        // 花色 emoji
        const suitEmoji = this.SUIT_EMOJI[card.suit] || '✨';
        
        // 數字 emoji (如果有的話)
        const numEmoji = this.NUMBER_EMOJI[card.number] || '';

        ctx.save();
        ctx.translate(w / 2, h * 0.4);
        if (isReversed) ctx.scale(1, -1);

        // 繪製大型花色符號
        if (card.number <= 10) {
            // 數字牌：顯示對應數量的花色 emoji
            const emojiSize = card.number <= 3 ? 50 : (card.number <= 6 ? 40 : 30);
            ctx.font = `${emojiSize}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            if (card.number === 1) {
                ctx.font = '70px serif';
                ctx.fillText(suitEmoji, 0, 0);
            } else if (card.number <= 4) {
                const positions = this.getPositions(card.number, 60);
                positions.forEach(([x, y]) => ctx.fillText(suitEmoji, x, y));
            } else {
                // 網格排列
                const cols = Math.min(card.number, 3);
                const rows = Math.ceil(card.number / cols);
                const gap = 45;
                let idx = 0;
                for (let r = 0; r < rows && idx < card.number; r++) {
                    for (let c = 0; c < cols && idx < card.number; c++) {
                        const x = (c - (cols - 1) / 2) * gap;
                        const y = (r - (rows - 1) / 2) * gap;
                        ctx.fillText(suitEmoji, x, y);
                        idx++;
                    }
                }
            }
        } else {
            // 宮廷牌：顯示人物 emoji + 花色
            const courtEmoji = card.rank === 'page' ? '🧑' :
                              card.rank === 'knight' ? '♞' :
                              card.rank === 'queen' ? '👸' : '🤴';
            ctx.font = '60px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(courtEmoji, 0, -15);
            ctx.font = '30px serif';
            ctx.fillText(suitEmoji, 0, 35);
        }

        ctx.restore();

        // 正逆位標記
        ctx.fillStyle = isReversed ? '#ff6b6b' : '#51cf66';
        ctx.font = 'bold 14px "Noto Sans TC", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(isReversed ? '逆位' : '正位', w - 18, 30);

        // 牌名
        ctx.fillStyle = colors.accent;
        ctx.font = 'bold 20px "Noto Serif TC", serif';
        ctx.textAlign = 'center';
        ctx.fillText(card.nameZh, w / 2, h - 55);

        ctx.fillStyle = colors.border;
        ctx.font = '12px "Noto Sans TC", sans-serif';
        ctx.fillText(card.nameEn, w / 2, h - 32);
    },

    /**
     * 取得花色顏色
     */
    getSuitColors(suit) {
        const colors = {
            wands: {
                bg1: '#3d1308', bg2: '#1a0a04',
                border: '#c79a3b', accent: '#ff8c42',
                symbol: '#ff6b35'
            },
            cups: {
                bg1: '#0a1a3d', bg2: '#040a1a',
                border: '#4a90d9', accent: '#7ab8f5',
                symbol: '#5ba3ec'
            },
            swords: {
                bg1: '#2a2a3d', bg2: '#1a1a2a',
                border: '#a0a0b0', accent: '#c0c0d0',
                symbol: '#e0e0f0'
            },
            pentacles: {
                bg1: '#1a2d0a', bg2: '#0a1a04',
                border: '#8b8b00', accent: '#d4d400',
                symbol: '#b8b800'
            }
        };
        return colors[suit] || colors.wands;
    },

    /**
     * 取得位置（用於排列花色符號）
     */
    getPositions(count, radius) {
        const positions = [];
        const angleStep = (Math.PI * 2) / count;
        for (let i = 0; i < count; i++) {
            const angle = angleStep * i - Math.PI / 2;
            positions.push([
                Math.cos(angle) * radius * 0.5,
                Math.sin(angle) * radius * 0.5
            ]);
        }
        return positions;
    },

    /**
     * 繪製星空背景
     */
    drawStars(ctx, w, h) {
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const size = Math.random() * 2;
            ctx.globalAlpha = Math.random() * 0.5 + 0.1;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    },

    /**
     * 繪製圓角矩形（填滿）
     */
    drawRoundedRectFill(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
    },

    /**
     * 繪製圓角矩形（邊框）
     */
    drawRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.stroke();
    },

    /**
     * 下載 PNG
     */
    downloadPNG(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename || 'tarot.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
};

window.TarotCanvas = TarotCanvas;

/**
 * 籤詩 Canvas 繪圖引擎 - RWD 版
 */
const FortuneCanvas = {
    draw(canvas, fortune, system, style) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // 根據系統選擇背景
        const bgColors = {
            'gold_lotus_ink': { bg: '#faf5e8', accent: '#8b6914', text: '#2b2118' },
            'red_temple_stick': { bg: '#8b1a1a', accent: '#c79a3b', text: '#f7efe2' },
            'rice_paper_red': { bg: '#f7efe2', accent: '#9b1c1c', text: '#2b2118' },
            'gold_temple': { bg: '#f5e6d0', accent: '#8b0000', text: '#2b2118' },
            'purple_divine': { bg: '#2d1b4e', accent: '#d4a5ff', text: '#e0e0e0' },
            'green_taoist': { bg: '#1a3a1a', accent: '#90ee90', text: '#e0e0e0' },
            'pink_motherly': { bg: '#fff0f5', accent: '#c41e3a', text: '#2b2118' },
            'blue_divine': { bg: '#0a1a3a', accent: '#7ab8f5', text: '#e0e0e0' },
            'green_medicine': { bg: '#1a3a2a', accent: '#90ee90', text: '#e0e0e0' }
        };
        
        const colors = bgColors[system.canvasStyle] || bgColors['gold_lotus_ink'];
        
        // 繪製背景
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, w, h);
        
        // 繪製邊框
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 3;
        this.drawRoundedRect(ctx, 8, 8, w - 16, h - 16, 12);
        
        // 繪製內容
        this.drawFortuneContent(ctx, w, h, fortune, system, colors);
    },

    drawFortuneContent(ctx, w, h, fortune, system, colors) {
        const cx = w / 2;
        const pad = Math.max(30, w * 0.06);
        const maxW = w - pad * 2;
        let y = 50;
        
        // 根據 Canvas 寬度動態調整字體大小
        const scale = Math.min(w / 800, 1.2);
        const fs = (size) => Math.round(size * scale) + 'px';
        
        // 確保文字永遠置中
        ctx.textAlign = 'center';
        
        // === 系統名稱 ===
        ctx.fillStyle = colors.accent;
        ctx.font = `bold ${fs(24)} "Noto Serif TC", serif`;
        ctx.fillText(`【${system.name}】`, cx, y);
        y += 40;

        // 分隔線
        this.drawLine(ctx, pad, y, w - pad, y, colors.accent, 1);
        y += 50;

        // === 籤號 + 吉凶 (同一行，置中) ===
        ctx.textAlign = 'center';
        ctx.fillStyle = colors.accent;
        ctx.font = `bold ${fs(36)} "Noto Serif TC", serif`;
        ctx.fillText(fortune.displayNo + '  ' + fortune.level, cx, y);
        y += 60;

        // 裝飾線
        this.drawDotLine(ctx, pad + 20, y, w - pad - 20, colors.accent);
        y += 40;

        // === 籤詩原文 (置中，重要！) ===
        ctx.textAlign = 'center';
        ctx.fillStyle = colors.text;
        ctx.font = `bold ${fs(24)} "Noto Serif TC", serif`;
        
        const poemLines = fortune.poem || [];
        poemLines.forEach(line => {
            ctx.fillText(line, cx, y);
            y += 42;
        });
        y += 20;

        // 分隔線
        this.drawLine(ctx, pad, y, w - pad, y, colors.accent, 2);
        y += 30;

        // === 白話解釋 (靠左) ===
        ctx.textAlign = 'left';
        ctx.fillStyle = colors.accent;
        ctx.font = `bold ${fs(18)} "Noto Serif TC", serif`;
        ctx.fillText('【白話解釋】', pad, y);
        y += 30;

        ctx.fillStyle = colors.text;
        ctx.font = `${fs(16)} "Noto Sans TC", sans-serif`;
        const plainText = fortune.plainMeaning || fortune.classicMeaning || '暫無解釋';
        const plainLines = this.wrapText(ctx, plainText, maxW - 10);
        const maxPlain = Math.min(plainLines.length, 5);
        for (let i = 0; i < maxPlain; i++) {
            ctx.fillText(plainLines[i], pad, y);
            y += 26;
        }
        y += 15;

        // === 聖意（如果有） ===
        const shengYi = fortune.categoryReadings?.聖意 || '';
        if (shengYi && shengYi.length > 3) {
            ctx.textAlign = 'left';
            ctx.fillStyle = colors.accent;
            ctx.font = `bold ${fs(18)} "Noto Serif TC", serif`;
            ctx.fillText('【聖意】', pad, y);
            y += 30;

            ctx.fillStyle = colors.text;
            ctx.font = `${fs(14)} "Noto Sans TC", sans-serif`;
            const shengLines = this.wrapText(ctx, shengYi, maxW - 10);
            const maxSheng = Math.min(shengLines.length, 3);
            for (let i = 0; i < maxSheng; i++) {
                ctx.fillText(shengLines[i], pad, y);
                y += 22;
            }
            y += 10;
        }

        // === 解曰（如果有） ===
        const jieYue = fortune.categoryReadings?.解曰 || '';
        if (jieYue && jieYue.length > 3) {
            ctx.textAlign = 'left';
            ctx.fillStyle = colors.accent;
            ctx.font = `bold ${fs(18)} "Noto Serif TC", serif`;
            ctx.fillText('【解曰】', pad, y);
            y += 30;

            ctx.fillStyle = colors.text;
            ctx.font = `${fs(14)} "Noto Sans TC", sans-serif`;
            const jieLines = this.wrapText(ctx, jieYue, maxW - 10);
            const maxJie = Math.min(jieLines.length, 4);
            for (let i = 0; i < maxJie; i++) {
                ctx.fillText(jieLines[i], pad, y);
                y += 22;
            }
            y += 10;
        }

        // === 底部 ===
        y += 10;
        this.drawDotLine(ctx, pad + 10, y, w - pad - 10, colors.accent);
        y += 25;

        // 來源 + 標註 (置中)
        ctx.textAlign = 'center';
        ctx.fillStyle = '#888';
        ctx.font = `${fs(12)} "Noto Sans TC", sans-serif`;
        ctx.fillText(`${system.name} ｜ 占卜僅供參考 ｜ 當麻實驗室`, cx, y);
    },

    /**
     * 文字自動換行
     */
    wrapText(ctx, text, maxWidth) {
        if (!text) return [];
        const lines = [];
        let currentLine = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const testLine = currentLine + char;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && currentLine.length > 0) {
                lines.push(currentLine);
                currentLine = char;
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
    },

    drawLine(ctx, x1, y1, x2, y2, color, width) {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    },

    drawDotLine(ctx, x1, y, x2, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        for (let x = x1; x < x2; x += 8) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    },

    drawDecorLine(ctx, x1, y, x2, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
        // 中間菱形
        const mid = (x1 + x2) / 2;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(mid, y - 5);
        ctx.lineTo(mid + 5, y);
        ctx.lineTo(mid, y + 5);
        ctx.lineTo(mid - 5, y);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
    },

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

    getLevelColor(level) {
        const colors = {
            '大吉': '#c41e3a', '上吉': '#c41e3a', '上籤': '#c41e3a',
            '中吉': '#c79a3b', '小吉': '#c79a3b', '吉': '#c79a3b', '中籤': '#c79a3b',
            '中平': '#756b5d',
            '凶': '#4a4a4a', '下下': '#4a4a4a', '下籤': '#4a4a4a', '下吉': '#4a4a4a'
        };
        return colors[level] || '#756b5d';
    },

    downloadPNG(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename || 'fortune.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
};

window.FortuneCanvas = FortuneCanvas;

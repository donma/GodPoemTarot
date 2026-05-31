/**
 * 籤詩 Canvas 繪圖引擎 - 中國風版
 */
const FortuneCanvas = {
    draw(canvas, fortune, system, style) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        // 中國風配色方案
        const bgColors = {
            'gold_lotus_ink': { 
                bg: '#1a0f0a', 
                bgGrad: '#2d1810',
                accent: '#d4a574', 
                accentLight: '#e8c9a0',
                text: '#f5e6d3',
                border: '#8b6914',
                gold: '#ffd700'
            },
            'red_temple_stick': { 
                bg: '#2d0a0a', 
                bgGrad: '#1a0505',
                accent: '#c79a3b', 
                accentLight: '#e8c9a0',
                text: '#f5e6d3',
                border: '#8b0000',
                gold: '#ffd700'
            },
            'rice_paper_red': { 
                bg: '#1a0f0a', 
                bgGrad: '#2d1810',
                accent: '#c41e3a', 
                accentLight: '#e74c3c',
                text: '#f5e6d3',
                border: '#8b0000',
                gold: '#ffd700'
            },
            'gold_temple': { 
                bg: '#1a150a', 
                bgGrad: '#2d2510',
                accent: '#d4a574', 
                accentLight: '#e8c9a0',
                text: '#f5e6d3',
                border: '#8b6914',
                gold: '#ffd700'
            },
            'purple_divine': { 
                bg: '#1a0f2d', 
                bgGrad: '#0d071a',
                accent: '#b39ddb', 
                accentLight: '#d1c4e9',
                text: '#e8e0f0',
                border: '#7e57c2',
                gold: '#ffd700'
            },
            'green_taoist': { 
                bg: '#0a1a0f', 
                bgGrad: '#051a0a',
                accent: '#81c784', 
                accentLight: '#a5d6a7',
                text: '#e0f0e0',
                border: '#388e3c',
                gold: '#ffd700'
            },
            'pink_motherly': { 
                bg: '#2d1a1a', 
                bgGrad: '#1a0f0f',
                accent: '#f48fb1', 
                accentLight: '#f8bbd0',
                text: '#f5e6e6',
                border: '#c2185b',
                gold: '#ffd700'
            },
            'blue_divine': { 
                bg: '#0a1a2d', 
                bgGrad: '#050f1a',
                accent: '#90caf9', 
                accentLight: '#bbdefb',
                text: '#e0e8f5',
                border: '#1976d2',
                gold: '#ffd700'
            },
            'green_medicine': { 
                bg: '#0a1a15', 
                bgGrad: '#051a0f',
                accent: '#80cbc4', 
                accentLight: '#b2dfdb',
                text: '#e0f0ea',
                border: '#00897b',
                gold: '#ffd700'
            }
        };
        
        const colors = bgColors[system.canvasStyle] || bgColors['gold_lotus_ink'];
        
        // 繪製背景漸層
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, colors.bg);
        bgGrad.addColorStop(1, colors.bgGrad);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
        
        // 繪製中國風邊框
        this.drawChineseBorder(ctx, w, h, colors);
        
        // 繪製內容
        this.drawFortuneContent(ctx, w, h, fortune, system, colors);
    },

    /**
     * 繪製中國風邊框
     */
    drawChineseBorder(ctx, w, h, colors) {
        const pad = 15;
        const cornerSize = 30;
        
        // 外框
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 3;
        this.drawRoundedRect(ctx, pad, pad, w - pad * 2, h - pad * 2, 8);
        
        // 內框
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        this.drawRoundedRect(ctx, pad + 8, pad + 8, w - (pad + 8) * 2, h - (pad + 8) * 2, 5);
        ctx.globalAlpha = 1;
        
        // 四角裝飾
        this.drawCornerDecor(ctx, pad + 5, pad + 5, cornerSize, colors, 'tl');
        this.drawCornerDecor(ctx, w - pad - 5, pad + 5, cornerSize, colors, 'tr');
        this.drawCornerDecor(ctx, pad + 5, h - pad - 5, cornerSize, colors, 'bl');
        this.drawCornerDecor(ctx, w - pad - 5, h - pad - 5, cornerSize, colors, 'br');
    },

    /**
     * 繪製角落裝飾
     */
    drawCornerDecor(ctx, x, y, size, colors, position) {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        
        const s = size;
        switch(position) {
            case 'tl':
                ctx.beginPath();
                ctx.moveTo(0, s);
                ctx.lineTo(0, 0);
                ctx.lineTo(s, 0);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(5, 5, 3, 0, Math.PI * 2);
                ctx.fillStyle = colors.accent;
                ctx.fill();
                break;
            case 'tr':
                ctx.beginPath();
                ctx.moveTo(-s, 0);
                ctx.lineTo(0, 0);
                ctx.lineTo(0, s);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(-5, 5, 3, 0, Math.PI * 2);
                ctx.fillStyle = colors.accent;
                ctx.fill();
                break;
            case 'bl':
                ctx.beginPath();
                ctx.moveTo(0, -s);
                ctx.lineTo(0, 0);
                ctx.lineTo(s, 0);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(5, -5, 3, 0, Math.PI * 2);
                ctx.fillStyle = colors.accent;
                ctx.fill();
                break;
            case 'br':
                ctx.beginPath();
                ctx.moveTo(-s, 0);
                ctx.lineTo(0, 0);
                ctx.lineTo(0, -s);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(-5, -5, 3, 0, Math.PI * 2);
                ctx.fillStyle = colors.accent;
                ctx.fill();
                break;
        }
        
        ctx.restore();
    },

    drawFortuneContent(ctx, w, h, fortune, system, colors) {
        const cx = w / 2;
        const pad = Math.max(40, w * 0.08);
        const maxW = w - pad * 2;
        let y = 55;
        
        // 動態字體大小
        const scale = Math.min(w / 800, 1.2);
        const fs = (size) => Math.round(size * scale) + 'px';
        
        ctx.textAlign = 'center';
        
        // === 系統名稱 ===
        ctx.fillStyle = colors.accent;
        ctx.font = `bold ${fs(22)} "Noto Serif TC", serif`;
        ctx.globalAlpha = 0.8;
        ctx.fillText(`〔${system.name}〕`, cx, y);
        ctx.globalAlpha = 1;
        y += 45;

        // 中國風分隔線
        this.drawChineseDivider(ctx, pad + 20, y, w - pad - 20, colors);
        y += 50;

        // === 籤號 ===
        ctx.fillStyle = colors.gold;
        ctx.font = `bold ${fs(42)} "Noto Serif TC", serif`;
        ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
        ctx.shadowBlur = 15;
        ctx.fillText(fortune.displayNo, cx, y);
        ctx.shadowBlur = 0;
        y += 50;
        
        // === 吉凶標籤 ===
        const levelColors = {
            '上上': '#ffd700', '上吉': '#ffd700', '上籤': '#ffd700',
            '中平': '#e8c9a0', '中吉': '#e8c9a0', '中籤': '#e8c9a0', '中凶': '#d4a574',
            '下下': '#c41e3a', '下籤': '#c41e3a', '下凶': '#c41e3a',
            '大吉': '#ffd700', '全凶': '#c41e3a'
        };
        ctx.fillStyle = levelColors[fortune.level] || colors.accent;
        ctx.font = `bold ${fs(30)} "Noto Serif TC", serif`;
        ctx.fillText(fortune.level, cx, y);
        y += 50;

        // 裝飾點線
        this.drawDotLine(ctx, pad + 30, y, w - pad - 30, colors.accent);
        y += 40;

        // === 籤詩原文 ===
        ctx.fillStyle = colors.text;
        ctx.font = `bold ${fs(26)} "Noto Serif TC", serif`;
        
        const poemLines = fortune.poem || [];
        poemLines.forEach((line, i) => {
            // 詩句陰影
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 5;
            ctx.fillText(line, cx, y);
            ctx.shadowBlur = 0;
            y += 45;
        });
        y += 20;

        // 中國風分隔線
        this.drawChineseDivider(ctx, pad + 20, y, w - pad - 20, colors);
        y += 35;

        // === 白話解釋 ===
        ctx.textAlign = 'left';
        ctx.fillStyle = colors.accent;
        ctx.font = `bold ${fs(18)} "Noto Serif TC", serif`;
        ctx.fillText('【白話解釋】', pad, y);
        y += 30;

        ctx.fillStyle = colors.text;
        ctx.font = `${fs(15)} "Noto Sans TC", sans-serif`;
        const plainText = fortune.plainMeaning || fortune.classicMeaning || '暫無解釋';
        const plainLines = this.wrapText(ctx, plainText, maxW - 10);
        const maxPlain = Math.min(plainLines.length, 6);
        for (let i = 0; i < maxPlain; i++) {
            ctx.fillText(plainLines[i], pad, y);
            y += 26;
        }
        y += 15;

        // === 聖意 ===
        const shengYi = fortune.categoryReadings?.聖意 || '';
        if (shengYi && shengYi.length > 3) {
            ctx.fillStyle = colors.accent;
            ctx.font = `bold ${fs(18)} "Noto Serif TC", serif`;
            ctx.fillText('【聖意】', pad, y);
            y += 30;

            ctx.fillStyle = colors.text;
            ctx.font = `${fs(14)} "Noto Sans TC", sans-serif`;
            const shengLines = this.wrapText(ctx, shengYi, maxW - 10);
            const maxSheng = Math.min(shengLines.length, 5);
            for (let i = 0; i < maxSheng; i++) {
                ctx.fillText(shengLines[i], pad, y);
                y += 22;
            }
            y += 15;
        }

        // === 解曰/總論 ===
        const jieYue = fortune.categoryReadings?.解曰 || fortune.categoryReadings?.總論 || '';
        if (jieYue && jieYue.length > 3 && jieYue !== shengYi) {
            ctx.fillStyle = colors.accent;
            ctx.font = `bold ${fs(18)} "Noto Serif TC", serif`;
            ctx.fillText('【解曰】', pad, y);
            y += 30;

            ctx.fillStyle = colors.text;
            ctx.font = `${fs(14)} "Noto Sans TC", sans-serif`;
            const jieLines = this.wrapText(ctx, jieYue, maxW - 10);
            const maxJie = Math.min(jieLines.length, 6);
            for (let i = 0; i < maxJie; i++) {
                ctx.fillText(jieLines[i], pad, y);
                y += 22;
            }
            y += 15;
        }

        // === 行動建議 ===
        const advice = fortune.actionAdvice?.[0] || '';
        if (advice && advice.length > 3) {
            ctx.fillStyle = colors.gold;
            ctx.font = `bold ${fs(16)} "Noto Serif TC", serif`;
            ctx.fillText('【行動建議】', pad, y);
            y += 28;

            ctx.fillStyle = colors.text;
            ctx.font = `${fs(14)} "Noto Sans TC", sans-serif`;
            const adviceLines = this.wrapText(ctx, advice, maxW - 10);
            const maxAdvice = Math.min(adviceLines.length, 4);
            for (let i = 0; i < maxAdvice; i++) {
                ctx.fillText(adviceLines[i], pad, y);
                y += 22;
            }
            y += 15;
        }

        // === 底部 ===
        y += 15;
        this.drawChineseDivider(ctx, pad + 10, y, w - pad - 10, colors);
        y += 30;

        // 浮水印
        ctx.textAlign = 'center';
        ctx.fillStyle = colors.accent;
        ctx.globalAlpha = 0.4;
        ctx.font = `${fs(12)} "Noto Serif TC", serif`;
        ctx.fillText(`${system.name} ｜ 當麻實驗室`, cx, y);
        ctx.globalAlpha = 1;
    },

    /**
     * 繪製中國風分隔線
     */
    drawChineseDivider(ctx, x1, y, x2, colors) {
        const mid = (x1 + x2) / 2;
        const len = (x2 - x1) / 2;
        
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        
        // 左線
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(mid - 15, y);
        ctx.stroke();
        
        // 右線
        ctx.beginPath();
        ctx.moveTo(mid + 15, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
        
        // 中間菱形
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.moveTo(mid, y - 6);
        ctx.lineTo(mid + 8, y);
        ctx.lineTo(mid, y + 6);
        ctx.lineTo(mid - 8, y);
        ctx.closePath();
        ctx.fill();
        
        ctx.globalAlpha = 1;
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
     * 動態計算 Canvas 高度
     */
    calculateHeight(fortune, system) {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        const ctx = canvas.getContext('2d');
        
        const pad = 60;
        const maxW = 800 - pad * 2;
        let y = 55;
        
        // 系統名稱
        y += 45;
        
        // 分隔線
        y += 50;
        
        // 籤號
        y += 50;
        
        // 吉凶
        y += 50;
        
        // 裝飾線
        y += 40;
        
        // 詩句
        y += 45 * (fortune.poem?.length || 4);
        y += 20;
        
        // 分隔線
        y += 35;
        
        // 白話解釋
        y += 30;
        ctx.font = '15px "Noto Sans TC", sans-serif';
        const plainText = fortune.plainMeaning || fortune.classicMeaning || '';
        y += 26 * Math.min(this.wrapText(ctx, plainText, maxW).length, 5);
        y += 15;
        
        // 聖意
        const shengYi = fortune.categoryReadings?.聖意 || '';
        if (shengYi && shengYi.length > 3) {
            y += 30;
            ctx.font = '14px "Noto Sans TC", sans-serif';
            y += 22 * Math.min(this.wrapText(ctx, shengYi, maxW).length, 4);
            y += 15;
        }
        
        // 解曰/總論
        const jieYue = fortune.categoryReadings?.解曰 || fortune.categoryReadings?.總論 || '';
        if (jieYue && jieYue.length > 3 && jieYue !== shengYi) {
            y += 30;
            ctx.font = '14px "Noto Sans TC", sans-serif';
            y += 22 * Math.min(this.wrapText(ctx, jieYue, maxW).length, 5);
            y += 15;
        }
        
        // 行動建議
        const advice = fortune.actionAdvice?.[0] || '';
        if (advice && advice.length > 3) {
            y += 28;
            ctx.font = '14px "Noto Sans TC", sans-serif';
            y += 22 * Math.min(this.wrapText(ctx, advice, maxW).length, 3);
            y += 15;
        }
        
        // 底部
        y += 45;
        
        // 邊距
        y += 40;
        
        return Math.max(y, 600);
    }
};

window.FortuneCanvas = FortuneCanvas;

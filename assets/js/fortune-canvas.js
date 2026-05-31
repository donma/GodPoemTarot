/**
 * 籤詩 Canvas 繪圖引擎 - 中國風版
 */
const FortuneCanvas = {
    draw(canvas, fortune, system, style) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const colors = this.getColors(system.canvasStyle);
        
        // 背景
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, colors.bg);
        bgGrad.addColorStop(1, colors.bgGrad);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);
        
        // 邊框
        this.drawBorder(ctx, w, h, colors);
        
        // 內容
        this.drawContent(ctx, w, h, fortune, system, colors);
    },

    getColors(style) {
        const themes = {
            'gold_lotus_ink': { bg: '#1a0f0a', bgGrad: '#2d1810', accent: '#d4a574', text: '#f5e6d3', border: '#8b6914', gold: '#ffd700' },
            'red_temple_stick': { bg: '#2d0a0a', bgGrad: '#1a0505', accent: '#c79a3b', text: '#f5e6d3', border: '#8b0000', gold: '#ffd700' },
            'rice_paper_red': { bg: '#1a0f0a', bgGrad: '#2d1810', accent: '#c41e3a', text: '#f5e6d3', border: '#8b0000', gold: '#ffd700' },
            'gold_temple': { bg: '#1a150a', bgGrad: '#2d2510', accent: '#d4a574', text: '#f5e6d3', border: '#8b6914', gold: '#ffd700' },
            'purple_divine': { bg: '#1a0f2d', bgGrad: '#0d071a', accent: '#b39ddb', text: '#e8e0f0', border: '#7e57c2', gold: '#ffd700' },
            'green_taoist': { bg: '#0a1a0f', bgGrad: '#051a0a', accent: '#81c784', text: '#e0f0e0', border: '#388e3c', gold: '#ffd700' },
            'pink_motherly': { bg: '#2d1a1a', bgGrad: '#1a0f0f', accent: '#f48fb1', text: '#f5e6e6', border: '#c2185b', gold: '#ffd700' },
            'blue_divine': { bg: '#0a1a2d', bgGrad: '#050f1a', accent: '#90caf9', text: '#e0e8f5', border: '#1976d2', gold: '#ffd700' },
            'green_medicine': { bg: '#0a1a15', bgGrad: '#051a0f', accent: '#80cbc4', text: '#e0f0ea', border: '#00897b', gold: '#ffd700' }
        };
        return themes[style] || themes['gold_lotus_ink'];
    },

    drawBorder(ctx, w, h, colors) {
        const p = 15;
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 3;
        this.roundRect(ctx, p, p, w - p*2, h - p*2, 8);
        
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        this.roundRect(ctx, p+8, p+8, w - (p+8)*2, h - (p+8)*2, 5);
        ctx.globalAlpha = 1;
        
        this.drawCorners(ctx, w, h, p, colors);
    },

    drawCorners(ctx, w, h, p, colors) {
        const s = 25;
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        
        [[p+5, p+5, 1, 1], [w-p-5, p+5, -1, 1], [p+5, h-p-5, 1, -1], [w-p-5, h-p-5, -1, -1]].forEach(([x, y, dx, dy]) => {
            ctx.beginPath();
            ctx.moveTo(x, y + s*dy);
            ctx.lineTo(x, y);
            ctx.lineTo(x + s*dx, y);
            ctx.stroke();
        });
        ctx.globalAlpha = 1;
    },

    drawContent(ctx, w, h, fortune, system, colors) {
        const cx = w / 2;
        const pad = 50;
        const maxW = w - pad * 2;
        const maxY = h - 50;
        let y = 50;

        const fs = (s) => Math.round(s * Math.min(w/800, 1.2)) + 'px';
        
        const safe = (text, x, yy) => {
            if (yy < maxY) ctx.fillText(text, x, yy);
        };

        // 系統名稱
        ctx.textAlign = 'center';
        ctx.fillStyle = colors.accent;
        ctx.font = `bold ${fs(20)} "Noto Serif TC", serif`;
        ctx.globalAlpha = 0.7;
        safe(`〔${system.name}〕`, cx, y);
        ctx.globalAlpha = 1;
        y += 40;

        // 分隔線
        this.divider(ctx, pad+20, y, w-pad-20, colors);
        y += 45;

        // 籤號
        ctx.fillStyle = colors.gold;
        ctx.font = `bold ${fs(38)} "Noto Serif TC", serif`;
        ctx.shadowColor = 'rgba(255,215,0,0.4)';
        ctx.shadowBlur = 10;
        safe(fortune.displayNo, cx, y);
        ctx.shadowBlur = 0;
        y += 45;

        // 吉凶
        const lc = {'上上':'#ffd700','上吉':'#ffd700','上籤':'#ffd700','大吉':'#ffd700','中平':'#e8c9a0','中吉':'#e8c9a0','中籤':'#e8c9a0','下下':'#c41e3a','下籤':'#c41e3a','下吉':'#c41e3a','全凶':'#c41e3a'};
        ctx.fillStyle = lc[fortune.level] || colors.accent;
        ctx.font = `bold ${fs(26)} "Noto Serif TC", serif`;
        safe(fortune.level, cx, y);
        y += 45;

        // 點線
        this.dots(ctx, pad+30, y, w-pad-30, colors.accent);
        y += 35;

        // 詩句
        ctx.fillStyle = colors.text;
        ctx.font = `bold ${fs(24)} "Noto Serif TC", serif`;
        (fortune.poem || []).forEach(line => {
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.shadowBlur = 4;
            safe(line, cx, y);
            ctx.shadowBlur = 0;
            y += 42;
        });
        y += 15;

        // 分隔線
        this.divider(ctx, pad+20, y, w-pad-20, colors);
        y += 30;

        // 白話解釋
        ctx.textAlign = 'left';
        ctx.fillStyle = colors.accent;
        ctx.font = `bold ${fs(16)} "Noto Serif TC", serif`;
        safe('【白話解釋】', pad, y);
        y += 28;

        ctx.fillStyle = colors.text;
        ctx.font = `${fs(14)} "Noto Sans TC", sans-serif`;
        const plain = fortune.plainMeaning || fortune.classicMeaning || '暫無解釋';
        this.wrapText(ctx, plain, maxW).slice(0, 5).forEach(line => {
            safe(line, pad, y);
            y += 24;
        });
        y += 12;

        // 聖意
        const sy = fortune.categoryReadings?.聖意 || '';
        if (sy && sy.length > 3 && y < maxY) {
            ctx.fillStyle = colors.accent;
            ctx.font = `bold ${fs(16)} "Noto Serif TC", serif`;
            safe('【聖意】', pad, y);
            y += 28;
            ctx.fillStyle = colors.text;
            ctx.font = `${fs(13)} "Noto Sans TC", sans-serif`;
            this.wrapText(ctx, sy, maxW).slice(0, 4).forEach(line => {
                safe(line, pad, y);
                y += 20;
            });
            y += 12;
        }

        // 解曰
        const jy = fortune.categoryReadings?.解曰 || fortune.categoryReadings?.總論 || '';
        if (jy && jy.length > 3 && jy !== sy && y < maxY) {
            ctx.fillStyle = colors.accent;
            ctx.font = `bold ${fs(16)} "Noto Serif TC", serif`;
            safe('【解曰】', pad, y);
            y += 28;
            ctx.fillStyle = colors.text;
            ctx.font = `${fs(13)} "Noto Sans TC", sans-serif`;
            this.wrapText(ctx, jy, maxW).slice(0, 5).forEach(line => {
                safe(line, pad, y);
                y += 20;
            });
            y += 12;
        }

        // 行動建議
        const adv = fortune.actionAdvice?.[0] || '';
        if (adv && adv.length > 3 && y < maxY) {
            ctx.fillStyle = colors.gold;
            ctx.font = `bold ${fs(15)} "Noto Serif TC", serif`;
            safe('【行動建議】', pad, y);
            y += 26;
            ctx.fillStyle = colors.text;
            ctx.font = `${fs(13)} "Noto Sans TC", sans-serif`;
            this.wrapText(ctx, adv, maxW).slice(0, 3).forEach(line => {
                safe(line, pad, y);
                y += 20;
            });
            y += 12;
        }

        // 底部
        if (y + 40 < maxY) {
            this.divider(ctx, pad+10, y, w-pad-10, colors);
            y += 25;
            ctx.textAlign = 'center';
            ctx.fillStyle = colors.accent;
            ctx.globalAlpha = 0.35;
            ctx.font = `${fs(11)} "Noto Serif TC", serif`;
            ctx.fillText(`${system.name} ｜ 當麻實驗室`, cx, y);
            ctx.globalAlpha = 1;
        }
    },

    wrapText(ctx, text, maxW) {
        if (!text) return [];
        const lines = [];
        let cur = '';
        for (const ch of text) {
            if (ctx.measureText(cur + ch).width > maxW && cur) {
                lines.push(cur);
                cur = ch;
            } else {
                cur += ch;
            }
        }
        if (cur) lines.push(cur);
        return lines;
    },

    divider(ctx, x1, y, x2, colors) {
        const mid = (x1 + x2) / 2;
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(mid - 12, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mid + 12, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
        ctx.fillStyle = colors.accent;
        ctx.beginPath();
        ctx.moveTo(mid, y-5);
        ctx.lineTo(mid+7, y);
        ctx.lineTo(mid, y+5);
        ctx.lineTo(mid-7, y);
        ctx.fill();
        ctx.globalAlpha = 1;
    },

    dots(ctx, x1, y, x2, color) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.25;
        for (let x = x1; x < x2; x += 8) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    },

    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.lineTo(x+w-r, y);
        ctx.quadraticCurveTo(x+w, y, x+w, y+r);
        ctx.lineTo(x+w, y+h-r);
        ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        ctx.lineTo(x+r, y+h);
        ctx.quadraticCurveTo(x, y+h, x, y+h-r);
        ctx.lineTo(x, y+r);
        ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.closePath();
        ctx.stroke();
    },

    calculateHeight(fortune, system) {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        const ctx = canvas.getContext('2d');
        const maxW = 680;
        let y = 50;

        y += 40;  // 系統名稱
        y += 45;  // 分隔線
        y += 45;  // 籤號
        y += 45;  // 吉凶
        y += 35;  // 點線
        y += 42 * (fortune.poem?.length || 4);  // 詩句
        y += 15;
        y += 30;  // 分隔線
        y += 28;  // 白話解釋標題
        ctx.font = '14px "Noto Sans TC"';
        y += 24 * Math.min(this.wrapText(ctx, fortune.plainMeaning || fortune.classicMeaning || '', maxW).length, 5);
        y += 12;

        const sy = fortune.categoryReadings?.聖意 || '';
        if (sy && sy.length > 3) {
            y += 28;
            ctx.font = '13px "Noto Sans TC"';
            y += 20 * Math.min(this.wrapText(ctx, sy, maxW).length, 4);
            y += 12;
        }

        const jy = fortune.categoryReadings?.解曰 || fortune.categoryReadings?.總論 || '';
        if (jy && jy.length > 3 && jy !== sy) {
            y += 28;
            ctx.font = '13px "Noto Sans TC"';
            y += 20 * Math.min(this.wrapText(ctx, jy, maxW).length, 5);
            y += 12;
        }

        const adv = fortune.actionAdvice?.[0] || '';
        if (adv && adv.length > 3) {
            y += 26;
            ctx.font = '13px "Noto Sans TC"';
            y += 20 * Math.min(this.wrapText(ctx, adv, maxW).length, 3);
            y += 12;
        }

        y += 60;  // 底部+邊距
        return Math.max(y, 650);
    }
};

window.FortuneCanvas = FortuneCanvas;

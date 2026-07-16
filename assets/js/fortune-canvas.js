/**
 * 籤詩 Canvas 繪圖引擎 - 優雅中國風
 */
const FortuneCanvas = {
    fontLoaded: false,
    
    async ensureFont() {
        if (this.fontLoaded) return;
        try {
            await document.fonts.load('400 16px "Noto Serif TC"');
            await document.fonts.load('700 16px "Noto Serif TC"');
            this.fontLoaded = true;
        } catch (e) {
            console.warn('Font loading failed, using fallback');
        }
    },
    
    async draw(canvas, fortune, system, style) {
        await this.ensureFont();
        
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const c = this.getColor(system.canvasStyle);
        
        // 背景
        const bg = ctx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, c.bg);
        bg.addColorStop(1, c.bg2);
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);
        
        // 邊框
        this.drawFrame(ctx, w, h, c);
        
        // 內容
        this.drawBody(ctx, w, h, fortune, system, c);
    },

    getColor(s) {
        const t = {
            'gold_lotus_ink':    { bg:'#1a0f0a', bg2:'#2d1810', acc:'#d4a574', txt:'#f5e6d3', bdr:'#8b6914', gold:'#ffd700' },
            'red_temple_stick':  { bg:'#2d0a0a', bg2:'#1a0505', acc:'#c79a3b', txt:'#f5e6d3', bdr:'#8b0000', gold:'#ffd700' },
            'rice_paper_red':    { bg:'#1a0f0a', bg2:'#2d1810', acc:'#c41e3a', txt:'#f5e6d3', bdr:'#8b0000', gold:'#ffd700' },
            'gold_temple':       { bg:'#1a150a', bg2:'#2d2510', acc:'#d4a574', txt:'#f5e6d3', bdr:'#8b6914', gold:'#ffd700' },
            'purple_divine':     { bg:'#1a0f2d', bg2:'#0d071a', acc:'#b39ddb', txt:'#e8e0f0', bdr:'#7e57c2', gold:'#ffd700' },
            'green_taoist':      { bg:'#0a1a0f', bg2:'#051a0a', acc:'#81c784', txt:'#e0f0e0', bdr:'#388e3c', gold:'#ffd700' },
            'pink_motherly':     { bg:'#2d1a1a', bg2:'#1a0f0f', acc:'#f48fb1', txt:'#f5e6e6', bdr:'#c2185b', gold:'#ffd700' },
            'blue_divine':       { bg:'#0a1a2d', bg2:'#050f1a', acc:'#90caf9', txt:'#e0e8f5', bdr:'#1976d2', gold:'#ffd700' },
            'green_medicine':    { bg:'#0a1a15', bg2:'#051a0f', acc:'#80cbc4', txt:'#e0f0ea', bdr:'#00897b', gold:'#ffd700' },
            'beige_divine':     { bg:'#faf3e0', bg2:'#f5ecd7', acc:'#8b6914', txt:'#3e2723', bdr:'#c79a3b', gold:'#c79a3b' },
            'teal_temple':      { bg:'#1a3a3a', bg2:'#0d2a2a', acc:'#4db6ac', txt:'#e0f0ef', bdr:'#00897b', gold:'#ffd700' }
        };
        return t[s] || t['gold_lotus_ink'];
    },

    drawFrame(ctx, w, h, c) {
        const p = 20;
        ctx.strokeStyle = c.bdr; ctx.lineWidth = 3;
        this.rr(ctx, p, p, w-p*2, h-p*2, 10);
        ctx.strokeStyle = c.acc; ctx.lineWidth = 1;
        ctx.globalAlpha = 0.3;
        this.rr(ctx, p+10, p+10, w-(p+10)*2, h-(p+10)*2, 6);
        ctx.globalAlpha = 1;
        this.corners(ctx, w, h, p, c);
    },

    corners(ctx, w, h, p, c) {
        const s = 30;
        ctx.strokeStyle = c.acc; ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        [[p+8,p+8,1,1],[w-p-8,p+8,-1,1],[p+8,h-p-8,1,-1],[w-p-8,h-p-8,-1,-1]].forEach(([x,y,dx,dy])=>{
            ctx.beginPath(); ctx.moveTo(x,y+s*dy); ctx.lineTo(x,y); ctx.lineTo(x+s*dx,y); ctx.stroke();
            ctx.beginPath(); ctx.arc(x+5*dx,y+5*dy,2,0,Math.PI*2); ctx.fillStyle=c.acc; ctx.fill();
        });
        ctx.globalAlpha = 1;
    },

    drawBody(ctx, w, h, f, sys, c) {
        const cx = w/2, pad = 55, mw = w-pad*2, my = h - 55;
        let y = 55;
        const sc = Math.min(w/800, 1.15);
        const fs = s => Math.round(s*sc)+'px';
        const safe = (t, x, yy) => { if (yy < my) ctx.fillText(t, x, yy); };

        // 系統名
        ctx.textAlign = 'center';
        ctx.fillStyle = c.acc;
        ctx.font = `600 ${fs(18)} "Noto Serif TC", serif`;
        ctx.globalAlpha = 0.6;
        safe(`【${sys.name}】`, cx, y);
        ctx.globalAlpha = 1;
        y += 55;

        // 籤號
        ctx.fillStyle = c.gold;
        ctx.font = `700 ${fs(48)} "Noto Serif TC", serif`;
        ctx.shadowColor = 'rgba(255,215,0,0.35)';
        ctx.shadowBlur = 12;
        safe(f.displayNo, cx, y);
        ctx.shadowBlur = 0;
        y += 60;

        // 吉凶
        const lc = {'上上':'#ffd700','上吉':'#ffd700','上籤':'#ffd700','大吉':'#ffd700','中平':'#e8c9a0','中吉':'#e8c9a0','中籤':'#e8c9a0','下下':'#e57373','下籤':'#e57373'};
        ctx.fillStyle = lc[f.level]||c.acc;
        ctx.font = `700 ${fs(30)} "Noto Serif TC", serif`;
        safe(f.level, cx, y);
        y += 55;

        // 分隔
        this.sep(ctx, pad+25, y, w-pad-25, c);
        y += 38;

        // 詩句
        ctx.fillStyle = c.txt;
        ctx.font = `700 ${fs(24)} "Noto Serif TC", serif`;
        (f.poem||[]).forEach(l => {
            ctx.shadowColor='rgba(0,0,0,0.2)'; ctx.shadowBlur=4;
            safe(l, cx, y);
            ctx.shadowBlur=0;
            y += 42;
        });
        y += 18;

        // 分隔
        this.sep(ctx, pad+25, y, w-pad-25, c);
        y += 32;

        // 白話解釋
        y = this.drawSection(ctx, cx, y, mw, '白話解釋', f.plainMeaning||'', c, fs, safe, 8, my);
        y += 8;

        // 行動建議
        const adv = f.actionAdvice?.[0]||'';
        if (adv && adv.length > 3 && y < my) {
            ctx.fillStyle = c.gold;
            ctx.font = `700 ${fs(15)} "Noto Serif TC", serif`;
            safe('【行動建議】', cx, y);
            y += 26;
            ctx.fillStyle = c.txt;
            ctx.font = `400 ${fs(14)} "Noto Sans TC", sans-serif`;
            this.wrap(ctx, adv, mw).slice(0, 6).forEach(l => { safe(l, cx, y); y += 22; });
            y += 10;
        }

        // 底部浮水印
        ctx.textAlign = 'center';
        ctx.fillStyle = c.acc;
        ctx.globalAlpha = 0.35;
        ctx.font = `400 ${fs(10)} "Noto Serif TC", serif`;
        ctx.fillText(`${sys.name} ｜ 當麻實驗室`, cx, h - 30);
        ctx.globalAlpha = 1;
    },

    drawSection(ctx, cx, y, mw, title, text, c, fs, safe, maxLines, my) {
        ctx.textAlign = 'center';
        ctx.fillStyle = c.acc;
        ctx.font = `700 ${fs(15)} "Noto Serif TC", serif`;
        safe(`【${title}】`, cx, y);
        y += 26;
        ctx.fillStyle = c.txt;
        ctx.font = `400 ${fs(13)} "Noto Sans TC", sans-serif`;
        this.wrap(ctx, text, mw).slice(0, maxLines).forEach(l => {
            safe(l, cx, y);
            y += 20;
        });
        return y;
    },

    decodeHTML(text) {
        if (!text) return '';
        const doc = new DOMParser().parseFromString(text, 'text/html');
        return doc.documentElement.textContent;
    },
    
    wrap(ctx, t, mw) {
        if (!t) return [];
        t = this.decodeHTML(t);
        const r = []; let c = '';
        for (const ch of t) {
            if (ctx.measureText(c + ch).width > mw && c) { r.push(c); c = ch; }
            else c += ch;
        }
        if (c) r.push(c);
        return r;
    },

    sep(ctx, x1, y, x2, c) {
        const m = (x1 + x2) / 2;
        ctx.strokeStyle = c.acc; ctx.lineWidth = 1; ctx.globalAlpha = 0.35;
        ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(m - 15, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(m + 15, y); ctx.lineTo(x2, y); ctx.stroke();
        ctx.fillStyle = c.acc;
        ctx.beginPath(); ctx.moveTo(m, y - 5); ctx.lineTo(m + 7, y); ctx.lineTo(m, y + 5); ctx.lineTo(m - 7, y); ctx.fill();
        ctx.globalAlpha = 1;
    },

    rr(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r);
        ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r);
        ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.closePath(); ctx.stroke();
    },

    calculateHeight(f, sys) {
        const cv = document.createElement('canvas'); cv.width = 800;
        const ctx = cv.getContext('2d'), mw = 690;
        let y = 55;

        y += 55;  // 系統名
        y += 60;  // 籤號
        y += 55;  // 吉凶
        y += 38;  // 分隔
        y += 42 * (f.poem?.length || 4);  // 詩句
        y += 18;
        y += 32;  // 分隔

        // 白話解釋
        y += 26;
        ctx.font = '13px "Noto Sans TC"';
        const plainText = f.plainMeaning || '';
        y += 20 * Math.min(this.wrap(ctx, plainText, mw).length, 8);
        y += 8;

        // 行動建議
        const adv = f.actionAdvice?.[0] || '';
        if (adv && adv.length > 3) {
            y += 26;
            ctx.font = '13px "Noto Sans TC"';
            y += 20 * Math.min(this.wrap(ctx, adv, mw).length, 6);
            y += 10;
        }

        y += 60; // 邊距+浮水印
        return Math.max(y, 600);
    },

    downloadPNG(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename || 'fortune.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
};

window.FortuneCanvas = FortuneCanvas;

# 神明籤詩塔羅 GodPoemTarot

> 純前端台灣傳統籤詩 + Rider-Waite 塔羅牌占卜系統
> 支援 `file:///` 直接開啟，無需伺服器

## 功能特色

### 三聖筊解鎖機制
- 使用 Web Crypto API 產生加密安全隨機數
- 紅色真實筊杯圖片 + 3D 翻轉動畫
- 連續三次聖筊才能解鎖抽籤功能

### 九大籤詩系統

| 系統 | 籤數 | 資料來源 | 狀態 |
|------|------|----------|------|
| 觀音一百籤 | 100 | ai-guide guanyin-100-lots | ✅ 完整 |
| 關聖帝君一百籤 | 100 | ai-guide guandi-100-lots-v2-rebuilt | ✅ 完整 |
| 六十甲子籤 | 60 | ai-guide sixty-jiazi-lots | ✅ 完整 |
| 護國嘉濟江東王靈籤 | 100 | ai-guide jiangdong-king-100-lots | ✅ 完整 |
| 四聖真君靈籤 | 49 | ai-guide sisheng-49-lots-complete-rebuild | ✅ 完整 |
| 扶天廣聖如意靈籤 | 120 | ai-guide futian-guangsheng-120-lots-complete-rebuild | ✅ 完整 |
| 註生娘娘靈籤 | 30 | ai-guide zhusheng-30-lots-researched | ✅ 完整 |
| 保生大帝六十籤（大龍峒保安宮版） | 60 | ai-guide baoan-baosheng-60-lots-researched | ✅ 完整 |
| 媽祖天后宮一百籤（澎湖天后宮版） | 100 | ai-guide penghu-tianhou-100-lots-researched | ✅ 完整 |
| 台北指南宮呂祖靈籤六十首 | 60 | ai-guide zhinan-luzu-60-lots-researched | ✅ 完整 |

**總計：799 首籤詩**

### Rider-Waite 塔羅牌
- 78 張完整牌組（22 大阿爾克那 + 56 小阿爾克那）
- 四種牌陣：單張、三張（過去/現在/未來）、三張（狀況/阻礙/建議）、五張十字牌陣
- Canvas 渲染塔羅牌面

### 籤詩內容結構
每首籤詩包含：
- 籤詩原文
- 故事典故（學術考據 + 民間配籤）
- 白話解釋（四句逐句解析）
- 12 項分類運勢（事業、考試、求財、失物、健康、總論、婚姻、人際、感情、出行、家宅、修心建議）
- 行動建議（具體步驟 + 檢查表）

### Canvas 籤詩卡片
- 九種中國風視覺風格
- 籤詩 + 白話解釋 + 行動建議
- 「當麻實驗室」浮水印
- 支援 PNG 下載

## 快速開始

```bash
# 直接用瀏覽器開啟 index.html
open index.html
```

或部署到 GitHub Pages / Cloudflare Pages / 任何靜態網頁伺服器。

## 技術架構

```
fortune-tarot-app/
├── index.html                    # 主頁面
├── README.md                     # 本文件
├── assets/
│   ├── css/
│   │   └── app.css              # 中國風淺色主題（含RWD）
│   ├── images/
│   │   ├── cup-left.png         # 筊杯陽面
│   │   ├── cup-right.png        # 筊杯陰面
│   │   └── ...                  # 筊杯圖片
│   └── js/
│       ├── random-engine.js     # Web Crypto API 亂數引擎
│       ├── state.js             # LocalStorage 狀態管理
│       ├── fortune-engine.js    # 籤詩系統載入引擎
│       ├── tarot-engine.js      # 78 張塔羅牌引擎
│       ├── fortune-canvas.js    # 籤詩 Canvas 渲染器
│       ├── tarot-canvas.js      # 塔羅 Canvas 渲染器
│       ├── ui-renderer.js       # UI 互動邏輯
│       └── *-data.js            # 各系統嵌入資料檔
├── data/
│   ├── fortune-systems.json     # 系統定義
│   └── tarot/                   # 塔羅牌資料
├── ai-guide/                    # AI 研究資料來源
│   ├── guanyin-100-lots/
│   ├── guandi-100-lots-v2-rebuilt/
│   ├── sixty-jiazi-lots/
│   ├── jiangdong-king-100-lots/
│   ├── sisheng-49-lots-complete-rebuild/
│   ├── futian-guangsheng-120-lots-complete-rebuild/
│   └── zhusheng-30-lots-researched/
└── docs/                        # 開發文件
```

## 版權聲明

- 籤詩資料來自公有領域文獻（維基文庫等）
- 現代白話解釋為 AI 輔助生成
- 塔羅牌使用 Emoji + Canvas 渲染
- 占卜結果僅供參考，不代表絕對結果

## 授權

MIT License
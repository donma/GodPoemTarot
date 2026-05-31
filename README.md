# 籤詩塔羅占卜系統 GodPoemTarot

> 純前端傳統籤詩 + Rider-Waite 塔羅牌占卜，支援 `file:///` 直接開啟

![License](https://img.shields.io/badge/license-MIT-blue)
![HTML5](https://img.shields.io/badge/HTML5-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-yellow)
![Canvas](https://img.shields.io/badge/Canvas-API-green)

## 功能特色

### 三聖筊解鎖機制
- 使用 Web Crypto API 產生加密安全隨機數
- 紅色 SVG 筊杯 3D 翻轉動畫
- 連續三次聖筊才能解鎖抽籤功能
- 一正一反 = 聖筊 ✓ / 兩正面 = 笑筊 / 兩反面 = 陰筊

### 九大籤詩系統

| 系統 | 籤數 | 來源 | 視覺風格 |
|------|------|------|----------|
| 觀音一百籤 | 100 | 解籤閣部落格 | 淡金・蓮花・水墨 |
| 關聖帝君一百籤 | 100 | 維基文庫 | 深紅・金邊・武廟 |
| 六十甲子籤 | 60 | 籤詩網 | 米黃・干支・古廟朱印 |
| 護國嘉濟江東王靈籤 | 100 | 維基文庫 | 古典・朱紅 |
| 四聖真君靈籤 | 49 | 維基文庫 | 紫金・道家 |
| 扶天廣聖如意靈籤 | 120 | 維基文庫 | 青綠・道家 |
| 註生娘娘靈籤 | 99 | 維基文庫 | 粉紅・慈母 |
| 洪恩靈濟真君靈籤 | 53 | 維基文庫 | 藍金・神聖 |
| 靈濟真君注生堂靈籤 | 64 | 維基文庫 | 綠金・醫藥 |

**總計：745 首籤詩**

### Rider-Waite 塔羅牌
- 78 張完整牌組（22 大阿爾克那 + 56 小阿爾克那）
- Emoji 風格渲染（80px 大尺寸）
- 依花色變換背景顏色
- 支援正位 / 逆位顯示
- 四種牌陣：單張、三張（過去/現在/未來）、三張（狀況/阻礙/建議）、五張

### Canvas 籤詩卡片
- 動態 RWD 縮放（`scale = Math.min(width / 800, 1.2)`）
- 自動文字換行
- 動態高度計算
- 「當麻實驗室」浮水印
- 九種視覺風格對應九個籤詩系統

### RWD 響應式設計
- 桌機：左右佈局
- 手機：上下佈局
- Canvas 自動縮放適應螢幕

## 快速開始

### 方法一：直接開啟（推薦）

```bash
# 直接用瀏覽器開啟 index.html
# 支援 file:/// 協議，無需伺服器
open index.html
```

### 方法二：本地伺服器

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# 然後開啟 http://localhost:8000
```

### 方法三：GitHub Pages

1. Fork 本專案
2. 到 Settings > Pages
3. Source 選擇 main branch
4. 開啟 https://your-username.github.io/GodPoemTarot/

## 使用流程

```
開啟頁面 → 擲筊三次聖筊 → 解鎖功能
                              ├─ 抽籤：選系統 → 擲筊 → 抽籤 → Canvas 顯示
                              └─ 塔羅：選牌陣 → 抽牌 → Canvas 顯示
```

## 技術架構

```
fortune-tarot-app/
├── index.html                    # 主頁面
├── test.html                     # 測試頁面
├── README.md                     # 本文件
├── assets/
│   ├── css/
│   │   └── app.css              # 主要樣式（含 RWD）
│   └── js/
│       ├── random-engine.js     # Web Crypto API 亂數引擎
│       ├── state.js             # LocalStorage 狀態管理
│       ├── fortune-engine.js    # 籤詩系統載入引擎
│       ├── tarot-engine.js      # 78 張塔羅牌引擎
│       ├── fortune-canvas.js    # 籤詩 Canvas 渲染器
│       ├── tarot-canvas.js      # 塔羅 Canvas 渲染器
│       ├── ui-renderer.js       # UI 互動邏輯
│       ├── guanyin-100-data.js  # 觀音 100 籤嵌入資料
│       ├── guandi-100-data.js   # 關帝 100 籤嵌入資料
│       ├── liushi-60-data.js    # 六十甲子 60 籤嵌入資料
│       ├── jiangdong-100-data.js # 護國 100 籤嵌入資料
│       ├── sizhen-100-data.js   # 四聖真君 49 籤嵌入資料
│       ├── futian-120-data.js   # 扶天 120 籤嵌入資料
│       ├── zhusheng-99-data.js  # 註生娘娘 99 籤嵌入資料
│       ├── hongen-53-data.js    # 洪恩 53 籤嵌入資料
│       └── zhushengtang-64-data.js # 注生堂 64 籤嵌入資料
├── data/
│   └── fortune-systems.json     # 系統定義（9 個系統）
└── docs/                        # 開發文件
```

## 資料來源

| 系統 | 來源 | 授權 |
|------|------|------|
| 觀音一百籤 | [解籤閣](https://fortune-poems.blogspot.com) | 公有領域 |
| 關聖帝君一百籤 | [維基文庫](https://zh.wikisource.org) | 公有領域 |
| 六十甲子籤 | [籤詩網](https://www.chance.org.tw) | 公有領域 |
| 護國嘉濟江東王靈籤 | [維基文庫](https://zh.wikisource.org) | 公有領域 |
| 四聖真君靈籤 | [維基文庫](https://zh.wikisource.org) | 公有領域 |
| 扶天廣聖如意靈籤 | [維基文庫](https://zh.wikisource.org) | 公有領域 |
| 註生娘娘靈籤 | [維基文庫](https://zh.wikisource.org) | 公有領域 |
| 洪恩靈濟真君靈籤 | [維基文庫](https://zh.wikisource.org) | 公有領域 |
| 靈濟真君注生堂靈籤 | [維基文庫](https://zh.wikisource.org) | 公有領域 |
| 塔羅牌 | Rider-Waite 公有領域圖案 | 公有領域 |

## 籤詩內容說明

每首籤詩包含：
- **籤詩原文**：古典詩句
- **吉凶等級**：上上、上吉、中平、中吉、中凶、下下、全凶 等
- **白話解釋**：現代中文翻譯
- **聖意 / 解曰**：傳統解籤內容
- **行動建議**：根據籤意生成的實用建議
- **故事典故**：相關歷史或神話故事

## Canvas 視覺風格

每個系統有獨特的配色與裝飾：

| 系統 | 背景色 | 強調色 | 風格 |
|------|--------|--------|------|
| 觀音籤 | `#faf5e8` 淡金 | `#8b6914` 金 | 蓮花・水墨 |
| 關帝籤 | `#8b1a1a` 深紅 | `#c79a3b` 金 | 武廟・威嚴 |
| 六十甲子 | `#f7efe2` 米黃 | `#9b1c1c` 朱紅 | 干支・古廟 |
| 護國籤 | `#f5e6d0` 古典 | `#8b0000` 朱紅 | 宮廟・莊嚴 |
| 四聖真君 | `#2d1b4e` 紫 | `#d4a5ff` 淡紫 | 道家・神秘 |
| 扶天籤 | `#1a3a1a` 深綠 | `#90ee90` 淡綠 | 道家・自然 |
| 註生娘娘 | `#fff0f5` 粉紅 | `#c41e3a` 紅 | 慈母・溫柔 |
| 洪恩籤 | `#0a1a3a` 深藍 | `#7ab8f5` 淡藍 | 神聖・莊嚴 |
| 注生堂 | `#1a3a2a` 墨綠 | `#90ee90` 淡綠 | 醫藥・養生 |

## 擲筊機率說明

| 結果 | 機率 | 說明 |
|------|------|------|
| 聖筊 | 50% | 一正一反 |
| 笑筊 | 25% | 兩平面朝上 |
| 陰筊 | 25% | 兩平面朝下 |

連續三次聖筊機率：`0.5³ = 12.5%`

## 亂數規則

### 千數聚籤法
1. 使用 `crypto.getRandomValues()` 產生加密安全隨機數
2. 每次抽籤產生 1000 個亂數
3. 統計每個籤號出現次數
4. 取出現次數最多的籤號
5. 如有並列第一則重新抽籤

### 塔羅抽牌
- 從剩餘牌池中抽取，不重複
- 正 / 逆位另用隨機數判定

## 開發指南

### 新增籤詩系統

1. 在 `data/fortune-systems.json` 新增系統定義
2. 建立 `assets/js/{system}-data.js` 嵌入資料檔
3. 在 `index.html` 引入新資料檔
4. 在 `fortune-engine.js` 註冊新系統

### 資料格式

```javascript
{
  no: 1,
  displayNo: "第1籤",
  level: "上上",
  title: "觀音第1籤",
  poem: ["天開地闢結良緣", "日吉時良萬事全", "若得此籤非小可", "人行中正帝王宣"],
  story: "鍾離成道",
  classicMeaning: "急速兆速。年未值時。觀音降筆。先報君知。",
  plainMeaning: "此卦盤古初開天地之象。諸事皆吉也。",
  categoryReadings: {
    總論: "...",
    聖意: "家宅　祈福。自身　秋冬大利。..."
  },
  actionAdvice: ["把握時機積極行動，貴人相助，諸事順遂。"],
  warnings: ["占卜結果僅供參考"],
  sourceIds: ["fortune_poems_blog"],
  dataQuality: { poemChecked: true, meaningRewritten: false, traditionalChineseChecked: true }
}
```

## 測試

開啟 `test.html` 執行自動測試，驗證：
- 亂數引擎正常
- 所有籤詩系統可載入
- Canvas 渲染正常
- 塔羅牌抽取正常

## 版權聲明

1. 所有籤詩資料均來自公有領域文獻
2. 現代白話解釋為 AI 輔助生成
3. 塔羅牌使用 Emoji 渲染，無圖片授權問題
4. 占卜結果僅供參考，不代表絕對結果
5. 健康相關內容不可取代專業醫療建議
6. 法律相關內容不可取代專業法律諮詢

## 授權

MIT License

## 致謝

- [維基文庫](https://zh.wikisource.org) - 古典籤詩文獻
- [解籤閣](https://fortune-poems.blogspot.com) - 觀音籤資料
- [籤詩網](https://www.chance.org.tw) - 六十甲子籤資料
- [Rider-Waite Tarot](https://en.wikipedia.org/wiki/Rider%E2%80%93Waite_tarot_deck) - 塔羅牌系統

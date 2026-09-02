# GodPoemTarot

一套純前端的台灣籤詩與 Rider–Waite–Smith 塔羅系統。

可直接透過 `file://` 開啟，也可以部署到 GitHub Pages、Cloudflare Pages、Netlify、IIS、Nginx 或任何靜態網站。

但這個專案真正想做的，不只是按一下按鈕，然後隨機跑出一首籤詩。

GodPoemTarot 嘗試把台灣常見籤詩整理成一套：

**結構化、可追溯、可驗證、可程式化使用的開放資料。**

目前包含：

* 8 套台灣常見籤詩系統
* 619 首籤詩
* 78 張 Rider–Waite–Smith 塔羅牌
* 共 697 筆正式內容
* 原始籤文、典故、白話解讀與現代分類
* 文獻來源與資料定位
* 自動資料驗證工具
* Web Crypto 隨機抽籤
* 擲筊、求籤、塔羅完整前端介面

簡單說...

別人做線上求籤。

這個專案順便做了一個籤詩 Dataset。

---

## 收錄內容

| systemId            | 籤詩系統                    |  數量 |
| ------------------- | ----------------------- | --: |
| `guanyin_100`       | 觀音一百籤                   | 100 |
| `guandi_100`        | 關聖帝君一百籤                 | 100 |
| `liu_shi_jia_zi_60` | 六十甲子籤                   |  60 |
| `sizhen_49`         | 四聖真君靈籤                  |  49 |
| `futian_120`        | 扶天廣聖如意靈籤                | 120 |
| `zhusheng_30`       | 註生娘娘靈籤                  |  30 |
| `baosheng_60`       | 大龍峒保安宮保生大帝六十籤           |  60 |
| `tianhou_100`       | 澎湖天后宮一百籤                | 100 |
| `tarot_rws_78`      | Rider–Waite–Smith Tarot |  78 |

籤詩總計 **619 首**。

加上塔羅後，目前正式內容共 **697 筆**。

---

## 這個專案跟一般線上求籤有什麼不同

### 1. 籤詩不是只有一段文字

GodPoemTarot 使用結構化 Schema 保存籤詩資料。

資料會盡可能區分：

* 原始籤文
* 正規化籤文
* 傳統解籤文字
* 籤詩典故
* 白話說明
* 吉凶等級
* 現代問題領域
* 行動建議
* 文獻來源
* 來源定位
* 作者與整理方式
* 人工審核狀態
* 安全警告

這代表這些資料不只能被網站使用。

也可以進一步用於：

* 程式開發
* 資料分析
* 民俗研究
* 語料整理
* 搜尋系統
* AI / RAG
* 數位人文研究

---

## 2. 沒資料就是沒資料

很多線上籤詩系統會發生一種很神奇的事情。

假設某首籤被分類成中吉：

```text
工作：中吉
財運：中吉
愛情：中吉
考試：中吉
健康：中吉
失物：中吉
```

人生突然變成 Excel 自動填滿。

GodPoemTarot 不採用這種方式。

如果某個領域沒有足夠的傳統資料或證據支持，系統會標記：

```text
insufficient
```

而不是從總籤等級強行推導。

資料不完整沒關係。

假裝知道才有問題。

---

## 3. 文獻來源與 AI 內容分開

正式籤詩資料透過：

```text
sourceRefs
```

指向：

```text
data/source-index.json
```

並透過：

```text
sourceLocators
```

記錄籤號、頁碼或其他來源定位資訊。

正式文獻來源不得使用：

```text
AI
ChatGPT
Codex
generated
unknown
```

作為來源。

AI 可以協助：

* 資料整理
* 結構轉換
* 語意分類
* 白話化
* 現代解讀整理

但只能記錄在：

```text
authoring.method
```

等作者與整理資訊內。

它不能突然穿越時空，變成古籍作者。

---

## 4. Schema 3.0

目前正式籤詩資料採用 Schema 3.0。

可以大致理解成：

```text
Fortune
├── 原始資料
├── 傳統文本
├── 籤詩典故
├── 白話說明
├── 現代領域
├── 行動建議
├── 安全警告
├── 文獻來源
└── 審核資訊
```

UI 不直接依賴某一套特定籤詩格式。

所有籤詩系統統一經過 `FortuneEngine` 轉換。

因此未來新增其他籤詩系統時，不需要重新設計整套前端。

---

## 5. Fortune Catalog

所有正式籤詩系統集中管理於：

```text
assets/js/fortune-catalog.js
```

每套籤詩包含：

```text
systemId
name
shortName
deity
total
globalName
dataFile
editionId
sourceRefs
canvasStyle
status
```

程式、UI 與驗證器都從同一份 Catalog 取得系統資訊。

盡量避免發生：

```text
README 說有 100 首
程式說有 99 首
資料夾裡其實有 101 首
```

這種很有工程味，但不太好的驚喜。

---

# 隨機機制

GodPoemTarot 不使用：

```javascript
Math.random()
```

主要亂數來源採用瀏覽器 Web Crypto API：

```javascript
crypto.getRandomValues()
```

籤詩抽取實作一套 `千數聚籤法`：

1. 產生 1000 次加密安全亂數
2. 統計每支籤出現次數
3. 取得出現次數唯一最高者
4. 如果最高次數並列，重新進行

從機率角度來看，各支籤仍維持對稱。

從產品角度來看...

至少不像：

```javascript
Math.floor(Math.random() * 60)
```

那麼沒有儀式感。

---

# 擲筊

網站內建擲筊機制。

左右筊分別透過 Web Crypto API 產生結果，組合成：

* 聖筊
* 笑筊
* 陰筊

目前前端流程要求：

```text
靜心
  ↓
擲筊
  ↓
連續三次聖筊
  ↓
解鎖求籤與塔羅
  ↓
開始占卜
```

畢竟都做到神明籤詩了。

直接放一顆 Random 按鈕，多少有點不尊重 UI。

---

# Tarot

除了台灣籤詩之外，GodPoemTarot 也包含完整的：

**Rider–Waite–Smith Tarot 78 張牌**

支援：

* 正位
* 逆位
* 多張牌陣
* 同一牌陣不重複抽牌

抽牌同樣使用 Web Crypto API。

---

# 安全與使用界線

民俗占卜適合作為：

* 文化研究
* 民俗資料整理
* 自我反思
* 娛樂
* 人生問題整理

但不應該取代：

* 醫療診斷
* 產檢
* 法律意見
* 投資建議
* 財務決策
* 人身安全判斷

GodPoemTarot 針對部分高風險領域提供獨立 warning code。

包含：

* 健康
* 懷孕
* 法律
* 財務
* 感情安全
* 出行
* 失物

相關警告集中於：

```text
assets/js/safety-warnings.js
```

---

# 資料狀態

目前 619 筆籤詩資料主要仍屬：

```text
ai_assisted
draft
```

代表資料已完成一定程度的：

* 結構化整理
* 來源定位
* 自動驗證
* 模板檢查
* 載入驗證

但尚未全部完成具名人工逐首核准。

驗證出現：

```text
PASS
```

不代表：

```text
神明已 Code Review
```

它代表的是：

* Schema 正確
* 數量正確
* 來源引用可解析
* 資料載入鏈正常
* 模板相似度檢查通過
* 基本資料品質規則通過

人工內容審核仍屬獨立流程。

---

# 驗證工具

需要 Node.js 20 或以上版本。

## 驗證正式內容

```bash
node tools/validate-content.mjs
```

檢查：

* Schema
* 必要欄位
* 數量
* 系統關聯
* 資料完整性

## 驗證來源

```bash
node tools/validate-sources.mjs
```

檢查：

* `sourceRefs`
* Source Index
* 來源定位
* 無效來源引用

## 模板相似度檢查

```bash
node tools/detect-template.mjs
```

用來偵測大量現代解讀是否出現過度模板化或重複內容。

## 載入鏈驗證

```bash
node tools/validate-load-chain.mjs
```

驗證正式網站所需要的 JavaScript、Catalog 與資料檔是否能正常建立完整載入鏈。

驗證報告輸出至：

```text
reports/
```

人工審核相關資料則放置於：

```text
reports/manual-review-checklist.md
```

---

# 執行方式

這是一個純前端專案。

不需要：

```text
Database
Docker
.NET
PHP
Python Server
Node Server
```

直接開啟：

```text
index.html
```

即可使用。

支援：

```text
file://
```

也可以直接部署到：

* GitHub Pages
* Cloudflare Pages
* Netlify
* Nginx
* Apache
* IIS
* 任意 Static Hosting

---

# 專案結構

```text
GodPoemTarot
│
├── assets
│   ├── css
│   ├── images
│   └── js
│
├── data
│   └── source-index.json
│
├── docs
│
├── reports
│
├── tools
│
├── index.html
└── README.md
```

主要目錄用途：

### `assets/js/*-data.js`

正式籤詩資料。

### `assets/js/fortune-catalog.js`

正式籤詩系統清冊。

### `assets/js/fortune-engine.js`

負責籤詩資料載入、格式轉換與抽籤。

### `assets/js/random-engine.js`

Web Crypto 隨機機制、塔羅抽牌與擲筊。

### `data/`

文獻來源與其他結構化基礎資料。

### `tools/`

資料驗證、來源檢查與品質檢測工具。

### `reports/`

自動驗證與人工審核相關報告。

### `docs/`

研究資料、來源核對資料與開發過程文件。

---

# 專案目標

GodPoemTarot 的目標並不是證明占卜是否準確。

這個專案比較在意另外一件事情：

**如果要把台灣籤詩數位化，那至少把資料整理好。**

傳統籤詩本身同時包含：

* 宗教
* 民俗
* 文學
* 歷史
* 地方信仰
* 人生觀
* 民間知識

它值得被當成資料認真整理。

而不是最後只剩：

```text
按下按鈕
↓
大吉
```

希望 GodPoemTarot 最後不只是一個求籤網站。

也能成為一份可以被：

* 程式開發者
* 資料研究者
* 民俗研究者
* 數位人文研究者
* 一般使用者

共同使用的：

**台灣籤詩結構化開放資料集與占卜引擎。**

---

# Disclaimer

本專案內容僅供：

* 文化研究
* 資料整理
* 娛樂
* 自我反思

任何涉及醫療、法律、財務、懷孕、人身安全或其他重大人生決策的事項，請尋求相關專業人士協助。

神明可以給方向。

Pull Request 還是要自己送。

---

# License

This project is licensed under the **MIT License**.

See [`LICENSE`](LICENSE) for details.

Copyright © 2026 donma

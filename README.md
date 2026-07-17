# GodPoemTarot

純前端、可由 file:// 或靜態網站開啟的台灣籤詩與 Rider–Waite–Smith 塔羅專案。

## 正式內容

| systemId | 版本 | 數量 | 審核狀態 |
|---|---|---:|---|
| guanyin_100 | 台灣流通常見觀音一百籤 | 100 | draft_review |
| guandi_100 | 雷雨師一百籤台灣流通本 | 100 | draft_review |
| liu_shi_jia_zi_60 | 六十甲子籤台灣流通本 | 60 | draft_review |
| sizhen_49 | 《正統道藏》四聖真君靈籤 | 49 | draft_review |
| futian_120 | 《正統道藏》扶天廣聖如意靈籤 | 120 | draft_review |
| zhusheng_30 | 台灣民間流通註生娘娘三十籤 | 30 | draft_review |
| baosheng_60 | 大龍峒保安宮保生大帝六十籤 | 60 | draft_review |
| tianhou_100 | 澎湖天后宮一百籤台灣流通本 | 100 | draft_review |
| tarot_rws_78 | Rider–Waite–Smith 78 張 | 78 | content_present |

籤詩共 619 首，塔羅 78 張，正式內容總計 697 筆。

## 資料政策

正式籤詩使用 Schema 3.0，分開保存原文、傳統文本、故事類型、白話說明、現代領域、來源定位與作者／審核狀態。assets/js/fortune-catalog.js 是唯一系統清冊；程式、UI 與驗證器均讀取它。

來源不得使用 AI、ChatGPT、Codex、generated 或 unknown 作為文獻。每筆資料以 sourceRefs 指向 data/source-index.json，並以 sourceLocators 記錄籤號。AI 僅可標示在 authoring.method，不可冒充來源。

目前 619 筆資料都標為 ai_assisted／draft，尚未經具名人工逐首核准。目前保生與天后保留 1,580 筆具逐項證據且通過模板相似度門檻的現代解讀；其餘沒有足夠傳統分項證據的領域標為 insufficient，不由總籤等或通用模板推導。人工複核完成前不得改標 approved。

## 安全聲明

民俗占卜只作文化與自我整理參考，不能取代醫療、產檢、法律、財務或人身安全的專業判斷。健康、懷孕、法律、財務、感情安全、出行與失物安全使用專屬 warning code；完整文字在 assets/js/safety-warnings.js。

## 驗證

需要 Node.js 20 以上：

    node tools/validate-content.mjs
    node tools/validate-sources.mjs
    node tools/detect-template.mjs
    node tools/validate-load-chain.mjs

報告輸出至 reports/。自動驗證 PASS 只代表結構、計數、來源解析、模板門檻與載入鏈通過；人工內容審核狀態另見 reports/manual-review-checklist.md。

## 執行

直接開啟 index.html 可使用 file://；也可放到 GitHub Pages 或任一靜態 HTTP 主機。正式資料缺少時初始化會明確拋出錯誤，不會生成 placeholder 籤詩。

docs/ 為保留的研究與核對資料，不由清理程序刪除。

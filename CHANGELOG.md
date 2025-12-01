## v1.0.0 - Platform Inception & Vision (2025-11-19)

* **feat**:

  * 這一版主要解決「沒有明確產品定位與教學路線圖」的問題。定義四級學習族群與平台願景，拉出從入門到專業的完整路徑，同時設計網站地圖與資訊架構，涵蓋首頁、課程、部落格、專案與未來後台，確保後續所有功能、內容與 UI 決策都有一套穩定且可長期擴充的藍圖。

## v1.1.0 - App Skeleton & Content Engine (2025-11-20)

* **feat**:

  * 這一版補上「缺乏穩定程式骨架與內容管線」的問題。初始化 Next.js App Router 專案，設定 TypeScript 與 Tailwind 主題，實作 Navbar、Footer 與首頁 Hero，並導入 MDX 內容引擎與課程播放器頁面結構。從此課程、Blog、專案都能透過統一的 MDX 管線管理，為之後真正塞入教學內容打好技術地基。

## v1.1.1 - Env & Day1 Design Decisions (2025-11-21)

* **fix**:

  * 這一版針對「開發環境不穩、規格分散」的問題進行修補。修正本機無法偵測 Node.js 的狀況，調整 PowerShell 政策與環境變數，讓 `node -v`、npm 及 dev server 都能穩定運作。同時整理 Day 1 的所有設計決策與課程路線圖，寫成文件與日誌，避免日後忘記當初的技術與產品取捨，確保團隊在同一套規格上前進。

---

## v2.0.0 - Auth, Membership & Forum Foundation (2025-11-22)

* **feat**:

  * 這一版是平台第一次「能力躍遷」，從純內容網站升級成有會員與社群的學習系統。導入 NextAuth.js + Prisma/SQLite，完成註冊、登入與 session 流程，建立 Forum 的 Post/Comment 模型與 API，並實作列表、詳情與留言介面。學生不再只是「看文章」，而是可以登入、發文、留言，分享錯誤觀念與解題心得，為之後所有互動式教學奠定基礎。

## v2.0.1 - System Recovery & LLM Feature Cleanup (2025-11-22)

* **refactor**:

  * 這一版專注在修補前幾天 LLM 試驗造成的技術債。回復或重建 Tailwind 設定、清理破壞 build 的 TypeScript 型別錯誤與未使用 import，並暫時移除不穩定的 AIQuizGenerator、AITutor 等元件，只留下未來可重用的架構。目標是讓專案恢復到「可以正常開發與部署」的狀態，而不被半成品的 AI 功能拖著走。

---

## v3.0.0 - LLM Assignments, Real LLM & DB Migration (2025-11-23)

* **feat**:

  * 這一版把平台從「有課程、有會員」推進到「能靠 AI 幫忙練習與產生題目」的階段。新增 LLM-assisted Assignment 流程與 VerificationPanel，讓學生在每個章節結束後透過 AI 小測驗檢查理解，還可標記 AI 解說錯誤並分享到論壇。後端則正式改用 OpenRouter 等真實 LLM，並把核心資料遷移到 PostgreSQL/Prisma，建立 User、Course、Lesson、UserProgress 等 schema，使整個系統從原本偏 prototype 的檔案型內容，升級成可營運的資料庫式產品。

## v3.1.0 - Markdown, LaTeX & Manual Quiz Support (2025-11-23)

* **feat**:

  * 這一版解決「工程內容無法完整呈現」與「測驗過度依賴 LLM」的問題。導入 react-markdown、remark-gfm、remark-math、rehype-katex 等工具，讓課程與 Blog 可以安全顯示表格與 LaTeX 公式，支援工程數學與電路推導。新增 QuizQuestion 資料表與手動題庫機制，確保在 LLM 出錯或無回應時仍有穩定題目可用，提升課程品質控制能力。

## v3.1.1 - Dashboard & Time Tracking Foundation (2025-11-23)

* **feat**:

  * 這一版補齊「看不到自己學了多少」的缺口。設計學習時間紀錄機制與 Dashboard 顯示邏輯，計算每門課與每個學生的累計學習時數，並將 Dashboard 改成 dynamic render，避免 Prisma cache 導致資料顯示延遲。學生從此可以看到更具體的時間投入，平台也有基礎數據支撐後續學習分析功能。

---

## v3.2.0 - Schema Refinement & LaTeX Everywhere (2025-11-24)

* **refactor**:

  * 這一版著重在「資料結構整理與公式顯示普及」。調整 BlogPost 與 Course schema，移除不再使用的欄位並加入 image、duration 等更貼近實際呈現需求的資料；在 Blog、Project、Lesson 中統一加入 videoUrl 支援影音內容。AI 測驗 API 被強化為可一次讀取大段章節內容，並在全站導入 LaTeX 顯示，確保不論在哪個頁面都可以穩定呈現工程公式。

## v3.2.1 - AI Quiz Hardening & MDX Safety (2025-11-24)

* **fix**:

  * 這一版專門處理「AI 測驗與 MDX 易壞」的痛點。修正 slug 與 UUID 混用造成的外鍵錯誤與 404，為 Prisma P2003 等錯誤補上保護，避免 session 過期時整個 API 崩潰。針對 AI 測驗，加入上下文長度限制與回退策略，當 LLM 失敗時可退回手動題庫；同時在處理論壇貼文與內嵌 code 時加上 try/catch 與自動包裝成 code block，避免單一不合法內容就讓整頁爆炸。

---

## v3.3.0 - Admin CMS, Edit Mode & User Progress (2025-11-25)

* **feat**:

  * 這一版讓平台從「工程師才能改內容」進化到「可以用後台與 inline 編輯維護」。擴充 Admin CMS，完成 Courses/Projects CRUD，讓課程與專案改用系統管理而非手動改檔。新增全域 Edit Mode 與 EditModeControls，支援 Navbar、Footer、Blog 標題、Projects 介紹與 Forum 主視覺的即時編輯。後端則調整 UserProgress schema、修正 slug/UUID 寫入問題與設定級聯刪除，讓進度資料更準確也更易維護。

## v3.3.1 - Layout Stability & Mobile UX Fixes (2025-11-25)

* **fix**:

  * 這一版主要是「體驗修補與視覺穩定」。全站調整 overflow 與水平捲動設定，修補多個頁面的橫向捲軸問題；調整 Navbar Logo 在小螢幕的排版與 hover 效果，讓導覽列更清晰；優化 AI Tutor 的氣泡換行與 MDX 圖片/SVG 的排版，避免被撐爆或變形。這些看似細節的修正，大幅提升整體介面專業度與可用性。

---

## v4.0.0 - Interactive UI, RWD Grid & Auth Overhaul (2025-11-26)

* **feat**:

  * 這一版是體驗面的大型改版，把平台從「能用」提升到「有質感、可長期展示」。導入 InteractiveGridPattern 與科技感背景，設計統一的 RWD 網格規則並套用 glassmorphism 卡片，讓首頁與關鍵頁面看起來像成熟產品。同時重構登入與註冊流程，加入 OAuth onboarding 與粒子背景，提升新用戶第一次進站的理解與信任感，並針對行動裝置修正多項側邊欄與遮罩問題。

## v4.0.1 - Touch Performance & Admin Editing (2025-11-26)

* **perf**:

  * 這一版聚焦在「觸控裝置效能與可編輯性」。在手機與平板上關閉跟隨滑鼠的重運算背景效果，改用 tap ripple 作為互動回饋，顯著降低 GPU 和 CPU 負擔。同步優化 Admin Editor 的捲動與工具列固定方式，避免在小螢幕上無法看到完整編輯區或工具被捲出畫面，使內容維護在各種裝置上都實際可用。

---

## v4.1.0 - MDX Stability & Visual Refinement (2025-11-27)

* **fix**:

  * 這一版針對「內容 rendering 偶爾炸掉、視覺仍不夠成熟」的問題做系統性修正。為 MDX 渲染加上額外錯誤保護與預設 wrapper，處理自訂元件與 raw code 混用的極端情況，避免一段錯誤內容拉垮整頁。同步微調暗色配色、文字顏色與 code block 對比，調整課程與 Blog 列表的間距和陰影，讓長時間閱讀更舒適，也讓畫面層次更清楚。

---

## v4.2.0 - Navigation Intelligence & Tutor Upgrade (2025-11-28)

* **feat**:

  * 這一版解決「學生回來後不知道要接著學哪裡」與「AI 助教缺乏導學能力」的問題。重構課程側邊欄與 Dashboard「繼續學習」區，讓系統根據完成度與章節重要性建議下一步學習目標，而非僅僅線性下一節。AI Tutor 則升級為可切換不同模式、理解目前課程上下文的助教，讓問答過程更貼近真實家教而不是單純聊天機器人。

---

## v4.3.0 - Smart Quiz Core & Mobile Navigation (2025-11-29)

* **feat**:

  * 這一版把測驗從「單純生成題目」推進到「真正會看你學到哪裡」。導入 Smart Quiz 出題演算法，綜合考量已讀章節、尚未覆蓋內容與題目多樣性，避免重複出相同類型的題目。同時重構 LessonPage server/client 分工與 sectionsMetadata 計算，使測驗能精準對應內容段落，並微調行動端底部導覽列與側邊欄滑動行為，讓手機使用者在練習時也保持操作順暢。

## v4.3.1 - Quiz JSON & State Resilience (2025-11-29)

* **fix**:

  * 這一版主要強化測驗在「有 LaTeX 與特殊字元時不會炸掉」。修正 AI 測驗 JSON 序列化與反序列化邏輯，處理反斜線與數學符號，避免解析失敗或題目內容被截斷。同步改善測驗狀態在重新整理與頁面切換後的恢復機制，降低學生答題到一半意外失去進度的風險，讓 Smart Quiz 在真實使用情境下更可靠。

---

## v5.0.0 - Real-Time Lesson State & Smart Resume (2025-11-30)

* **feat**:

  * 這一版是「學習狀態體驗」的大改版，把進度更新從延遲幾秒變成幾乎即時。導入 LessonProgressContext 與 Provider，讓課時狀態由 client 主導、server 同步，並明確定義 IN_PROGRESS 與 REVIEWING 模式，確保 COMPLETED 永遠不會被 API 意外降級。Resume Learning 按鈕也經過重設，會從真實最新進度計算最合理的下一課，讓學生回來不再迷路。

## v5.0.1 - Time Tracking Accuracy & Stability (2025-11-30)

* **fix**:

  * 這一版專注在「學習時間會被吃掉或算錯」的問題。將 ResumeLearningTracker 改為以前端累計加上週期性同步，後端 API 也改為使用累加邏輯而非覆寫，避免在多分頁或網路抖動下 timeSpent 被倒扣或重設。加入 userId/session 取得失敗時的 fallback 機制，確保在登入延遲、關閉分頁或連線中斷時，時間紀錄的行為清楚且可預期。

## v5.1.0 - DB Cleanup & Visual Final Polish (2025-11-30)

* **refactor**:

  * 這一版是這輪衝刺的總整理與收尾。清除 UserProgress 中已棄用的 completed 布林欄位，統一改用 status enum 與 slug 為主鍵，簡化進度與時間查詢邏輯，降低未來維護成本。視覺上則完成 Dashboard「繼續學習」卡片、背景 grid、粒子背景與按鈕樣式等最後一輪打磨，讓整個平台在功能與外觀上都達到可以對外展示與長期營運的品質水準。

---

## v5.2.0 - Gamification, Command Palette & Public Profile (2025-12-01)

* **feat**:

  * 這一版是「互動與個人化」的重大升級。新增 Command Palette (Cmd+K)，提供全站快速導航與搜尋，讓使用者能瞬間跳轉至任何課程或功能。導入完整的遊戲化系統 (Gamification)，包含 XP 經驗值、等級與每日學習連續紀錄 (Streak)，並在 Dashboard 顯著展示，提升學習動力。同時推出公開個人檔案 (Public Profile)，展示使用者的等級、徽章與完課證書，讓學習成就能夠被看見與分享。

## v5.2.1 - Dynamic XP & Syntax Hardening (2025-12-01)

* **feat**:

  * 這一版解決「XP 計算過於死板」與「程式碼語法錯誤」的問題。實作動態 XP 計算邏輯 (Dynamic XP)，根據課程內容長度與難度自動計算經驗值，並在前端即時顯示預估獎勵，讓學習回饋感更真實。同時修復了 `AIQuizGenerator` 與 `LessonContent` 中因編輯失誤造成的語法損壞，並將 XP 邏輯抽離為共用模組，確保前後端計算一致且穩定。此外，新增了 Canvas Confetti 慶祝動畫與課程列表的 XP 標籤，大幅提升完成課程時的成就感與視覺回饋。針對已完成或複習中的課程，XP 獎勵調整為原來的 1/10，以平衡遊戲化機制。
  * 優化 Command Palette (`Ctrl + K`) 的導航體驗，新增了層級過濾功能，現在輸入路徑時會依序推薦下一層級的內容 (課程 -> 單元 -> 章節)，並支援搜尋課程內的章節標題 (Sections)。
  * 新增「完善個人資料」流程 (`OnboardingModal`)，針對使用 Google/GitHub 登入的新用戶，自動跳出視窗引導填寫「職業」與「主修」資訊，確保所有用戶資料完整，以便提供更個人化的學習體驗。
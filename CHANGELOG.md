## v5.5.1 - Feedback System & Avatar Fixes (2025-12-11)

* **feat**:
  * **Feedback System**: 實作完整的意見回饋系統。使用者可透過右下角 FAB 傳送包含截圖的回報，並自動儲存至資料庫。
  * **Admin Feedback**: 新增 Admin Feedback 頁面 (`/admin/feedback`)，管理員可查看、篩選並處理使用者的回報內容。
  
* **fix**:
  * **Profile Avatar**: 修正個人頁面頭像路徑錯誤的問題，將 GitHub 與 Google 圖片網域加入白名單。
  * **Feedback Screenshot**: 修正回饋截圖時文字與圖片偏移的問題 (html2canvas scroll offset fix)。

## v5.5.0 - Lesson Completion & Context Awareness Fixes (2025-12-10)

* **fix**:
  * **Lesson Completion**: 修正課程完成觸發機制 (`useEffect` missing)，現在捲動到底部能正確觸發完成狀態與 confetti 特效，並修復了 "Reading too fast" 的防刷機制。
  * **Status Persistence**: 修正 `REVIEWING` 與 `COMPLETED` 狀態無法正確儲存至資料庫的 API 問題，確保學習進度不會因重新整理而回溯。
  * **Context-Aware Panel**:
    * **Review Mode**: 解除 Context Panel 在複習模式下的限制，現在即使課程已完成，AI 也能針對目前閱讀的章節出題。
    * **Chinese Heading Support**: 修正後端 Quiz 演算法的 normalization 邏輯，現在能正確辨識中文標題，解決 "總是抓到第一章" 的問題。
    * **Reverted Logic**: 恢復 v5.2.0 的 "In-Progress" 模式邏輯，確保學習中僅測試當前標題以前的內容；複習模式則測試全課程。

* **ui**:
  * **Deep Blue Theme**: 將 Blog Card 與 Post Header 背景調整為深藍色 (`#0B1120`)，提升閱讀質感。
  * **Interaction**: 加快 Blog 與 Project 頁面的點擊漣漪效果 (Ripple Effect) 速度 (3x)，讓回饋更即時。
  * **Completion Trigger**: 恢復 v5.2.0 的 "Slide to Quiz" 觸發邏輯，滑動至測驗卡片即自動標記完成 (IntersectionObserver)。
  * **Anti-Cheat Timer**: 改進計時邏輯：首次學習需閱讀預估時間的 100%，複習模式 (`Reviewing`) 需閱讀 50% 方可完成。
  * **Hybrid AI Client**: 升級至 **Groq** 最新模型列表 (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`, `gemma2-9b-it`)。若無 Groq Key 則自動降級回 Google API，並解決了舊版模型 (gemma-7b) 導致的 400 錯誤。

## v5.4.5 - Theme Overhaul & UI Refinement (2025-12-09)

* **refactor(ui)**: 
  * **Themes 2.0 Refined**: 移除所有淺色系主題 (Light/Sepia)，專注打造極致深色模式體驗。新增 `Midnight` (純黑), `Forest` (深綠), `Amethyst` (暗紫)，保留 `Navy` 與 `Default`。
  * **UI Optimization**: 
    * **Global FAB Integration**: 將外觀設定按鈕整合至全域 **FloatingActionGroup** (扳手選單)，移除重複的懸浮按鈕，僅在課程頁面顯示 "Appearance" 選項。
    * **Desktop**: 面板介面更簡潔，移除字體選項。
    * **Mobile**: 將底部的 **字體設定 (Type)** 替換為 **主題設定 (Theme 🎨)**，與桌面版統一，點擊後開啟完整外觀面板。
  * **System**: 
    * **Universal Effects**: 解除背景特效 (Grid/Particles) 的主題限制，現在 `Midnight`, `Forest`, `Amethyst` 皆可顯示特效。
    * 強化主題遷移邏輯，確保舊版主題使用者自動切換至預設深色模式，避免視覺突兀。

## v5.4.4 - Reader Mode Overhaul (2025-12-09)

* **feat**:
  * **Theme Upgrade**: 移除 `Light` 主題，新增 `Midnight`, `Forest`, `Amethyst` 深色主題。
  * **UI Relocation**: 將外觀設定從 Header 移至右下角 FAB。
  * **Mobile UX**: 新增底部 Lesson Bar 字體大小切換功能。

## v5.4.3 - Table of Contents Theme Support (2025-12-09)

* **fix**:
  * **TOC Styling**: 修正 Table of Contents 在不同主題下的顯示問題，確保文字對比度與 Focus 狀態正確。
  * **Layout**: 優化側邊欄在行動裝置上的顯示邏輯。

## v5.4.2 - Skeleton Loading & Visual Consistency (2025-12-09)

* **refactor**:
  * **Seamless Loading**: 將 Skeleton Loading 狀態與使用者目前選擇的主題同步 (例如在 Midnight 主題下顯示深灰骨架)，消除載入時的視覺閃爍。

## v5.4.1 - Reader Mode Foundation & Contrast Fixes (2025-12-09)

* **fix**:
  * **Contrast**: 修正 Sepia 與舊版 Light 主題在特定元件上的對比度問題。
  * **Focus Mode**: 調整 Focus Mode 邏輯，預設為關閉狀態，並修正切換時的 Grid 背景行為。

## v5.4.0 - Reader Mode & Lesson Customization (2025-12-09)

* **feat**:

  * 這一版著重於提升學生的「深度閱讀體驗」。新增 Reader Mode (閱讀模式)，允許使用者自訂課程介面的外觀，包含：
    * **Focus Mode**: 一鍵切換專注模式，隱藏背景動畫與網格，減少視覺干擾。
    * **主題配色**: 提供 Dark (預設)、Light (適合日間)、Sepia (護眼復古)、Navy (深藍) 等多種配色，適應不同閱讀環境。
    * **字體大小**: 可調整文字大小 (Small/Medium/Large)，改善閱讀舒適度。
  * 系統會自動記錄使用者的偏好設定，在不同課程間無縫套用，確保一致的學習體驗。

## v5.3.3 - Admin List Refresh Fix (2025-12-09)

* **fix**:

  * 修正 Admin Panel 課程列表在切換狀態後，頁面未自動刷新的問題。加入 `router.refresh()` 確保在 API 回應成功後，會強制更新伺服器端資料緩存，讓切換頁面或重新整理時能顯示正確的最新狀態。

## v5.3.2 - Course Editor Visibility Toggle (2025-12-09)

* **feat**:

  * 在「課程編輯器」(Edit Course Details Modal) 中新增 Published/Hidden 狀態切換功能。現在管理員不需跳回列表，也能在編輯課程詳細資料時直接控制課程的可見狀態，並確保設定會立即儲存生效。

## v5.3.1 - Admin Sync Fix (2025-12-09)

* **fix**:

  * 修正 Admin Panel 課程列表無法正確顯示 Hidden 課程的問題。將資料讀取邏輯從公開 API 改為直接讀取資料庫，確保管理員能看到所有狀態的課程，並正確同步 `Published/Hidden` 狀態。

## v5.3.0 - Admin Improvements: Visibility & Manual Quiz (2025-12-09)

* **feat**:

  * 這一版針對「課程管理靈活性與測驗可靠度」進行強化。新增課程隱藏/公開功能 (Visibility Toggle)，讓管理員能隨時控制課程的上下架狀態。
  * 實作完整的 Admin Lesson Q&A 系統，在課程編輯器中新增 Quiz 分頁，允許手動建立與編輯測驗題庫。這些題目會作為 AI 生成失敗時的 Fallback 機制，確保學生永遠有題目可練習，大幅提升系統穩定性。

## v5.2.7 - 2025-12-01

### 🧠 Smart Gamification & Logic Fixes
- **Dynamic Lesson Timer**: Replaced the fixed 10s timer with a smart check requiring **50% of the estimated reading time** (min 30s) to prevent XP farming.
- **Review XP Enforced**: Restored Review XP (1/10th base XP) but enforced the same dynamic time check for reviews to ensure genuine engagement.
- **Certificate Fix**: Resolved a bug where lessons in `REVIEWING` status were ignored, now correctly counting them towards course completion and certificate generation.
- **Badge Seeding**: Added automatic seeding to ensure all badge definitions exist in the database, fixing the issue where badges weren't being awarded.
- **Streak Badge Fix**: Updated logic to check for streak badges whenever the streak is sufficient (>= 7), not just when it increments, ensuring missed badges are awarded.
- Badge Debugging: Added detailed server-side logging for badge events to help diagnose triggering issues.

## v5.2.6 - 2025-12-01

### 🐛 Fixes & Improvements
- **Profile Page**: Fixed 404 error by updating the user lookup logic to support querying by ID first, then Name.
- **Lesson Content**:
  - Implemented a **10-second anti-cheat timer** for lesson completion.
  - Removed the "+100 XP Bonus" text from the completion button to avoid confusion.
- **Quiz XP**:
  - Unified Quiz XP to a flat **10 XP** per question.
  - Centered the "Win 10 XP" badge in the QuizTab header.

## v5.2.5 - 2025-12-01

### 🏆 Gamification & Certificates
- **Course Certificates**: Implemented automatic certificate generation upon course completion, awarding a **+100 XP Bonus** with a celebratory confetti effect.
- **Projects UI**: Added a "Completed" badge to project cards and a persistent "XP Earned" message to the completion button.
- **Dashboard XP**: Fixed the "XP to next level" calculation and the progress bar layout to accurately reflect user progression.

## v5.2.4 - 2025-12-01

### 🎨 UX & Design
- **Profile Background**: Added a unique "Circuit Board" particle effect to the user profile page for a more immersive experience.
- **Quiz Tab Layout**: Improved the header layout to prevent the "Win XP" badge from overlapping with the title.

### ⚖️ Gamification Balance
- **XP Balancing**: Unified Quiz XP to **10 XP** per question for both Lesson Quizzes and AI Tutor Quizzes.
- **Review Penalty**: Adjusted the XP penalty for reviewing completed lessons to 50% (was 90%), making practice more rewarding (5 XP).
- **Badge Logic**: Implemented "Quiz Whiz" badge triggering for perfect quiz scores.

## v5.2.3 - Command Palette & Badge UX (2025-12-01)

* **feat**:

  * 這一版大幅增強 Command Palette (`Ctrl + K`) 功能：
    * 修正導航層級邏輯，現在支援模糊搜尋與自動層級切換，解決了輸入完整名稱後推薦消失的問題。
    * 實作「無限層級」導航，可順暢地從課程 -> 單元 -> 章節進行深入檢索。
    * 整合全域搜尋功能，即使在導航模式下也能快速找到目標內容。
  * 優化個人頁面 (`/u/[username]`)：
    * 移除不必要的 "Earth" 地點顯示。
    * 全面升級徽章 (Badges) 系統：
      * 新增徽章等級 (Gold, Silver, Bronze) 與對應的視覺效果。
      * 顯示所有可用徽章，未獲得的徽章會以「鎖定」狀態呈現。
      * 點擊鎖定的徽章可查看獲取條件與說明。
  * 優化 `QuizTab` (AI Tutor)：
    * 在標題旁顯示「Win 15 XP」標籤，明確告知獎勵。
    * 答對問題後，除了獲得 XP，還會顯示 Toast 通知確認獎勵與升級資訊。

## v5.2.2 - Gamification Polish & Profile Features (2025-12-01)

* **feat**:

  * 這一版針對遊戲化與個人頁面進行深度打磨。優化個人頁面 (`/u/[username]`) 的 XP 進度條顯示，現在會正確計算並顯示「當前等級進度」而非總經驗值，讓升級目標更明確 (例如：80/500 XP)。同時新增「編輯個人資料」功能，允許用戶修改職業與主修資訊。
  * 實作完整的徽章 (Badges) 與證書 (Certificates) 系統。現在完成課程會自動頒發證書，達成特定條件 (如首堂課、7日連勝、等級5) 會自動解鎖徽章。
  * 修正 `QuizTab` (AI Tutor) 的 XP 獎勵機制，現在答對問題會給予經驗值回饋。
  * 修正 `QuizCard` (AI Quiz Generator) 的 XP 顯示差異，現在會根據課程是否已完成，正確顯示預估獲得的 XP (已完成課程為 1/10)。

## v5.2.1 - Dynamic XP & Syntax Hardening (2025-12-01)

* **feat**:

  * 這一版解決「XP 計算過於死板」與「程式碼語法錯誤」的問題。實作動態 XP 計算邏輯 (Dynamic XP)，根據課程內容長度與難度自動計算經驗值，並在前端即時顯示預估獎勵，讓學習回饋感更真實。同時修復了 `AIQuizGenerator` 與 `LessonContent` 中因編輯失誤造成的語法損壞，並將 XP 邏輯抽離為共用模組，確保前後端計算一致且穩定。此外，新增了 Canvas Confetti 慶祝動畫與課程列表的 XP 標籤，大幅提升完成課程時的成就感與視覺回饋。針對已完成或複習中的課程，XP 獎勵調整為原來的 1/10，以平衡遊戲化機制。
  * 優化 Command Palette (`Ctrl + K`) 的導航體驗，新增了層級過濾功能，現在輸入路徑時會依序推薦下一層級的內容 (課程 -> 單元 -> 章節)，並支援搜尋課程內的章節標題 (Sections)。
  * 新增「完善個人資料」流程 (`OnboardingModal`)，針對使用 Google/GitHub 登入的新用戶，自動跳出視窗引導填寫「職業」與「主修」資訊，確保所有用戶資料完整，以便提供更個人化的學習體驗。
  * 修正課程完成按鈕的顯示邏輯，當課程已完成或處於複習狀態時，不再顯示「+100 XP Bonus」字樣，並將按鈕文字改為「Return to Course」，避免誤導用戶。

## v5.2.0 - Gamification, Command Palette & Public Profile (2025-12-01)

* **feat**:

  * 這一版是「互動與個人化」的重大升級。新增 Command Palette (Cmd+K)，提供全站快速導航與搜尋，讓使用者能瞬間跳轉至任何課程或功能。導入完整的遊戲化系統 (Gamification)，包含 XP 經驗值、等級與每日學習連續紀錄 (Streak)，並在 Dashboard 顯著展示，提升學習動力。同時推出公開個人檔案 (Public Profile)，展示使用者的等級、徽章與完課證書，讓學習成就能夠被看見與分享。

---

## v5.1.0 - DB Cleanup & Visual Final Polish (2025-11-30)

* **refactor**:

  * 這一版是這輪衝刺的總整理與收尾。清除 UserProgress 中已棄用的 completed 布林欄位，統一改用 status enum 與 slug 為主鍵，簡化進度與時間查詢邏輯，降低未來維護成本。視覺上則完成 Dashboard「繼續學習」卡片、背景 grid、粒子背景與按鈕樣式等最後一輪打磨，讓整個平台在功能與外觀上都達到可以對外展示與長期營運的品質水準。

## v5.0.1 - Time Tracking Accuracy & Stability (2025-11-30)

* **fix**:

  * 這一版專注在「學習時間會被吃掉或算錯」的問題。將 ResumeLearningTracker 改為以前端累計加上週期性同步，後端 API 也改為使用累加邏輯而非覆寫，避免在多分頁或網路抖動下 timeSpent 被倒扣或重設。加入 userId/session 取得失敗時的 fallback 機制，確保在登入延遲、關閉分頁或連線中斷時，時間紀錄的行為清楚且可預期。

## v5.0.0 - Real-Time Lesson State & Smart Resume (2025-11-30)

* **feat**:

  * 這一版是「學習狀態體驗」的大改版，把進度更新從延遲幾秒變成幾乎即時。導入 LessonProgressContext 與 Provider，讓課時狀態由 client 主導、server 同步，並明確定義 IN_PROGRESS 與 REVIEWING 模式，確保 COMPLETED 永遠不會被 API 意外降級。Resume Learning 按鈕也經過重設，會從真實最新進度計算最合理的下一課，讓學生回來不再迷路。

---

## v4.3.1 - Quiz JSON & State Resilience (2025-11-29)

* **fix**:

  * 這一版主要強化測驗在「有 LaTeX 與特殊字元時不會炸掉」。修正 AI 測驗 JSON 序列化與反序列化邏輯，處理反斜線與數學符號，避免解析失敗或題目內容被截斷。同步改善測驗狀態在重新整理與頁面切換後的恢復機制，降低學生答題到一半意外失去進度的風險，讓 Smart Quiz 在真實使用情境下更可靠。

## v4.3.0 - Smart Quiz Core & Mobile Navigation (2025-11-29)

* **feat**:

  * 這一版把測驗從「單純生成題目」推進到「真正會看你學到哪裡」。導入 Smart Quiz 出題演算法，綜合考量已讀章節、尚未覆蓋內容與題目多樣性，避免重複出相同類型的題目。同時重構 LessonPage server/client 分工與 sectionsMetadata 計算，使測驗能精準對應內容段落，並微調行動端底部導覽列與側邊欄滑動行為，讓手機使用者在練習時也保持操作順暢。

---

## v4.2.0 - Navigation Intelligence & Tutor Upgrade (2025-11-28)

* **feat**:

  * 這一版解決「學生回來後不知道要接著學哪裡」與「AI 助教缺乏導學能力」的問題。重構課程側邊欄與 Dashboard「繼續學習」區，讓系統根據完成度與章節重要性建議下一步學習目標，而非僅僅線性下一節。AI Tutor 則升級為可切換不同模式、理解目前課程上下文的助教，讓問答過程更貼近真實家教而不是單純聊天機器人。

---

## v4.1.0 - MDX Stability & Visual Refinement (2025-11-27)

* **fix**:

  * 這一版針對「內容 rendering 偶爾炸掉、視覺仍不夠成熟」的問題做系統性修正。為 MDX 渲染加上額外錯誤保護與預設 wrapper，處理自訂元件與 raw code 混用的極端情況，避免一段錯誤內容拉垮整頁。同步微調暗色配色、文字顏色與 code block 對比，調整課程與 Blog 列表的間距和陰影，讓長時間閱讀更舒適，也讓畫面層次更清楚。

---

## v4.0.1 - Touch Performance & Admin Editing (2025-11-26)

* **perf**:

  * 這一版聚焦在「觸控裝置效能與可編輯性」。在手機與平板上關閉跟隨滑鼠的重運算背景效果，改用 tap ripple 作為互動回饋，顯著降低 GPU 和 CPU 負擔。同步優化 Admin Editor 的捲動與工具列固定方式，避免在小螢幕上無法看到完整編輯區或工具被捲出畫面，使內容維護在各種裝置上都實際可用。

## v4.0.0 - Interactive UI, RWD Grid & Auth Overhaul (2025-11-26)

* **feat**:

  * 這一版是體驗面的大型改版，把平台從「能用」提升到「有質感、可長期展示」。導入 InteractiveGridPattern 與科技感背景，設計統一的 RWD 網格規則並套用 glassmorphism 卡片，讓首頁與關鍵頁面看起來像成熟產品。同時重構登入與註冊流程，加入 OAuth onboarding 與粒子背景，提升新用戶第一次進站的理解與信任感，並針對行動裝置修正多項側邊欄與遮罩問題。

---

## v3.3.1 - Layout Stability & Mobile UX Fixes (2025-11-25)

* **fix**:

  * 這一版主要是「體驗修補與視覺穩定」。全站調整 overflow 與水平捲動設定，修補多個頁面的橫向捲軸問題；調整 Navbar Logo 在小螢幕的排版與 hover 效果，讓導覽列更清晰；優化 AI Tutor 的氣泡換行與 MDX 圖片/SVG 的排版，避免被撐爆或變形。這些看似細節的修正，大幅提升整體介面專業度與可用性。

## v3.3.0 - Admin CMS, Edit Mode & User Progress (2025-11-25)

* **feat**:

  * 這一版讓平台從「工程師才能改內容」進化到「可以用後台與 inline 編輯維護」。擴充 Admin CMS，完成 Courses/Projects CRUD，讓課程與專案改用系統管理而非手動改檔。新增全域 Edit Mode 與 EditModeControls，支援 Navbar、Footer、Blog 標題、Projects 介紹與 Forum 主視覺的即時編輯。後端則調整 UserProgress schema、修正 slug/UUID 寫入問題與設定級聯刪除，讓進度資料更準確也更易維護。

---

## v3.2.1 - AI Quiz Hardening & MDX Safety (2025-11-24)

* **fix**:

  * 這一版專門處理「AI 測驗與 MDX 易壞」的痛點。修正 slug 與 UUID 混用造成的外鍵錯誤與 404，為 Prisma P2003 等錯誤補上保護，避免 session 過期時整個 API 崩潰。針對 AI 測驗，加入上下文長度限制與回退策略，當 LLM 失敗時可退回手動題庫；同時在處理論壇貼文與內嵌 code 時加上 try/catch 與自動包裝成 code block，避免單一不合法內容就讓整頁爆炸。

## v3.2.0 - Schema Refinement & LaTeX Everywhere (2025-11-24)

* **refactor**:

  * 這一版著重在「資料結構整理與公式顯示普及」。調整 BlogPost 與 Course schema，移除不再使用的欄位並加入 image、duration 等更貼近實際呈現需求的資料；在 Blog、Project、Lesson 中統一加入 videoUrl 支援影音內容。AI 測驗 API 被強化為可一次讀取大段章節內容，並在全站導入 LaTeX 顯示，確保不論在哪個頁面都可以穩定呈現工程公式。

---

## v3.1.1 - Dashboard & Time Tracking Foundation (2025-11-23)

* **feat**:

  * 這一版補齊「看不到自己學了多少」的缺口。設計學習時間紀錄機制與 Dashboard 顯示邏輯，計算每門課與每個學生的累計學習時數，並將 Dashboard 改成 dynamic render，避免 Prisma cache 導致資料顯示延遲。學生從此可以看到更具體的時間投入，平台也有基礎數據支撐後續學習分析功能。

## v3.1.0 - Markdown, LaTeX & Manual Quiz Support (2025-11-23)

* **feat**:

  * 這一版解決「工程內容無法完整呈現」與「測驗過度依賴 LLM」的問題。導入 react-markdown、remark-gfm、remark-math、rehype-katex 等工具，讓課程與 Blog 可以安全顯示表格與 LaTeX 公式，支援工程數學與電路推導。新增 QuizQuestion 資料表與手動題庫機制，確保在 LLM 出錯或無回應時仍有穩定題目可用，提升課程品質控制能力。

## v3.0.0 - LLM Assignments, Real LLM & DB Migration (2025-11-23)

* **feat**:

  * 這一版把平台從「有課程、有會員」推進到「能靠 AI 幫忙練習與產生題目」的階段。新增 LLM-assisted Assignment 流程與 VerificationPanel，讓學生在每個章節結束後透過 AI 小測驗檢查理解，還可標記 AI 解說錯誤並分享到論壇。後端則正式改用 OpenRouter 等真實 LLM，並把核心資料遷移到 PostgreSQL/Prisma，建立 User、Course、Lesson、UserProgress 等 schema，使整個系統從原本偏 prototype 的檔案型內容，升級成可營運的資料庫式產品。

---

## v2.0.1 - System Recovery & LLM Feature Cleanup (2025-11-22)

* **refactor**:

  * 這一版專注在修補前幾天 LLM 試驗造成的技術債。回復或重建 Tailwind 設定、清理破壞 build 的 TypeScript 型別錯誤與未使用 import，並暫時移除不穩定的 AIQuizGenerator、AITutor 等元件，只留下未來可重用的架構。目標是讓專案恢復到「可以正常開發與部署」的狀態，而不被半成品的 AI 功能拖著走。

## v2.0.0 - Auth, Membership & Forum Foundation (2025-11-22)

* **feat**:

  * 這一版是平台第一次「能力躍遷」，從純內容網站升級成有會員與社群的學習系統。導入 NextAuth.js + Prisma/SQLite，完成註冊、登入與 session 流程，建立 Forum 的 Post/Comment 模型與 API，並實作列表、詳情與留言介面。學生不再只是「看文章」，而是可以登入、發文、留言，分享錯誤觀念與解題心得，為之後所有互動式教學奠定基礎。

---

## v1.1.1 - Env & Day1 Design Decisions (2025-11-21)

* **fix**:

  * 這一版針對「開發環境不穩、規格分散」的問題進行修補。修正本機無法偵測 Node.js 的狀況，調整 PowerShell 政策與環境變數，讓 `node -v`、npm 及 dev server 都能穩定運作。同時整理 Day 1 的所有設計決策與課程路線圖，寫成文件與日誌，避免日後忘記當初的技術與產品取捨，確保團隊在同一套規格上前進。

## v1.1.0 - App Skeleton & Content Engine (2025-11-20)

* **feat**:

  * 這一版補上「缺乏穩定程式骨架與內容管線」的問題。初始化 Next.js App Router 專案，設定 TypeScript 與 Tailwind 主題，實作 Navbar、Footer 與首頁 Hero，並導入 MDX 內容引擎與課程播放器頁面結構。從此課程、Blog、專案都能透過統一的 MDX 管線管理，為之後真正塞入教學內容打好技術地基。

## v1.0.0 - Platform Inception & Vision (2025-11-19)

* **feat**:

  * 這一版主要解決「沒有明確產品定位與教學路線圖」的問題。定義四級學習族群與平台願景，拉出從入門到專業的完整路徑，同時設計網站地圖與資訊架構，涵蓋首頁、課程、部落格、專案與未來後台，確保後續所有功能、內容與 UI 決策都有一套穩定且可長期擴充的藍圖。
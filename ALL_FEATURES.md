# EE Master 電子學互動學習平台 - 全功能清單 (Full Feature List)

本文件詳列 EE Master 平台截至 v5.2.7 版本的所有功能模組，涵蓋學習系統、AI 整合、遊戲化機制、社群互動與後台管理等五大面向。

---

## 1. 核心學習系統 (Core Learning System)

*   **結構化課程架構 (Structured Curriculum)**
    *   支援多層級課程索引：課程 (Course) -> 單元 (Unit) -> 章節 (Lesson)。
    *   **Smart Resume (智慧續看)**：首頁自動計算並推薦「下一步」學習內容，而非僅跳轉至最後瀏覽頁面。
    *   **即時進度追蹤 (Real-time Progress)**：
        *   精確記錄 `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`, `REVIEWING` 四種狀態。
        *   **Dynamic Lesson Timer**：防刷分機制，要求停留時間達預估閱讀時間 50% 字才算完成。
*   **專業內容呈現 (Content Rendering)**
    *   **MDX 內容引擎**：支援 React 元件嵌入 Markdown 文章。
    *   **LaTeX 工程數學支援**：整合 `remark-math/rehype-katex`，完美顯示微積分、馬克士威方程組等複雜公式。
    *   **多媒體整合**：支援 YouTube 影片嵌入、響應式圖片、電路圖顯示。
    *   **程式碼高亮**：支援多種程式語言 (Python, C++, Verilog) 的語法高亮顯示。
*   **實作導向模組**
    *   **Projects (實作專案)**：獨立的專案頁面，包含 BOM 表、電路圖與步驟教學。
    *   **Engineering Blog (技術專欄)**：分類明確的技術文章，支援深度閱讀。

## 2. 智慧化與 AI 輔助 (AI & Intelligence)

*   **AI Tutor (智慧助教)**
    *   **Context-Aware Chat**：聊天機器人能讀取當前 Lesson 內容，提供針對性的回答。
    *   **即時問答面板**：位於課程頁面右側/底部，支援隨時呼叫。
*   **AI Quiz Generator (智慧測驗生成器)**
    *   **自動出題**：完成章節後，AI 自動根據內容生成多選題 (MCQ)。
    *   **Verification Panel (檢核機制)**：學生可檢視 AI 解釋，若發現錯誤可標記並修正。
    *   **多樣性演算法**：Smart Quiz 邏輯避免重複出題，優先針對未熟練的觀念。
    *   **Fallback 機制**：當 LLM 連線失敗時，自動退回手動題庫，確保功能可用。

## 3. 遊戲化與激勵機制 (Gamification)

*   **XP 經驗值系統**
    *   **Dynamic XP**：根據課程長度與難度動態計算經驗值 (e.g., 閱讀 10-50 XP, 測驗 10 XP/題)。
    *   **Review Penalty**：複習已完成課程僅獲得 1/10 經驗值，平衡遊戲機制。
*   **Streak (連勝紀錄)**
    *   **每日簽到**：追蹤連續學習天數，顯示於 Dashboard 火焰圖示。
    *   **Streak Recovery**：(規劃中) 允許使用凍結卡補簽。
*   **成就與獎勵**
    *   **Badges (徽章系統)**：達成特定條件自動解鎖 (如：首堂課、7日連勝、等級達標)。
    *   **Leveling (等級爬升)**：累積 XP 提升等級，個人頁面顯示進度條。
    *   **Certificates (完課證書)**：完成課程 100% 進度後自動頒發數位證書。
    *   **Confetti Effect**：達成里程碑 (升級、完課) 時的慶祝特效。

## 4. 社群與互動 (Community & Social)

*   **會員系統 (Membership)**
    *   **多元登入**：支援 Email/Password, Google OAuth, GitHub OAuth。
    *   **Onboarding Flow**：新用戶引導流程，建立職業與主修資料。
*   **Public Profile (公開個人檔案)**
    *   展示個人簡介、等級、獲得徽章與證書牆。
    *   **Edit Profile**：允許使用者修改個人職業、主修與簡介。
*   **Discussion Forum (討論區)**
    *   **Post & Comment**：支援 Markdown 格式的發文與留言功能。
    *   **AI Correction Sharing**：一鍵將 AI 測驗的勘誤分享至論壇。
    *   **權限管理**：特定職位或主修享有工程師發文標章；作者可刪除自己的文章。

## 5. 使用者體驗與介面 (UX / UI Design)

*   **現代化視覺風格**
    *   **Glassmorphism**：全站採用毛玻璃特效卡片設計。
    *   **Interactive Grid & Particles**：背景採用互動式網格與粒子特效。
    *   **RWD 響應式設計**：針對 Mobile/Tablet/Desktop 最佳化排版。
*   **高效率導航**
    *   **Command Palette (Cmd+K)**：全站模糊搜尋，支援課程、章節、設定的無限層級跳轉。
    *   **Sticky Sidebar / TOC**：課程目錄與文章大綱隨捲動固定。
*   **Admin CMS (後台管理)**
    *   **Global Edit Mode**：管理員可開啟全域編輯模式，直接在前端修改內容。
    *   **資源管理**：Courses, Projects, Blog, Users 的 CRUD 介面。
    *   **Auto-Slug**：內容建立時自動生成網址 Slug。

## 6. 技術架構 (Technical Architecture)

*   **核心框架**：Next.js 14 App Router, TypeScript, Tailwind CSS.
*   **資料層**：PostgreSQL, Prisma ORM.
*   **效能優化**：
    *   **Partial Prerendering (PPR)**：(準備中) 靜態骨架與動態內容分離。
    *   **Optimistic Updates**：XP 與 UI 狀態前端優先更新，提供零延遲體驗。

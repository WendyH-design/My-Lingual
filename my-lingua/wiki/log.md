# My Lingual 操作日誌（Operation Log）

本檔案依據 `AGENTS.md` 規範記錄知識庫歷次重要異動。
*（註：本檔案僅在 `Ingest` 匯入與經授權之 `Lint Fix` 修復時追加紀錄；`Query` 與預設 `Lint` 保持唯讀不寫入）*

---

## 2026-11-13
- **初始化專案**：
  - 建立專案骨架與目錄結構（`incoming/`, `wiki/`, `data/`, `css/`, `js/`, `images/`, `references/`）。
  - 設定 `wiki/` 為 Obsidian Vault 根目錄。
  - 建立初始 `data/knowledge.json` 索引檔（schema_version: 1, items: 0）。
  - 建立根目錄 `.gitignore`，隔離 `/incoming/` 原始教材資料夾。

### 2026-11-13 (Ingest 第一輪資料匯入)
- **執行任務**：第一輪知識資料匯入（Ingest）。
- **新增來源**：4 份來源筆記（英文 2 份、德文 2 份）。
- **新增詞彙**：共 74 則（英文 12 則、德文 62 則）。
  - 英文詞彙（12 則）：a long time coming, false dawn, space, breakthrough, prime, promise, generation, fill a void, such and such, hear something on the grapevine, break down stereotypes, lively。
  - 德文詞彙（62 則）：Bank, bitte, Büro, Bus, Computer, E-Mail, Familie, Flughafen, Gitarre, Hobby, Hotel, Information, Kaffee, Kein Problem, Kino, Konzert, Kultur, Museum, Musik, okay, Pilot, Pilotin, Pizza, Problem, Restaurant, Sport, Student, Studentin, studieren, Supermarkt, Taxi, Telefon, Theater, Toilette, Universität, Zentrum, informell, formell, auch, Beispiel, danke, Es geht mir gut., Es ist 09:00 Uhr., gut, Guten Abend, Guten Morgen, Guten Tag, Hallo, Hey, Hi, Mann, nicht, nicht so gut, oder, schön, sehr gut, super, und, Und dir?, Und Ihnen?, Wie geht es dir?, Wie geht es Ihnen?。
- **特殊詞彙暫緩建立（4 則）**：Spaghetti（僅複數名詞，現行 schema 缺少 Pluraletantum 支援）、Uhr（原始材料未提供冠詞）、Frau（稱謂與名詞複合用法）、Herr（僅正式稱謂無名詞冠詞）。
- **衍生索引同步**：已根據所有最新 Markdown 頁面重新彙總生成 `data/knowledge.json`（共 74 筆項目）。
- **索引同步**：已更新 `wiki/index.md` 完整連結列表。


### 2026-11-13 (Ingest 專案擴充性測試)
- **執行任務**：英文詞彙匯入（Ingest 專案擴充性測試素材：incoming/ingest_test_meticulous.md）。
- **操作類型**：新增（New）。
- **新增來源**：無（使用者提供教學測試素材，無外部來源筆記，遵守非虛構原則）。
- **新增詞彙**：共 1 則。
  - 英文詞彙（1 則）：meticulous（Stable ID: `en:meticulous`，詞性: `adj.`，釋義: 一絲不苟的；非常仔細的，例句類型: `ai_generated`）。
- **詞庫規模**：
  - 英文：12 → 13 則
  - 德文：維持 62 則
  - 全庫：74 → 75 則
- **衍生索引同步**：已根據所有最新 Markdown 頁面重新彙總生成 `data/knowledge.json`（共 75 筆項目）。
- **索引同步**：已更新 `wiki/index.md` 英文分類導覽表格與收錄統計。

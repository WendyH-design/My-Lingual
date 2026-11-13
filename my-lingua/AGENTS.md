# AGENTS.md - My Lingual 個人多語言知識庫運作規範

本文件為「My Lingual 個人多語言知識庫」的核心準則與標準作業程序（SOP）。
所有參與本專案維護、資料整理、程式開發與品質檢查的 AI Agent，必須嚴格遵守本文件之所有規範。

---

## 1. 專案願景與核心定位

1. **專案目的與核心願景**：以「**探索語言，積累智慧**」為主旨，建立一個可長期累積個人多語言學習內容的數位花園知識庫，第一階段正式支援 **English（英文）** 與 **Deutsch（德文）**，並具備未來穩健擴充新語言的能力。
2. **雙軌架構**：
   - **核心知識庫（SSOT, Single Source of Truth）**：以純 Markdown Wiki 作為唯一真實來源，專供使用者透過 Obsidian 進行深度閱讀、雙向連結與離線管理。
   - **公開展示站（Derived）**：以純靜態網站（Vanilla HTML/CSS/JavaScript）讀取由 Markdown 衍生的 `data/knowledge.json`，部署於 GitHub Pages，提供訪客高質感的瀏覽與檢索體驗。
3. **資料邊界與隱私分離**：
   - **公開知識 vs. 私人資料**：公開 GitHub Repository 僅存放具客觀學習價值的語言知識。個人學習狀態（`status`）與私人學習備註（`notes`）在第一版不發布於公開網站，亦嚴禁寫入公開 JSON。
   - **知識庫 vs. 瀏覽器操作**：單字收藏（星號 ⭐）功能純存於訪客瀏覽器的 `localStorage`，絕不回寫至 Git、Markdown 或 JSON。

---

## 2. 安全防護欄與 AI 行為守則（Guardrails）

1. **嚴禁任意刪除或覆蓋**：
   - Agent 不得任意刪除既有的 Markdown 知識頁、覆蓋原始來源紀錄，或修改與當前任務無關的檔案。
   - 既有詞彙若有新資訊，必須採用「追加（Append/Merge）」方式更新。
2. **真實性與反幻覺（Anti-Hallucination）**：
   - 絕不為了填滿欄位而編造虛假資訊。原始資料未提供之內容標註為待確認或留空。
   - **嚴禁假造來源內容或未經核對之引文**：只有在使用者提供的原始資料中確切找到該短引文時，才可標註為 `source_quote` 並提供 `source_ref`。未經核對之例句一律誠實標示為 `ai_generated`。
3. **公開版權合規與謹慎引用規範**：
   - 本專案部署於公開 GitHub Repository，**嚴禁存放第三方網站、教材或文章之完整全文、完整音訊或未授權逐字稿**。
   - 僅保留必要的最低限度短引用，並清楚標註原始來源與出處名稱。**不得將標註作者或網址視為自動取得公開使用權**。
   - 對於不確定能否公開之內容，一律優先使用自行撰寫的閱讀摘要與 AI 原創生成例句。
   - 來源筆記（`wiki/sources/`）僅保留出處名稱、原始網址、新增日期與使用者個人撰寫的重點筆記摘要。
   - 圖檔僅限本專案原創手繪之 SVG 向量素材或具備明確商業/開源公開授權之素材。
4. **操作模式與日誌約束**：
   - `Query` 工作流為**絕對唯讀**，禁止修改任何檔案，**不寫入 `wiki/log.md`**。
   - `Lint` 工作流預設為**唯讀檢查與報告**，未獲使用者明確修復指令前，禁止修改檔案，**不寫入 `wiki/log.md`**。

---

## 3. 目錄結構與檔案命名規範

### 3.1 目錄架構

```text
my-lingua/
├── AGENTS.md                  # 本規範文件（位於專案根目錄）
├── index.html                 # 根目錄公開網站入口（Portal + 動態語言瀏覽視圖）
├── css/
│   └── style.css              # 文藝學院風響應式樣式表
├── js/
│   └── app.js                 # 前端互動邏輯（視圖切換、搜尋、篩選、收藏、錯誤降級）
├── data/
│   └── knowledge.json         # 衍生索引檔（由 Markdown 自動生成，含固定結構與穩定識別碼）
├── wiki/                      # Markdown 核心知識庫（Obsidian Vault 根目錄）
│   ├── index.md               # 知識庫總導覽地圖（MOC）
│   ├── log.md                 # 異動日誌（僅在 Ingest 與經授權之 Lint 修復時追加紀錄）
│   ├── en/                    # 英文詞彙頁（如 sustainable.md, break-down.md）
│   ├── de/                    # 德文詞彙頁（如 apfel.md, maedchen.md）
│   └── sources/               # 來源筆記（依照語言分流管理）
│       ├── en/                # 英文來源記錄（如 2026-11-13-bbc-climate.md）
│       └── de/                # 德文來源記錄（如 2026-11-13-dw-vocab-list.md）
├── images/
│   ├── mascot/                # 原創學者小熊 SVG 向量素材
│   └── website/               # 獲授權可公開展示之圖檔素材
└── references/
    └── visual-style/          # 設計參考與視覺規範文件
```

### 3.2 Obsidian Vault 與內部連結規範
- **Vault 根目錄**：專案中的 `wiki/` 資料夾即為 Obsidian Vault 的根目錄。
- **內部雙向連結語法**：所有內部連結一律相對於 `wiki/` 根目錄，包含語言資料夾前綴，以杜絕跨語言同名衝突：
  - 英文詞彙連結：`[[en/sustainable]]`
  - 德文詞彙連結：`[[de/apfel]]`
  - 來源文章連結：`[[sources/en/2026-11-13-bbc-climate]]`

### 3.3 檔案命名規則
1. **英文單字與片語**：
   - 全部小寫字母。單字如 `sustainable.md`。
   - 片語以半形連字號 `-` 取代空格，如 `get-goose-bumps.md`。
2. **德文單字**：
   - 全部小寫字母，**檔名絕對不包含冠詞**（如使用 `apfel.md`，不可命名為 `der-apfel.md`）。
   - **變音符號（Umlauts）ASCII 安全轉換規範**：
     - `ä` → `ae`（例如：`Mädchen` → `maedchen.md`）
     - `ö` → `oe`（例如：`schön` → `schoen.md`）
     - `ü` → `ue`（例如：`Übung` → `uebung.md`）
     - `ß` → `ss`（例如：`Straße` → `strasse.md`）
     - *注意：此轉換僅適用於作業系統檔名與 slug；Markdown 內文、標題與 YAML 中的德文拼寫必須維持正確標準德文字形。*
3. **來源記錄檔名**：
   - 格式為：`YYYY-MM-DD-{來源縮寫}-{主題slug}.md`。
   - 範例：`wiki/sources/en/2026-11-13-bbc-climate.md`。

---

## 4. 知識庫資料規格與品質準則

所有詞彙頁面必須以標準 **YAML Frontmatter**（以 `---` 開頭，欄位採嚴格 `key: value` 格式，並以 `---` 結尾）開頭，緊接著標準結構正文。

### 4.1 穩定識別碼（Stable ID）
- 格式：`{lang}:{slug}`（例如 `en:sustainable`、`en:break-down`、`de:apfel`、`de:maedchen`）。
- **不可變性**：Stable ID 建立後即為永久唯一識別碼，**除非使用者明確指示，否則任何 Agent 不得隨意更改**，確保訪客瀏覽器 `localStorage` 收藏不失效。

### 4.2 欄位詳細定義與 YAML 階層規範

資料分為「根層級欄位」、「義項層級欄位（`senses`）」與「例句層級欄位（`examples`）」：

#### 1. 根層級欄位（Root Level）
| 欄位名稱 | 鍵值 | 適用性 | 必要/選填 | 說明 |
| :--- | :--- | :--- | :--- | :--- |
| **識別碼** | `id` | 全語言 | **必要** | 永久穩定識別碼，如 `en:sustainable` |
| **語言** | `lang` | 全語言 | **必要** | `en` 或 `de` |
| **詞彙本體** | `word` | 全語言 | **必要** | 標準拼寫（德文名詞大寫首字母，不含冠詞） |
| **德文冠詞** | `article` | **僅德文名詞** | **德文名詞必要** | 僅接受 `der`、`die`、`das`。非名詞嚴禁填寫此欄位。因冠詞已明確代表性別，省略冗餘的 `gender` 欄位以避免不一致 |
| **德文複數** | `plural` | **僅德文名詞** | **德文名詞必要** | 名詞標準複數形（如 `Äpfel`）。若確認該名詞無常用複數形式（如單數專用名詞、不可數名詞），**允許填寫 `null`**，但必須配合 `plural_note` 說明原因。**嚴禁為了填滿欄位而編造複數形式**。非名詞留空或不填 |
| **德文複數說明** | `plural_note` | **僅德文名詞** | 選填 | 當 `plural: null` 時，說明無複數之依據，如 `"無常用複數形（不可數名詞）"`。此欄位會同步至 JSON |
| **音標** | `ipa` | 全語言 | 選填（推薦） | 標準 IPA 發音符號，如 `/səˈsteɪ.nə.bəl/`，各詞性均可使用 |
| **建立日期** | `created` | 全語言 | **必要** | ISO 格式，如 `2026-11-13` |
| **更新日期** | `updated` | 全語言 | **必要** | ISO 格式，每次更新時修正 |
| **相關連結** | `related` | 全語言 | 選填 | 關聯之 Obsidian 內部連結清單，如 `["[[en/environment]]"]`。同步至 JSON 時轉為去除中括號的相對標識 |
| **多義項清單** | `senses` | 全語言 | **必要** | 義項陣列，同一單字之不同詞性或義項嚴格獨立記錄 |

#### 2. 義項層級欄位（`senses` 陣列內部結構）
每個義項物件包含：
- `pos`（**必要**）：詞性標籤（如 `adj.`, `n.`, `v.`, `adv.`, `phrase` 等）。
- `meaning`（**必要**）：繁體中文精確釋義。
- `tags`（**必要**）：主題標籤陣列，如 `["環境", "永續發展"]`。
- `collocations`（選填，英文推薦）：常見搭配詞陣列。
- `synonyms`（選填）：同義詞陣列。
- `examples`（**必要**）：例句陣列，至少包含 1 筆。

#### 3. 例句層級欄位（`examples` 陣列內部結構）
每筆例句物件包含：
- `text`（**必要**）：外文例句。
- `translation`（**必要**）：繁體中文翻譯。
- `type`（**必要**）：僅接受 `"source_quote"`（來源短引文）或 `"ai_generated"`（AI 補充）。
- `source_ref`（**條件必要**）：**當且僅當 `type` 為 `"source_quote"` 時為必要**，且必須是可追溯至使用者提供原始資料之引用，填寫相對路徑如 `"sources/en/2026-11-13-bbc-climate.md"`。未經原文核對之例句一律不得標記為 `"source_quote"`。

---

### 4.3 Markdown 詞彙頁標準範本

#### 英文範例（`wiki/en/sustainable.md`）：
*（註：本範本中例句均誠實標註為 `ai_generated`；只有在實際 Ingest 流程中確切自使用者提供的文章擷取出真實句子時，才可使用 `source_quote`）*
```markdown
---
id: "en:sustainable"
lang: "en"
word: "sustainable"
ipa: "/səˈsteɪ.nə.bəl/"
created: "2026-11-13"
updated: "2026-11-13"
related:
  - "[[en/environment]]"
senses:
  - pos: "adj."
    meaning: "可持續的、能長期維持的（環境與生態）"
    tags:
      - "環境"
      - "永續發展"
    collocations:
      - "sustainable agriculture"
      - "sustainable development"
    synonyms:
      - "renewable"
      - "maintainable"
    examples:
      - text: "We need to promote sustainable agricultural practices to protect the environment."
        translation: "我們需要推廣可持續的農業耕作方式以保護環境。"
        type: "ai_generated"
      - text: "Solar power is a clean and sustainable energy source."
        translation: "太陽能是一種清潔且可持續的能源。"
        type: "ai_generated"
---

# sustainable

> **/səˈsteɪ.nə.bəl/** · `adj.`

## 釋義與主題
- **繁中釋義**：可持續的、能長期維持的
- **主題分類**：#環境 #永續發展

## 例句展示
1. **[AI補充] 實用例句**：
   > "We need to promote sustainable agricultural practices to protect the environment."  
   > *（我們需要推廣可持續的農業耕作方式以保護環境。）*
2. **[AI補充] 延伸例句**：
   > "Solar power is a clean and sustainable energy source."  
   > *（太陽能是一種清潔且可持續的能源。）*

## 搭配詞與關聯
- **搭配詞**：`sustainable agriculture`、`sustainable development`
- **關聯詞彙**：[[en/environment]]
```

#### 德文清單型名詞範例（`wiki/de/apfel.md`）：
```markdown
---
id: "de:apfel"
lang: "de"
word: "Apfel"
article: "der"
plural: "Äpfel"
ipa: "/ˈapfl̩/"
created: "2026-11-13"
updated: "2026-11-13"
related: []
senses:
  - pos: "n."
    meaning: "蘋果（水果）"
    tags:
      - "飲食"
      - "日常生活"
    examples:
      - text: "Der Apfel schmeckt frisch und saftig."
        translation: "這顆蘋果吃起來新鮮多汁。"
        type: "ai_generated"
---

# der Apfel, die Äpfel

> **/ˈapfl̩/** · `n.`

## 釋義與文法資訊
- **繁中釋義**：蘋果（水果）
- **冠詞**：`der`（陽性）
- **複數形**：`die Äpfel`
- **主題分類**：#飲食 #日常生活

## 例句展示
1. **[AI補充] 實用例句**：
   > "Der Apfel schmeckt frisch und saftig."  
   > *（這顆蘋果吃起來新鮮多汁。）*
```

#### 德文無複數形名詞範例說明（例如不可數名詞 `Obst`）：
```yaml
id: "de:obst"
lang: "de"
word: "Obst"
article: "das"
plural: null
plural_note: "無常用複數形（集合名詞/不可數）"
```

---

### 4.4 衍生網站索引結構與同步欄位清單（`data/knowledge.json`）

`data/knowledge.json` 是由 Markdown Wiki 衍生的標準公開索引，結構必須固定為：

```json
{
  "schema_version": 1,
  "generated_at": "YYYY-MM-DD",
  "items": []
}
```

#### 必須納入 JSON 同步比對之完整欄位規範：
`items` 陣列中的每筆詞彙物件，必須嚴格由 Markdown Frontmatter 衍生轉換，且包含下列欄位：
1. `id`（字串，**必要**）：穩定識別碼，如 `"en:sustainable"`。
2. `lang`（字串，**必要**）：`"en"` 或 `"de"`。
3. `word`（字串，**必要**）：詞彙拼寫，如 `"sustainable"`、`"Apfel"`。
4. `display_title`（字串，**必要**）：網頁展示標題。德文名詞組合為 `"der Apfel"`；英文與德文非名詞則與 `word` 相同。
5. `article`（字串，**僅德文名詞**）：`"der"`, `"die"`, `"das"`。
6. `plural`（字串或 null，**僅德文名詞**）：標準複數或 `null`。
7. `plural_note`（字串，**德文選填**）：若 Markdown 存在此欄位，**必須納入 JSON**，供網頁向訪客展示無複數原因。
8. `ipa`（字串，**選填**）：若 Markdown 存在音標，**必須納入 JSON**。
9. `related`（字串陣列，**選填**）：若 Markdown 存在關聯詞彙，**必須納入 JSON**（格式為去除中括號的相對標識如 `["en/environment"]`）。
10. `senses`（物件陣列，**必要**）：完整同步各義項。每項均須同步 `pos`、`meaning`、`tags`，以及存在時的 `collocations` 與 `synonyms`。
11. `examples`（物件陣列，**必要**，位於各義項內）：完整同步每筆例句之 `text`、`translation`、`type`（及存在時的 `source_ref`）。
12. `created`（字串，**必要**）：ISO 建立日期。
13. `updated`（字串，**必要**）：ISO 更新日期。

*安全防護：JSON 僅包含上述公開知識欄位，**嚴禁包含個人學習狀態（`status`）或私人備註（`notes`）**。*

---

## 5. Ingest 工作流程（新增／匯入標準作業程序）

當使用者提供學習文章、詞彙清單或發出 `Ingest` 指令時，Agent 必須依照下列 8 個步驟依序執行：

1. **語意與類型解析**：
   - 識別輸入內容的語言（英文/德文）與類型（文章、對話、純單字清單）。
2. **查重與防重複（Deduplication Check）**：
   - 檢查 `wiki/{lang}/` 是否已存在相同詞彙檔案。
   - 若檔案已存在，採 **Upsert（追加更新）模式**：在對應義項中追加新的來源引文、關聯筆記，並更新 `updated` 日期，**嚴禁建立重複檔案**。
3. **建立來源紀錄**：
   - 若輸入附帶文章或清單來源，於 `wiki/sources/{lang}/` 建立來源摘要檔（遵循非全文、短引文與個人摘要原則）。
4. **生成/更新 Markdown 知識頁**：
   - 依據第 4 節規範生成標準 YAML Frontmatter 與正文。
   - 多義項分開記錄，非名詞德文不帶冠詞。
   - 建立雙向內部連結（`[[sources/...]]` 與詞彙頁互連）。
5. **更新知識地圖（`wiki/index.md`）**：
   - 確保新增或更新之詞彙連結已登記於 MOC 索引中。
6. **追加操作日誌（`wiki/log.md`）**：
   - **Ingest 必須追加日誌**：以 Append 方式在日誌末尾記錄時間、操作類型（新增/更新）、影響詞彙與來源。
7. **同步衍生索引（`data/knowledge.json`）**：
   - 讀取 `wiki/` 內所有 Markdown 知識頁，重新彙總輸出為符合第 4.4 節固定結構與欄位清單的 JSON 檔案。
8. **執行即時自檢與簡短回報**：
   - 驗證 JSON 語法正確性與索引總筆數。
   - 回報處理摘要，例如：「✅ Ingest 完成：新增 2 個詞彙，更新 1 個詞彙，已同步更新 knowledge.json 與日誌。」

---

## 6. Query 工作流程（唯讀查詢作業程序）

當使用者發出 `Query` 指令或詢問知識庫內容時，Agent 遵循以下規則：

1. **核心原則**：**絕對唯讀**，禁止任何寫入、修改或建立檔案之動作。
2. **日誌約束**：**Query 操作絕對不修改或寫入 `wiki/log.md`**。
3. **查詢範疇**：
   - 檢索單字、片語、釋義或主題標籤（優先讀取 Markdown Wiki）。
   - 統計不同語言的收錄量、詞性分布或特定主題詞彙清單。
   - 跨語言關聯查詢（如德文與英文在同一主題下的對應字詞）。
4. **回覆規格**：
   - 回覆中若提及詞彙或來源，一律附上標準 Obsidian 雙向連結形式（如 `[[en/sustainable]]`）。
   - 清楚標註該詞彙的詞性、中文釋義、來源出處及例句。

---

## 7. Lint 工作流程（健康檢查與報告規範）

當使用者發出 `Lint` 指令時，Agent 進行全庫深度健檢。

### 7.1 工作原則與日誌規範
- **預設唯讀**：Lint 預設為純健檢作業，產出結構化健康報告，**不得擅自修改檔案，亦不寫入 `wiki/log.md`**。
- **經授權修復**：只有在使用者發出明確修復指令（如「請修復所有 Lint 錯誤」）後，Agent 方可修改檔案。**修復完成後，必須同步更新 `data/knowledge.json`，並於 `wiki/log.md` 追加一筆修復紀錄**。

### 7.2 健檢項目與分級標準

#### 🔴 [Error] 嚴重錯誤（違反核心規範）
1. **根層級必要欄位缺漏**：缺少 `id`、`lang`、`word`、`created`、`updated` 或 `senses`。
2. **義項層級（`senses`）必要欄位缺漏**：任一義項缺少 `pos`、`meaning`、`tags` 或 `examples`。
3. **例句層級（`examples`）必要欄位缺漏**：任一例句缺少 `text`、`translation` 或 `type`。
4. **完全無任何例句**：義項內 `examples` 為空陣列（既沒有來源短引文，也沒有 AI 補充例句）。*（注意：若僅是無來源例句，但有標註為 `type: "ai_generated"` 的例句，視為合規，不列為 Error）*。
5. **來源短引文未填 reference 或虛假標記**：當例句之 `type` 為 `"source_quote"` 時，缺少 `source_ref`、指向不存在之來源筆記、或引文未在原始來源中確認。
6. **德文名詞冠詞違規**：德文名詞缺少 `article` 欄位，或 `article` 不是 `der`、`die`、`das` 之一。
7. **德文名詞複數違規**：德文名詞缺少 `plural` 欄位；若 `plural: null` 卻缺少 `plural_note` 說明原因。
8. **德文非名詞欄位污染**：動詞、形容詞等非名詞填寫了 `article` 或 `plural`。
9. **死連結（Broken Link）**：`[[...]]` 指向不存在的 Wiki 檔案。
10. **JSON 與 Markdown 深度欄位不一致**：比對 `data/knowledge.json` 與 Markdown Wiki 時，不僅比對筆數與 Stable ID，必須**逐筆逐欄深層比對**所有第 4.4 節規定的公開同步欄位（`id`, `lang`, `word`, `display_title`, `article`, `plural`, `plural_note`, `ipa`, `related`, `senses` 及其內部義項與例句、`created`, `updated`），任一欄位不符即判定為 Error。
11. **JSON 頂層結構或語法錯誤**：未遵循 `schema_version`、`generated_at`、`items` 頂層結構，或無法通過標準 JSON 解析。

#### 🟡 [Warning] 警告項目（建議優化）
1. **變音符號檔名未正規化**：德文檔名含有未轉換的 `ä, ö, ü, ß`。
2. **AI 例句未明確標記**：Markdown 內文呈現之 AI 例句未清楚加註 `[AI補充]`。
3. **未登錄至索引**：`wiki/` 內存在詞彙，但未登錄於 `wiki/index.md`。
4. **來源紀錄不完整**：來源筆記缺少 URL 或出處名稱。

#### 🔵 [Info] 資訊統計
1. 各語言詞彙總量、片語總量、來源文章篇數統計。
2. 待確認（標註為待查或留空）欄位之詞彙清單。

---

## 8. 靜態網站整合規範與技術邊界

### 8.1 技術棧與部署標準
- **技術棧**：原生 HTML5、CSS3、Vanilla JavaScript（ES6+），不使用重型框架與 Node.js 後端。
- **部署平台**：GitHub Pages。
- **路徑規範**：全站所有資源引入（CSS、JS、JSON、SVG、圖片）**一律使用相對路徑**（如 `./data/knowledge.json`、`./css/style.css`、`./images/...`），嚴禁使用 `/data/...` 絕對根路徑，以保證在 GitHub Pages 專案子目錄下順暢載入。
- **本機測試規範**：本機除錯必須使用本機 HTTP 伺服器（如 `npx serve` 或 `python -m http.server`），嚴禁直接以 `file://` 協定開啟，以防跨來源（CORS/Fetch）阻擋。
- **錯誤降級（Graceful Degradation）**：若 `knowledge.json` 讀取失敗或受網路阻擋，`index.html` 必須展示優雅的人性化提示面板（包含小熊關懷插圖與檢查引導），嚴禁整頁反白崩潰。

### 8.2 視覺設計系統（Design System）
- **風格定位**：文藝學院數位花園風（Editorial / Academic Garden），沉穩、知性、溫潤手記感。
- **色彩系統**：
  - 背景色：柔燕麥奶油白（`#FAF8F5`）
  - 卡片與表面底色：純淨雪白（`#FFFFFF`）
  - 主品牌色：典雅森林綠（`#2D5A43`）
  - 主文字色：深墨藍灰（`#1E293B`）
  - 次要輔助文字：灰調岩石藍（`#64748B`）
  - 重點點綴色：暖琥珀金（`#D97706`，用於收藏星號、精選標籤、德文徽章）
  - 柔和輔助色：霧灰玫瑰粉（`#D48B80`，用於次要標籤、英文徽章）
  - 細緻邊框線：燕麥淺灰（`#E8E4DC`）
- **字體規範**：
  - 大標題與手記感標題：優雅襯線體（`Georgia, "Noto Serif TC", serif`）。
  - 內文與介面：現代清晰無襯線體（`system-ui, -apple-system, "Segoe UI", "Noto Sans TC", sans-serif`）。
  - 音標：標準國際音標支援字體。

### 8.3 原創學者小熊吉祥物（Scholar Bear）
- **形象定義**：圓潤溫和的探索學者小熊，配戴學者圓眼鏡，身繫暖琥珀緞帶（`#D97706`），雙手穩健捧著一本翻開的精裝書。
- **色彩系統**：暖棕色毛皮色系（主體 `#8C5E35`、陰影 `#6E4423`、臉部亮面 `#D9A066`、高光 `#FAF2EA`、前臂線條 `#A07248`），深林綠書皮（`#173124` 至 `#2D5A43`），柔燕麥書頁（`#FAF8F5`）。
- **防穿模幾何標準（No-Clipping Guarantee）**：
  - **前臂走勢**：左前臂以 `M 58 126`、右前臂以 `M 142 126` 自身體兩側自然斜下延伸，杜絕任何肢體直接穿過書皮的不合理構造。
  - **熊爪位置**：左右熊爪穩健環抱於書本封套外緣兩側（坐標 `cx=51, cy=154` 與 `cx=149, cy=154`），並飾有精緻的腳掌肉球襯托親和力。
  - **書頁與書脊完整性**：翻開之書頁跨距為 `x=55 ~ x=145`，書本印刷文字線條與中央書脊緞帶完整展現，嚴禁手臂、爪子穿插、截斷或遮擋書頁、內文與書脊（絕不穿模）。
- **技術實現**：**100% 純原生向量 SVG 格式**，存於 `images/mascot/scholar-bear.svg`，可透過 `<img>` 引用或直接 inline 嵌入 HTML。
- **原創性與版權約束**：純原創手繪幾何向量構成。**未來任何修改或擴充，絕對不可任意替換角色、改用點陣圖（PNG/JPG）或破壞原有文藝知性之手繪風格**。
- **出現場景**：
  1. 首頁迎賓區（Hero Banner 右側迎賓插圖）
  2. 頂部導覽列品牌圖標（Logo Icon）
  3. 我的收藏空白狀態（Empty State 溫馨引導插圖）
  4. 全站錯誤降級關懷面板（Error Banner 降級提示）

### 8.4 頁面結構與互動視圖規範（Page Structure & Views）
前端網站採用單一根目錄 `index.html` 入口，透過狀態或 URL Hash（`#home`, `#en`, `#de`, `#favorites`）切換四大視圖，必須自 `data/knowledge.json` 動態讀取資料，**嚴禁在程式碼中寫死詞彙與統計數字**：

- **品牌與訪客視覺邊界（Public Display Separation）**：
  - 網站專案對外名稱統一為 **My Lingual**。
  - 首頁標題小字（Eyebrow）固定為 `MY LINGUAL`。
  - 首頁主標題固定為「**探索語言，積累智慧**」。
  - 首頁副標題固定為「**以真實素材資料為起點，整理多語言單字、片語、文法與例句。透過搜尋、分類與收藏，慢慢建立起自己的多語言知識庫。**」。
  - 雙語入口標籤固定為 **English** 與 **Deutsch**。
  - **嚴格規範：內部工程規範字樣（如 `AGENTS.md` 等開發說明）絕對不得出現在一般訪客看得到的首頁與公開版面位置**。

- **四大核心視圖實作標準**：
  1. **首頁 Portal（Home View, `#home`）**：
     - **品牌導覽列**：原創小熊 Logo、品牌名（My Lingual）與四項導覽按鈕（首頁、English、Deutsch、我的收藏）。
     - **Scholar Bear 歡迎區（Hero Banner）**：左側文藝學院風問候語、主副標題與即時動態統計面板（詞彙總數、英文數、德文數、已收藏數），右側原創學者小熊 SVG 迎賓圖標。
     - **雙語探索入口大卡片**：English 知識庫卡片與 Deutsch 知識庫卡片，動態展示各自收錄詞彙數量與「開始探索 →」按鈕（卡片不帶國旗文字標籤），點擊平滑導向對應視圖。
     - **最近新增詞彙精選（Recent Additions）**：動態展示最新收錄的單字卡片預覽，支援點擊開啟詳情與「查看全部」快速通道。

  2. **英文瀏覽畫面（English Explorer View, `#en`）**：
     - **頂部工具列**：全庫/英文即時搜尋框（支援單字、釋義、搭配詞、標籤搜尋）、詞性（POS）篩選膠囊列（`全部`, `n.`, `v.`, `adj.`, `phrase`, `idiom`）、主題標籤篩選列。
     - **英文詞彙卡片網格**：卡片呈現英文單字、單字語音播放按鈕、IPA 音標（若有）、詞性徽章、繁中釋義、搭配詞（Collocations）、首則實用例句（附例句獨立語音按鈕）、來源筆記連結及收藏星號按鈕。
     - **卡片點擊詳情**：點擊卡片彈出完整單字詳情彈窗。

  3. **德文瀏覽畫面（Deutsch Explorer View, `#de`）**：
     - **頂部工具列**：即時搜尋框、冠詞篩選器（`全部`, `der`, `die`, `das`）、詞性篩選膠囊列（`全部`, `n.`, `v.`, `adj.`, `greeting`, `expression`, `other`）、主題標籤篩選列。
     - **德文詞彙卡片網格**：德文名詞強制組合呈現冠詞（如 `der Apfel`）、複數形標註（如 `die Äpfel` 或單數專用說明 `plural_note`）；非名詞呈現單純詞彙拼寫；附帶單字語音按鈕（名詞含冠詞朗讀）、IPA 音標、詞性徽章、繁中釋義、首則實用例句（附例句獨立語音按鈕）、來源筆記連結及收藏星號按鈕。
     - **卡片點擊詳情**：點擊卡片彈出完整單字詳情彈窗。

  4. **收藏畫面（Favorites View, `#favorites`）**：
     - **星號收藏系統**：依據詞彙永久唯一 `id`（Stable ID，如 `en:sustainable`、`de:apfel`）儲存於訪客瀏覽器 `localStorage`（鍵名 `mylingua_favorites`）。
     - **收藏清單展示**：展示使用者加星號的詞彙卡片，支援跨語言檢視與關鍵字即時搜尋篩選。
     - **空白狀態友善提示（Empty State）**：當無收藏任何單字時，展示學者小熊輕抱書本的溫馨 SVG 插圖與「目前尚未收藏詞彙，快去探索並點擊星號吧！」引導文字。

- **單字詳情彈窗（Detail Modal）**：
  - 點擊任一詞彙卡片可彈出全螢幕置中詳細視圖：包含完整單字名稱、單字發音按鈕、收藏星號按鈕、IPA 音標、詞性徽章、德文文法變化資訊（冠詞、複數、說明）、繁體中文完整釋義、英文常用搭配詞、完整例句清單（含每則例句之外語原文、中文翻譯、類型標籤與獨立語音按鈕）、知識庫來源筆記反向連結及主題標籤。

- **URL Hash 路由系統**：
  - 透過 `window.location.hash` 監聽與切換視圖（`#home`, `#en`, `#de`, `#favorites`），支援瀏覽器上一頁/下一頁前進後退、網址直接定位，每次切換自動平滑滾動至頂部。

- **全站錯誤降級面板（Error Banner）**：
  - 若 `knowledge.json` 載入失敗或受網路阻擋，頂部動態展開典雅溫馨的降級警示面板，提供本機除錯指引與重新整理按鈕，確保畫面絕對不崩潰白屏。

### 8.5 UI 元件、語音朗讀與響應式 RWD 規範（UI Components & Responsive Design）
- **元件視覺一致性**：
  - **單字卡（Vocab Card）**：白底（`#FFFFFF`）、細燕麥邊框（`#E8E4DC`）、懸浮時輕盈上浮（`translateY(-2px)`）與柔和陰影；右上方常駐圓形收藏星號按鈕。
  - **按鈕系統（Buttons）**：主按鈕為典雅森林綠（`#2D5A43`）、白字、圓角 `8px`；次要按鈕為透明外框（Ghost）與米白懸浮態。
  - **即時搜尋框（Search Bar）**：圓角藥丸造型、細燕麥邊框、聚焦時外框發出微弱森林綠光暈；內建清除輸入按鈕。
  - **分類徽章（Pill Badges）**：圓角膠囊造型，低飽和度底色；英文搭配柔灰玫瑰粉（`#D48B80`）色調，德文搭配暖琥珀金（`#D97706`）色調。
  - **收藏星號（Star Icon）**：未收藏時為灰調輪廓星號；已收藏時填滿暖琥珀金（`#D97706`），具備縮放彈跳微動效。
  - **載入與錯誤降級提示**：資料讀取中呈現典雅微光骨架或載入動畫；若 `knowledge.json` 載入失敗，呈現小熊關懷面板與本地除錯指引，絕不白屏。

- **語音朗讀系統（Native Web Speech API 規格）**：
  - **技術基礎**：使用瀏覽器原生 `window.speechSynthesis` 與 `SpeechSynthesisUtterance`，零外部依賴、零第三方 API 金鑰、零付費服務。
  - **發音語言（Locale）**：
    - 英文詞彙與英文例句採用 `en-US`。
    - 德文詞彙與德文例句採用 `de-DE`。
  - **德文名詞冠詞朗讀規則**：德文名詞朗讀時**必須連同冠詞一起唸**（例如：`der Apfel`、`die Bank`、`das Büro`）；英文與德文非名詞則朗讀詞彙本體。
  - **例句純外語朗讀**：例句朗讀按鈕嚴格僅傳入目標外語原文（`example.text`），**絕對不朗讀中文翻譯**。
  - **單字與例句分開獨立播放**：單字標題旁設有專屬朗讀按鈕，每則例句後方設有獨立朗讀按鈕，兩者互不干擾。
  - **互斥與打斷機制**：觸發新語音播放前，必須先執行 `window.speechSynthesis.cancel()` 終止前一段發音，防止語音重疊。
  - **事件防冒泡隔離**：語音按鈕位於單字卡與彈窗內，點擊時**必須呼叫 `event.stopPropagation()`**，確保絕不意外觸發開啟詳情彈窗或切換收藏星號。
  - **無障礙與視覺狀態**：按鈕設置 `title="朗讀發音"` 與 `aria-label="朗讀發音"`；朗讀中按鈕自動套用 `.speaking` 脈衝微光回饋，播畢或異常時平順復原；若瀏覽器不支援 Web Speech API，跳出人性化提醒。

- **響應式跨裝置規格（Responsive Design Standards）**：
  - **電腦版（Desktop, min-width 1024px）**：
    - 頁面寬度上限 `1080px` 置中；單字卡採 3 欄式網格排列（`repeat(3, 1fr)`）。
    - 頂部導覽列維持高度 `64px`，Logo 置左，導覽項目橫向展開置右，維持既有典雅外觀，不受行動版調整影響。
  - **平板版（Tablet, 768px–1023px）**：
    - 頂部導覽列維持橫向展開。
    - 單字卡網格自適應切換為 2 欄排列（`repeat(2, 1fr)`）。
  - **大螢幕手機與小型平板（Phablet / Small Tablet, 480px–767px）**：
    - Header 採垂直彈性分行，Logo 獨立置頂，導覽按鈕展開為單行 4 欄均分網格（`repeat(4, 1fr)`），觸控高度維持 44px。
    - 單字卡網格切換為 1 欄排列。
  - **手機版（Mobile, max-width 479px）**：
    - **品牌區與導覽區分行**：Header 容器採彈性直行排列（`flex-direction: column; height: auto;`），品牌 Logo 獨立置頂居中，不與導覽按鈕擠在同一列。
    - **四象限平衡排列，雙語言完美並排**：導覽列採用 2x2 雙欄網格（`grid-template-columns: repeat(2, 1fr)`）：
      - 第一列：`[ 🏠 首頁 ]` 與 `[ ⭐ 我的收藏 (0) ]` 各占 50% 寬度
      - 第二列：`[ English ]` 與 `[ Deutsch ]` 各占 50% 寬度，雙語言按鈕完美並排
    - **單字卡網格**：單字卡網格為 1 欄排列。
    - **防文字壓縮與不裁切原則**：
      - 導覽按鈕強制設定 `flex-shrink: 0;` 與 `white-space: nowrap;`。
      - 文字容器強制設定 `.nav-link span.nav-text { display: inline !important; }`。
      - English 與 Deutsch 文字必須 100% 完整可見，絕對不可壓縮成空白，嚴禁使用省略號（ellipsis）或縮小至不可閱讀尺寸。
    - **觸控目標規範**：每個導覽按鈕高度嚴格維持至少 44px（`min-height: 44px; height: 44px;`），符合行動裝置無障礙觸控規範。
    - **實測驗收尺寸**：必須保證在 **320px**（超窄屏 iPhone SE1）、**375px**（iPhone SE2/8）、**390px**（iPhone 12~15）、**430px**（iPhone Pro Max/Plus）四種核心螢幕寬度下，按鈕不互相擠壓、不重疊、文字全數完整顯示，且語言切換功能 100% 正常。

---

## 9. 未來多語言擴充指南

### 9.1 目前正式支援狀態
本專案目前**正式支援且完整實作**之語言為：
- **English（英文，語言代碼 `en`）**
- **Deutsch（德文，語言代碼 `de`）**

My Lingual 未來可以依照個人學習與使用需求，逐步擴充其他語言，例如 **Korean（韓文）**、**Japanese（日文）**、**French（法文）**、**Spanish（西班牙文）**、**Italian（義大利文）** 等。

> [!IMPORTANT]
> **重要邊界提示**：列出上述語言僅代表本系統具備良好的架構延展性，**絕對不代表目前已經實作或已經支援這些語言**。當前知識庫與網站程式中，嚴禁假造或未經授權匯入其他語言資料。

### 9.2 未來新增語言之 5 大基本原則（Extension Principles）
當未來正式立項擴充新語言時，AI Agent 與維護者必須嚴格遵循以下 5 項核心原則：

1. **深入確認該語言之文字、詞性與語法需求**：
   - 擴充新語言前，必須先研究並確立其文字系統（如韓文字母 Hangul、日文假名與漢字、拉丁字母與附加符號）、詞性分類系統（如動詞活用、敬語）及學習核心資訊。
2. **嚴禁生搬硬套其他語言的專屬文法欄位**：
   - 德文特有的 `article`（冠詞）與 `plural`（複數形式）專屬於具備語法性別與名詞屈折變化的語言。
   - 若新增韓文或日文，**絕對不可套用冠詞（`article`）或性別欄位**，而應按其語言特性設計讀音標記（如日文平假名、羅馬字表記）或語體層級。
   - 若新增法文或義大利文，則需專門規劃其特有的冠詞與陰陽性規則。
3. **恪守既有 Markdown、Stable ID 及資料管理規範**：
   - 新語言詞彙頁面依然使用標準 YAML Frontmatter。
   - 識別碼遵循永久不變的 Stable ID 規範：`{lang}:{slug}`（例如法文 `fr:bonjour`、日文 `ja:taberu`）。
   - 檔案目錄嚴格按語言分流：`wiki/{lang}/` 與 `wiki/sources/{lang}/`。
4. **確保不破壞既有知識庫資料與運作**：
   - 新語言的加入必須為「純增量」，現有的英文與德文 Markdown 頁面、來源紀錄、雙向連結及 Stable ID 絕對不可受影響或產生衝突。
5. **Schema 與網站程式修改前須經相容性評估**：
   - 若新語言之語法需求涉及 `data/knowledge.json` 頂層結構、欄位增刪或多義項資料模型調整，**必須先提出明確的架構方案與向下相容性評估**，並透過升級 `schema_version` 管理，嚴禁未經評估直接修改資料結構或破壞既有前端程式解析。
   - 前端展示層（`index.html`, `js/app.js`, `css/style.css`）亦應同步規劃導覽項目增設、專屬篩選器與語音發音 locale 支援。

*（註：本章節僅規範未來架構延展之基本準則，當前專案無需且不應過早開發多語言通用系統）*

---

## 10. Agent 指令速查表（Quick Reference）

| 指令 | 目的 | 操作特性 | `wiki/log.md` 異動行為 | 檔案異動行為 |
| :--- | :--- | :--- | :--- | :--- |
| **`Ingest`** | 匯入新文章或單字清單 | 寫入 / 更新 | **追加紀錄** | 建立/更新 Markdown、更新 sources、索引及 `knowledge.json` |
| **`Query`** | 檢索查詢詞彙與統計 | **完全唯讀** | **不修改、不記錄** | **不變更任何檔案**，整理資訊並附內部連結回覆 |
| **`Lint`** | 檢查全庫規格與一致性 | **預設唯讀** | **不修改、不記錄** | 產出結構化報告（Error/Warning/Info），不變更任何檔案 |
| **`Lint Fix`** | 經授權修復問題 | 寫入 / 修復 | **追加修復紀錄** | 修正違規檔案，並同步更新 `knowledge.json` |

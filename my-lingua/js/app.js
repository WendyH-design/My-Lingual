/**
 * My Lingual - Frontend Client Application
 * Strictly adheres to AGENTS.md requirements
 */

(function () {
  'use strict';

  // Application State
  const state = {
    knowledge: [],
    enWords: [],
    deWords: [],
    favorites: new Set(),
    currentView: 'home',
    filters: {
      en: { search: '', pos: 'all', tag: 'all' },
      de: { search: '', article: 'all', pos: 'all', tag: 'all' },
      fav: { lang: 'all' }
    }
  };

  // DOM Elements
  const elements = {
    views: {
      home: document.getElementById('view-home'),
      en: document.getElementById('view-en'),
      de: document.getElementById('view-de'),
      favorites: document.getElementById('view-favorites')
    },
    navLinks: document.querySelectorAll('.nav-link'),
    navFavBadge: document.getElementById('navFavBadge'),
    errorBanner: document.getElementById('errorBanner'),
    errorMessage: document.getElementById('errorMessage'),
    
    // Stats
    statTotalWords: document.getElementById('statTotalWords'),
    statEnWords: document.getElementById('statEnWords'),
    statDeWords: document.getElementById('statDeWords'),
    statFavCount: document.getElementById('statFavCount'),
    enPortalCount: document.getElementById('enPortalCount'),
    dePortalCount: document.getElementById('dePortalCount'),
    
    // Grids
    recentGrid: document.getElementById('recentGrid'),
    enVocabGrid: document.getElementById('enVocabGrid'),
    deVocabGrid: document.getElementById('deVocabGrid'),
    favVocabGrid: document.getElementById('favVocabGrid'),
    favEmptyState: document.getElementById('favEmptyState'),
    
    // Counts
    enResultCount: document.getElementById('enResultCount'),
    deResultCount: document.getElementById('deResultCount'),
    favResultCount: document.getElementById('favResultCount'),
    
    // Inputs & Filters
    enSearchInput: document.getElementById('enSearchInput'),
    enSearchClear: document.getElementById('enSearchClear'),
    enPosPills: document.getElementById('enPosPills'),
    enTagPills: document.getElementById('enTagPills'),
    
    deSearchInput: document.getElementById('deSearchInput'),
    deSearchClear: document.getElementById('deSearchClear'),
    deArticlePills: document.getElementById('deArticlePills'),
    dePosPills: document.getElementById('dePosPills'),
    deTagPills: document.getElementById('deTagPills'),
    favLangPills: document.getElementById('favLangPills'),
    
    // Modal
    detailModal: document.getElementById('detailModal'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalTitle: document.getElementById('modalTitle'),
    modalAudioSlot: document.getElementById('modalAudioSlot'),
    modalMeta: document.getElementById('modalMeta'),
    modalGrammarSection: document.getElementById('modalGrammarSection'),
    modalGrammarContent: document.getElementById('modalGrammarContent'),
    modalMeaningContent: document.getElementById('modalMeaningContent'),
    modalCollocationsSection: document.getElementById('modalCollocationsSection'),
    modalCollocationsContent: document.getElementById('modalCollocationsContent'),
    modalExamplesList: document.getElementById('modalExamplesList'),
    modalSourceContent: document.getElementById('modalSourceContent')
  };

  // LocalStorage Key (Conforms to AGENTS.md 8.4: mylingua_favorites)
  const STORAGE_KEY = 'mylingua_favorites';

  // SVG Icons
  const SVG_VOLUME = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;

  /**
   * Browser-Native Web Speech API Player
   * Common speech playback handler
   */
  let currentSpeakingButton = null;

  function speakText(text, lang, event, triggerBtn) {
    if (event) {
      event.stopPropagation();
    }

    if (!('speechSynthesis' in window)) {
      alert('您的瀏覽器不支援原生 Web Speech API 語音播放功能。');
      return;
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel();
    if (currentSpeakingButton) {
      currentSpeakingButton.classList.remove('playing');
      currentSpeakingButton = null;
    }

    const cleanText = text.trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang; // 'en-US' or 'de-DE'
    utterance.rate = 0.95; // slightly slower for language study clarity

    // Voice match fallback
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const prefix = lang.split('-')[0].toLowerCase();
      const matched = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(prefix));
      if (matched) {
        utterance.voice = matched;
      }
    }

    if (triggerBtn) {
      triggerBtn.classList.add('playing');
      currentSpeakingButton = triggerBtn;

      utterance.onend = () => {
        triggerBtn.classList.remove('playing');
        if (currentSpeakingButton === triggerBtn) currentSpeakingButton = null;
      };

      utterance.onerror = () => {
        triggerBtn.classList.remove('playing');
        if (currentSpeakingButton === triggerBtn) currentSpeakingButton = null;
      };
    }

    window.speechSynthesis.speak(utterance);
  }

  // Pre-load voices if supported
  if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }

  /**
   * Initialize LocalStorage Favorites
   */
  function initFavorites() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('my_lingua_starred_ids');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          state.favorites = new Set(parsed);
        }
      }
    } catch (err) {
      console.warn('Could not load favorites from localStorage:', err);
      state.favorites = new Set();
    }
    updateFavoriteCountUI();
  }

  /**
   * Save Favorites to LocalStorage
   */
  function saveFavorites() {
    try {
      const arr = Array.from(state.favorites);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
      localStorage.setItem('my_lingual_starred_ids', JSON.stringify(arr));
    } catch (err) {
      console.warn('Could not save favorites to localStorage:', err);
    }
    updateFavoriteCountUI();
  }

  /**
   * Toggle Favorite Star
   */
  function toggleFavorite(id, event) {
    if (event) {
      event.stopPropagation();
    }
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
    } else {
      state.favorites.add(id);
    }
    saveFavorites();

    // Update buttons in place
    document.querySelectorAll(`.star-btn[data-id="${id}"]`).forEach(btn => {
      const isFav = state.favorites.has(id);
      btn.classList.toggle('active', isFav);
      btn.setAttribute('aria-label', isFav ? '取消收藏' : '加到收藏');
      btn.setAttribute('title', isFav ? '取消收藏' : '加到收藏');
    });

    // If currently on favorites view, re-render
    if (state.currentView === 'favorites') {
      renderFavoritesView();
    }
  }

  /**
   * Update Favorite Count UI Across Views
   */
  function updateFavoriteCountUI() {
    const count = state.favorites.size;
    if (elements.navFavBadge) elements.navFavBadge.textContent = count;
    if (elements.statFavCount) elements.statFavCount.textContent = count;
  }

  /**
   * Fetch Knowledge Data from Relative Path ./data/knowledge.json
   */
  async function loadKnowledgeData() {
    try {
      const response = await fetch('./data/knowledge.json');
      if (!response.ok) {
        throw new Error(`HTTP 錯誤：伺服器回傳狀態碼 ${response.status}`);
      }
      const data = await response.json();
      if (!data || !Array.isArray(data.items)) {
        throw new Error('資料格式不符合規範：缺少 items 陣列');
      }

      state.knowledge = data.items;
      state.enWords = state.knowledge.filter(it => it.lang === 'en');
      state.deWords = state.knowledge.filter(it => it.lang === 'de');

      // Update Statistics
      if (elements.statTotalWords) elements.statTotalWords.textContent = state.knowledge.length;
      if (elements.statEnWords) elements.statEnWords.textContent = state.enWords.length;
      if (elements.statDeWords) elements.statDeWords.textContent = state.deWords.length;
      if (elements.enPortalCount) elements.enPortalCount.textContent = `${state.enWords.length} 個收錄詞彙`;
      if (elements.dePortalCount) elements.dePortalCount.textContent = `${state.deWords.length} 個收錄詞彙`;

      // Render Components
      renderRecentSection();
      initFilterOptions();
      renderEnglishView();
      renderDeutschView();
      renderFavoritesView();

      console.log(`✅ 成功載入知識庫：共 ${state.knowledge.length} 筆詞彙（英文 ${state.enWords.length}，德文 ${state.deWords.length}）`);
    } catch (err) {
      console.error('Failed to load knowledge.json:', err);
      showErrorBanner(err.message);
    }
  }

  /**
   * Show Error Banner (Graceful Degradation)
   */
  function showErrorBanner(msg) {
    if (elements.errorBanner) {
      elements.errorBanner.classList.add('active');
      if (elements.errorMessage) {
        elements.errorMessage.textContent = `無法讀取知識庫檔案（./data/knowledge.json）：${msg}。請確認您是在本機伺服器環境（如 python -m http.server）下瀏覽，而非直接以 file:// 協定點擊。`;
      }
    }
  }

  /**
   * Render Recent Words in Home View (Latest 6)
   */
  function renderRecentSection() {
    if (!elements.recentGrid) return;
    const sorted = [...state.knowledge].reverse().slice(0, 6);
    elements.recentGrid.innerHTML = '';
    sorted.forEach(item => {
      elements.recentGrid.appendChild(createVocabCardElement(item));
    });
  }

  /**
   * Initialize Dynamic Filter Pills from Actual Data
   */
  function initFilterOptions() {
    // 1. English POS & Tags
    const enPosSet = new Set();
    const enTagSet = new Set();
    state.enWords.forEach(item => {
      (item.senses || []).forEach(s => {
        if (s.pos) enPosSet.add(s.pos);
        (s.tags || []).forEach(t => enTagSet.add(t));
      });
    });

    if (elements.enPosPills) {
      enPosSet.forEach(pos => {
        const btn = document.createElement('button');
        btn.className = 'filter-pill';
        btn.dataset.pos = pos;
        btn.textContent = pos;
        btn.addEventListener('click', () => {
          elements.enPosPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          state.filters.en.pos = pos;
          renderEnglishView();
        });
        elements.enPosPills.appendChild(btn);
      });
    }

    if (elements.enTagPills) {
      enTagSet.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'filter-pill';
        btn.dataset.tag = tag;
        btn.textContent = `#${tag}`;
        btn.addEventListener('click', () => {
          elements.enTagPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          state.filters.en.tag = tag;
          renderEnglishView();
        });
        elements.enTagPills.appendChild(btn);
      });
    }

    // 2. German POS & Tags
    const dePosSet = new Set();
    const deTagSet = new Set();
    state.deWords.forEach(item => {
      (item.senses || []).forEach(s => {
        if (s.pos) dePosSet.add(s.pos);
        (s.tags || []).forEach(t => deTagSet.add(t));
      });
    });

    if (elements.dePosPills) {
      dePosSet.forEach(pos => {
        const btn = document.createElement('button');
        btn.className = 'filter-pill';
        btn.dataset.pos = pos;
        btn.textContent = pos;
        btn.addEventListener('click', () => {
          elements.dePosPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          state.filters.de.pos = pos;
          renderDeutschView();
        });
        elements.dePosPills.appendChild(btn);
      });
    }

    if (elements.deTagPills) {
      deTagSet.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'filter-pill';
        btn.dataset.tag = tag;
        btn.textContent = `#${tag}`;
        btn.addEventListener('click', () => {
          elements.deTagPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          state.filters.de.tag = tag;
          renderDeutschView();
        });
        elements.deTagPills.appendChild(btn);
      });
    }
  }

  /**
   * Filter and Render English View
   */
  function renderEnglishView() {
    if (!elements.enVocabGrid) return;
    const { search, pos, tag } = state.filters.en;
    const q = search.trim().toLowerCase();

    const filtered = state.enWords.filter(item => {
      // Search match
      if (q) {
        const wordMatch = item.word.toLowerCase().includes(q);
        const meaningMatch = item.senses.some(s => s.meaning && s.meaning.toLowerCase().includes(q));
        const exampleMatch = item.senses.some(s => (s.examples || []).some(e => e.text.toLowerCase().includes(q) || e.translation.includes(q)));
        if (!wordMatch && !meaningMatch && !exampleMatch) return false;
      }
      // POS match
      if (pos !== 'all') {
        const hasPos = item.senses.some(s => s.pos === pos);
        if (!hasPos) return false;
      }
      // Tag match
      if (tag !== 'all') {
        const hasTag = item.senses.some(s => (s.tags || []).includes(tag));
        if (!hasTag) return false;
      }
      return true;
    });

    if (elements.enResultCount) elements.enResultCount.textContent = filtered.length;
    elements.enVocabGrid.innerHTML = '';
    if (filtered.length === 0) {
      elements.enVocabGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h3 class="empty-title">查無符合條件的英文詞彙</h3>
          <p class="empty-desc">請嘗試放寬搜尋關鍵字或清除篩選條件。</p>
        </div>`;
    } else {
      filtered.forEach(item => {
        elements.enVocabGrid.appendChild(createVocabCardElement(item));
      });
    }
  }

  /**
   * Filter and Render Deutsch View
   */
  function renderDeutschView() {
    if (!elements.deVocabGrid) return;
    const { search, article, pos, tag } = state.filters.de;
    const q = search.trim().toLowerCase();

    const filtered = state.deWords.filter(item => {
      // Search match
      if (q) {
        const wordMatch = item.word.toLowerCase().includes(q);
        const dispMatch = (item.display_title || '').toLowerCase().includes(q);
        const meaningMatch = item.senses.some(s => s.meaning && s.meaning.toLowerCase().includes(q));
        const exampleMatch = item.senses.some(s => (s.examples || []).some(e => e.text.toLowerCase().includes(q) || e.translation.includes(q)));
        if (!wordMatch && !dispMatch && !meaningMatch && !exampleMatch) return false;
      }
      // Article match
      if (article !== 'all') {
        if (article === 'none') {
          if (item.article) return false;
        } else {
          if (item.article !== article) return false;
        }
      }
      // POS match
      if (pos !== 'all') {
        const hasPos = item.senses.some(s => s.pos === pos);
        if (!hasPos) return false;
      }
      // Tag match
      if (tag !== 'all') {
        const hasTag = item.senses.some(s => (s.tags || []).includes(tag));
        if (!hasTag) return false;
      }
      return true;
    });

    if (elements.deResultCount) elements.deResultCount.textContent = filtered.length;
    elements.deVocabGrid.innerHTML = '';
    if (filtered.length === 0) {
      elements.deVocabGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h3 class="empty-title">查無符合條件的德文詞彙</h3>
          <p class="empty-desc">請嘗試放寬搜尋關鍵字或調整冠詞與分類篩選。</p>
        </div>`;
    } else {
      filtered.forEach(item => {
        elements.deVocabGrid.appendChild(createVocabCardElement(item));
      });
    }
  }

  /**
   * Filter and Render Favorites View
   */
  function renderFavoritesView() {
    if (!elements.favVocabGrid) return;
    const favItems = state.knowledge.filter(item => state.favorites.has(item.id));
    const langFilter = state.filters.fav.lang;

    const filtered = favItems.filter(item => {
      if (langFilter === 'all') return true;
      return item.lang === langFilter;
    });

    if (elements.favResultCount) elements.favResultCount.textContent = filtered.length;

    if (favItems.length === 0) {
      elements.favVocabGrid.style.display = 'none';
      if (elements.favEmptyState) elements.favEmptyState.style.display = 'block';
    } else {
      elements.favEmptyState.style.display = 'none';
      elements.favVocabGrid.style.display = 'grid';
      elements.favVocabGrid.innerHTML = '';

      if (filtered.length === 0) {
        elements.favVocabGrid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <h3 class="empty-title">在此語言分類下尚無收藏</h3>
            <p class="empty-desc">您已收藏其他語言的詞彙，可點擊上方切換為「全部語言」。</p>
          </div>`;
      } else {
        filtered.forEach(item => {
          elements.favVocabGrid.appendChild(createVocabCardElement(item));
        });
      }
    }
  }

  /**
   * Create a DOM Element for a Vocabulary Card
   */
  function createVocabCardElement(item) {
    const card = document.createElement('div');
    card.className = 'vocab-card';
    card.dataset.id = item.id;

    const isFav = state.favorites.has(item.id);
    const mainSense = (item.senses && item.senses[0]) || {};
    const pos = mainSense.pos || '';
    const meaning = mainSense.meaning || '';
    const firstEx = (mainSense.examples && mainSense.examples[0]) || null;
    const displayTitle = item.display_title || item.word;
    const speechLang = item.lang === 'de' ? 'de-DE' : 'en-US';
    const wordSpeechText = item.lang === 'de' ? displayTitle : item.word;

    // Build Card HTML
    card.innerHTML = `
      <div>
        <div class="card-header">
          <div class="card-title-group">
            <div class="card-title-row">
              <h3 class="card-title">${escapeHTML(displayTitle)}</h3>
              <button class="audio-btn word-audio-btn" aria-label="播放發音" title="播放發音" data-speech="${escapeHTML(wordSpeechText)}" data-lang="${speechLang}">
                ${SVG_VOLUME}
              </button>
            </div>
            <div class="card-meta-line">
              ${item.ipa ? `<span class="card-ipa">${escapeHTML(item.ipa)}</span> · ` : ''}
              <span class="pos-tag">${escapeHTML(pos)}</span>
            </div>
          </div>
          <button class="star-btn ${isFav ? 'active' : ''}" data-id="${item.id}" aria-label="${isFav ? '取消收藏' : '加到收藏'}" title="${isFav ? '取消收藏' : '加到收藏'}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>
        </div>

        <div class="card-body">
          <div class="card-meaning">${escapeHTML(meaning)}</div>
          ${item.article ? `<div class="card-grammar-note">冠詞：<strong>${escapeHTML(item.article)}</strong> · 複數：${item.plural ? escapeHTML(item.plural) : (item.plural_note ? escapeHTML(item.plural_note) : '無複數')}</div>` : ''}
          ${firstEx ? `
            <div class="card-example-preview">
              <div class="example-line-wrapper">
                <span>"${escapeHTML(firstEx.text)}"</span>
                <button class="audio-btn example-audio-btn" aria-label="播放例句發音" title="播放例句發音" data-speech="${escapeHTML(firstEx.text)}" data-lang="${speechLang}">
                  ${SVG_VOLUME}
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>

      <div class="card-footer">
        <div class="card-tags-list">
          ${(mainSense.tags || []).slice(0, 3).map(t => `<span class="mini-tag">#${escapeHTML(t)}</span>`).join('')}
        </div>
        <span style="color: var(--color-primary); font-weight: 500;">查看詳情 →</span>
      </div>
    `;

    // Event listener for star
    const starBtn = card.querySelector('.star-btn');
    starBtn.addEventListener('click', (e) => {
      toggleFavorite(item.id, e);
    });

    // Event listener for word audio
    const wordAudioBtn = card.querySelector('.word-audio-btn');
    if (wordAudioBtn) {
      wordAudioBtn.addEventListener('click', (e) => {
        speakText(wordSpeechText, speechLang, e, wordAudioBtn);
      });
    }

    // Event listener for example audio
    const exampleAudioBtn = card.querySelector('.example-audio-btn');
    if (exampleAudioBtn && firstEx) {
      exampleAudioBtn.addEventListener('click', (e) => {
        speakText(firstEx.text, speechLang, e, exampleAudioBtn);
      });
    }

    // Event listener for opening detail modal
    card.addEventListener('click', () => {
      openDetailModal(item);
    });

    return card;
  }

  /**
   * Open Vocabulary Detail Modal
   */
  function openDetailModal(item) {
    if (!elements.detailModal) return;

    const displayTitle = item.display_title || item.word;
    const speechLang = item.lang === 'de' ? 'de-DE' : 'en-US';
    const wordSpeechText = item.lang === 'de' ? displayTitle : item.word;

    elements.modalTitle.textContent = displayTitle;

    // Modal Audio Button
    if (elements.modalAudioSlot) {
      elements.modalAudioSlot.innerHTML = `
        <button class="audio-btn modal-word-audio" aria-label="播放單字發音" title="播放單字發音" style="width: 36px; height: 36px;">
          ${SVG_VOLUME}
        </button>
      `;
      const modalAudioBtn = elements.modalAudioSlot.querySelector('.modal-word-audio');
      if (modalAudioBtn) {
        modalAudioBtn.addEventListener('click', (e) => {
          speakText(wordSpeechText, speechLang, e, modalAudioBtn);
        });
      }
    }

    // Meta line
    const metaParts = [];
    if (item.ipa) metaParts.push(`<span class="card-ipa">${escapeHTML(item.ipa)}</span>`);
    const allPos = Array.from(new Set(item.senses.map(s => s.pos)));
    allPos.forEach(p => metaParts.push(`<span class="pos-tag">${escapeHTML(p)}</span>`));
    elements.modalMeta.innerHTML = metaParts.join(' · ');

    // Grammar section (German nouns)
    if (item.article) {
      elements.modalGrammarSection.style.display = 'block';
      const plText = item.plural ? `die ${escapeHTML(item.plural)}` : `無常用複數（${escapeHTML(item.plural_note || '單數專用')}）`;
      elements.modalGrammarContent.innerHTML = `
        <div style="font-size: 0.95rem; line-height: 1.6;">
          <p><strong>名詞冠詞</strong>：<code>${escapeHTML(item.article)}</code></p>
          <p><strong>複數形式</strong>：${plText}</p>
        </div>
      `;
    } else {
      elements.modalGrammarSection.style.display = 'none';
    }

    // Meaning content
    elements.modalMeaningContent.innerHTML = item.senses.map((s, idx) => {
      return `<div>${item.senses.length > 1 ? `<strong>義項 ${idx + 1} (${s.pos})</strong>：` : ''}${escapeHTML(s.meaning)}</div>`;
    }).join('');

    // Collocations & Synonyms
    const allColls = [];
    const allSyns = [];
    item.senses.forEach(s => {
      if (s.collocations) allColls.push(...s.collocations);
      if (s.synonyms) allSyns.push(...s.synonyms);
    });

    if (allColls.length > 0 || allSyns.length > 0) {
      elements.modalCollocationsSection.style.display = 'block';
      let html = '';
      if (allColls.length > 0) {
        html += `<p style="margin-bottom: 0.4rem;"><strong>常見搭配詞</strong>：${allColls.map(c => `<code style="background: var(--bg-subtle); padding: 2px 6px; border-radius: 4px; margin-right: 6px;">${escapeHTML(c)}</code>`).join('')}</p>`;
      }
      if (allSyns.length > 0) {
        html += `<p><strong>近義詞／同義詞</strong>：${allSyns.map(sy => `<span style="margin-right: 8px; color: var(--color-primary);">${escapeHTML(sy)}</span>`).join('')}</p>`;
      }
      elements.modalCollocationsContent.innerHTML = html;
    } else {
      elements.modalCollocationsSection.style.display = 'none';
    }

    // Examples list
    elements.modalExamplesList.innerHTML = '';
    let exCount = 0;
    item.senses.forEach(s => {
      (s.examples || []).forEach(ex => {
        exCount++;
        const li = document.createElement('li');
        li.className = 'modal-example-item';
        const isAI = ex.type === 'ai_generated';
        li.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <span class="example-type-badge ${isAI ? 'ai' : 'quote'}">${isAI ? '[AI補充教學例句]' : '[來源引文]'}</span>
            <button class="audio-btn modal-ex-audio" aria-label="播放例句發音" title="播放例句發音">
              ${SVG_VOLUME}
            </button>
          </div>
          <div class="modal-example-text">"${escapeHTML(ex.text)}"</div>
          <div class="modal-example-trans">${escapeHTML(ex.translation)}</div>
        `;
        const exAudioBtn = li.querySelector('.modal-ex-audio');
        if (exAudioBtn) {
          exAudioBtn.addEventListener('click', (e) => {
            speakText(ex.text, speechLang, e, exAudioBtn);
          });
        }
        elements.modalExamplesList.appendChild(li);
      });
    });

    if (exCount === 0) {
      elements.modalExamplesList.innerHTML = '<li style="color: var(--color-text-muted);">尚無例句紀錄</li>';
    }

    // Source & Tags
    const tags = Array.from(new Set(item.senses.flatMap(s => s.tags || [])));
    const relSources = item.related || [];
    elements.modalSourceContent.innerHTML = `
      <p style="margin-bottom: 0.35rem;"><strong>主題標籤</strong>：${tags.map(t => `<span class="mini-tag" style="margin-right: 4px;">#${escapeHTML(t)}</span>`).join('')}</p>
      ${relSources.length > 0 ? `<p><strong>關聯來源</strong>：${relSources.map(r => `<span style="color: var(--color-primary);">${escapeHTML(r)}</span>`).join(', ')}</p>` : ''}
      <p style="margin-top: 0.35rem; font-size: 0.82rem; color: var(--color-text-light);">穩定識別碼：<code>${escapeHTML(item.id)}</code> · 更新於：${escapeHTML(item.updated || item.created)}</p>
    `;

    elements.detailModal.classList.add('open');
  }

  /**
   * Close Detail Modal
   */
  function closeDetailModal() {
    if (elements.detailModal) {
      elements.detailModal.classList.remove('open');
    }
  }

  /**
   * Router: Switch View by Hash
   */
  function switchView(target) {
    const validViews = ['home', 'en', 'de', 'favorites'];
    const viewName = validViews.includes(target) ? target : 'home';
    state.currentView = viewName;

    // Toggle View Sections
    Object.keys(elements.views).forEach(key => {
      const el = elements.views[key];
      if (el) {
        el.classList.toggle('active', key === viewName);
      }
    });

    // Update Nav Link Active Class
    elements.navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.view === viewName);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh corresponding views
    if (viewName === 'en') renderEnglishView();
    if (viewName === 'de') renderDeutschView();
    if (viewName === 'favorites') renderFavoritesView();
  }

  /**
   * Helper: Escape HTML to Prevent XSS
   */
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Attach All Event Listeners
   */
  function attachEventListeners() {
    // Router Hashchange
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace(/^#/, '');
      switchView(hash);
    });

    // Header scroll elevation
    window.addEventListener('scroll', () => {
      const header = document.getElementById('siteHeader');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 20);
      }
    });

    // Modal Close
    if (elements.modalCloseBtn) {
      elements.modalCloseBtn.addEventListener('click', closeDetailModal);
    }
    if (elements.detailModal) {
      elements.detailModal.addEventListener('click', (e) => {
        if (e.target === elements.detailModal) closeDetailModal();
      });
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDetailModal();
    });

    // English Search Input
    if (elements.enSearchInput) {
      elements.enSearchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        state.filters.en.search = val;
        if (elements.enSearchClear) {
          elements.enSearchClear.classList.toggle('visible', val.length > 0);
        }
        renderEnglishView();
      });
    }
    if (elements.enSearchClear) {
      elements.enSearchClear.addEventListener('click', () => {
        elements.enSearchInput.value = '';
        state.filters.en.search = '';
        elements.enSearchClear.classList.remove('visible');
        renderEnglishView();
      });
    }

    // English Default "All" POS Pill
    if (elements.enPosPills) {
      const allPosBtn = elements.enPosPills.querySelector('[data-pos="all"]');
      if (allPosBtn) {
        allPosBtn.addEventListener('click', () => {
          elements.enPosPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          allPosBtn.classList.add('active');
          state.filters.en.pos = 'all';
          renderEnglishView();
        });
      }
    }

    // English Default "All" Tag Pill
    if (elements.enTagPills) {
      const allTagBtn = elements.enTagPills.querySelector('[data-tag="all"]');
      if (allTagBtn) {
        allTagBtn.addEventListener('click', () => {
          elements.enTagPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          allTagBtn.classList.add('active');
          state.filters.en.tag = 'all';
          renderEnglishView();
        });
      }
    }

    // Deutsch Search Input
    if (elements.deSearchInput) {
      elements.deSearchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        state.filters.de.search = val;
        if (elements.deSearchClear) {
          elements.deSearchClear.classList.toggle('visible', val.length > 0);
        }
        renderDeutschView();
      });
    }
    if (elements.deSearchClear) {
      elements.deSearchClear.addEventListener('click', () => {
        elements.deSearchInput.value = '';
        state.filters.de.search = '';
        elements.deSearchClear.classList.remove('visible');
        renderDeutschView();
      });
    }

    // Deutsch Article Pills
    if (elements.deArticlePills) {
      elements.deArticlePills.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          elements.deArticlePills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          state.filters.de.article = btn.dataset.article;
          renderDeutschView();
        });
      });
    }

    // Deutsch Default "All" POS Pill
    if (elements.dePosPills) {
      const allPosBtn = elements.dePosPills.querySelector('[data-pos="all"]');
      if (allPosBtn) {
        allPosBtn.addEventListener('click', () => {
          elements.dePosPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          allPosBtn.classList.add('active');
          state.filters.de.pos = 'all';
          renderDeutschView();
        });
      }
    }

    // Deutsch Default "All" Tag Pill
    if (elements.deTagPills) {
      const allTagBtn = elements.deTagPills.querySelector('[data-tag="all"]');
      if (allTagBtn) {
        allTagBtn.addEventListener('click', () => {
          elements.deTagPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          allTagBtn.classList.add('active');
          state.filters.de.tag = 'all';
          renderDeutschView();
        });
      }
    }

    // Favorites Language Filter
    if (elements.favLangPills) {
      elements.favLangPills.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          elements.favLangPills.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          state.filters.fav.lang = btn.dataset.lang;
          renderFavoritesView();
        });
      });
    }
  }

  /**
   * Main App Bootstrapper
   */
  async function init() {
    initFavorites();
    attachEventListeners();

    // Initialize View based on URL Hash
    const initHash = window.location.hash.replace(/^#/, '');
    switchView(initHash);

    // Fetch JSON Knowledge
    await loadKnowledgeData();
  }

  // Boot on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

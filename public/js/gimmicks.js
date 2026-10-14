/**
 * 手塚雄二サイト — ギミック（Project Seven 非依存）
 */
(function () {
  'use strict';

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.from((ctx || document).querySelectorAll(sel));
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* ---- Ken Burns オプション解析 (igmPZ) ---- */
  function parseKenBurns(rel) {
    var parts = (rel || 'igmPZ-2-2-2-2-12-1.1-1.6').split('-');
    function align(v) {
      var n = parseInt(v, 10);
      if (n >= 1 && n <= 3) return n;
      return Math.floor(Math.random() * 3) + 1;
    }
    return {
      startV: align(parts[1]),
      startH: align(parts[2]),
      endV: align(parts[3]),
      endH: align(parts[4]),
      duration: (parseFloat(parts[5]) || 12) * 1000,
      scaleStart: parseFloat(parts[6]) || 1.1,
      scaleEnd: parseFloat(parts[7]) || 1.6,
    };
  }

  function alignOffset(v) {
    var map = { 1: 0, 2: -4, 3: -8 };
    return map[v] || 0;
  }

  function kenBurnsTransform(opts, end) {
    var x = end ? alignOffset(opts.endH) : alignOffset(opts.startH);
    var y = end ? alignOffset(opts.endV) : alignOffset(opts.startV);
    var s = end ? opts.scaleEnd : opts.scaleStart;
    return 'translate(-50%, -50%) scale(' + s + ') translate(' + x + '%, ' + y + '%)';
  }

  /** フルサイズ JPEG href → 表示用軽量 URL（WebP 優先） */
  function coverDisplayUrls(jpgHref) {
    var base = (jpgHref || '').replace(/\.jpg$/i, '');
    return {
      webp: base + '-1000w.webp',
      jpg: base + '-1000w.jpg',
      legacy: jpgHref,
    };
  }

  function layerImage(layer) {
    return $('picture img', layer) || $('img', layer);
  }

  /** Fisher–Yates: 0..len-1 のランダム並び（全枚を1周するたびに再シャッフル） */
  function shuffledIndices(len) {
    var arr = [];
    var i;
    for (i = 0; i < len; i++) arr.push(i);
    for (i = len - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function newPlayOrder(slideCount, avoidFirstIndex) {
    if (slideCount <= 1) return [0];
    var order;
    do {
      order = shuffledIndices(slideCount);
    } while (order[0] === avoidFirstIndex);
    return order;
  }

  function assignSlideImage(img, jpgHref, title, onReady) {
    var urls = coverDisplayUrls(jpgHref);
    img.alt = title || '';
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      if (onReady) onReady();
    }
    if (img.dataset.slideSrc === jpgHref && img.complete && img.naturalWidth > 0) {
      finish();
      return;
    }
    img.dataset.slideSrc = jpgHref;
    img.onload = finish;
    img.onerror = function tryJpg() {
      img.onerror = function tryLegacy() {
        img.onerror = finish;
        img.src = urls.legacy;
      };
      img.src = urls.jpg;
    };
    img.src = urls.webp;
    if (img.complete && img.naturalWidth > 0) finish();
  }

  /* ---- カバー画像スライドショー（Ken Burns） ---- */
  function initCoverSlideshow() {
    var root = $('#p7IGM_1');
    if (!root) return;

    var viewport = $('#p7IGMimgwrapper_1');
    var links = $$('.p7IGM03_thumbslist li a', root);
    if (!viewport || links.length === 0) return;

    var slides = links.map(function (a) {
      return {
        src: a.getAttribute('href'),
        title: a.getAttribute('title') || '',
        kb: parseKenBurns(a.getAttribute('rel')),
      };
    });

    viewport.classList.add('ken-burns-viewport');
    if (!$('.ken-burns-stage', viewport)) {
      viewport.innerHTML =
        '<div class="ken-burns-stage">' +
        '<div class="ken-burns-layer layer-a is-visible ken-burns-layer--initial"><img alt="" width="1000" height="521" decoding="async" /></div>' +
        '<div class="ken-burns-layer layer-b"><img alt="" width="1000" height="521" decoding="async" /></div>' +
        '</div>';
    }

    var layers = $$('.ken-burns-layer', viewport);
    var activeLayer = 0;
    var index = 0;
    var slideTimer = null;
    var playOrder = newPlayOrder(slides.length, -1);
    var playPos = 0;

    links.forEach(function (a, i) {
      a.style.backgroundImage = 'url(' + coverDisplayUrls(slides[i].src).webp + ')';
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var pos = playOrder.indexOf(i);
        if (pos === -1) {
          playOrder = newPlayOrder(slides.length, index);
          playPos = 0;
          while (playOrder[playPos] !== i && playPos < playOrder.length - 1) playPos++;
        } else {
          playPos = pos;
        }
        transitionToSlide(i);
      });
    });

    function setActiveThumb(i) {
      links.forEach(function (a, j) {
        a.classList.toggle('is-active', j === i);
      });
    }

    function clearTimers() {
      clearTimeout(slideTimer);
    }

    function startKenBurnsAnim(img, kb) {
      img.classList.remove('kb-running');
      img.style.transition = 'none';
      img.style.transform = kenBurnsTransform(kb, false);
      void img.offsetWidth;
      img.style.transition = 'transform ' + (kb.duration / 1000) + 's linear';
      img.classList.add('kb-running');
      img.style.transform = kenBurnsTransform(kb, true);
    }

    function runKenBurns(layerIdx, slideIdx) {
      var layer = layers[layerIdx];
      var img = layerImage(layer);
      var slide = slides[slideIdx];
      var kb = slide.kb;
      if (!img) return;

      assignSlideImage(img, slide.src, slide.title, function () {
        startKenBurnsAnim(img, kb);
      });
    }

    function scheduleNextInPlayOrder() {
      var kb = slides[index].kb;
      slideTimer = setTimeout(advancePlayOrder, kb.duration + 600);
    }

    function advancePlayOrder() {
      playPos++;
      if (playPos >= slides.length) {
        playOrder = newPlayOrder(slides.length, index);
        playPos = 0;
      }
      transitionToSlide(playOrder[playPos]);
    }

    function transitionToSlide(slideIdx) {
      clearTimers();
      var nextLayer = activeLayer === 0 ? 1 : 0;

      runKenBurns(nextLayer, slideIdx);

      layers[activeLayer].classList.remove('is-visible', 'ken-burns-layer--initial');
      layers[nextLayer].classList.remove('ken-burns-layer--initial');
      layers[nextLayer].classList.add('is-visible');
      activeLayer = nextLayer;
      index = slideIdx;

      setActiveThumb(index);
      scheduleNextInPlayOrder();
    }

    var left = $('#p7IGMleft_1');
    var right = $('#p7IGMright_1');
    if (left) {
      left.addEventListener('click', function (e) {
        e.preventDefault();
        if (playPos > 0) {
          playPos--;
        } else {
          playOrder = newPlayOrder(slides.length, index);
          playPos = playOrder.length - 1;
        }
        transitionToSlide(playOrder[playPos]);
      });
    }
    if (right) {
      right.addEventListener('click', function (e) {
        e.preventDefault();
        advancePlayOrder();
      });
    }

    index = playOrder[0];
    playPos = 0;
    setActiveThumb(index);
    var firstImg = layerImage(layers[0]);
    if (index === 0 && firstImg && firstImg.getAttribute('src')) {
      startKenBurnsAnim(firstImg, slides[0].kb);
    } else {
      runKenBurns(0, index);
    }
    scheduleNextInPlayOrder();

    if ('IntersectionObserver' in window) {
      var pauseObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            viewport.classList.toggle('ken-burns-paused', !entry.isIntersecting);
          });
        },
        { threshold: 0.05 }
      );
      pauseObserver.observe(viewport);
    }

    root.classList.remove('IGMnoscript');
  }

  /* ---- タブパネル ---- */
  function initTabs() {
    var root = $('#p7OPM_1');
    if (!root) return;

    var tabs = $$('#p7OPMtb_1 ul li a', root);
    var panels = $$('.opm-panel', root);
    if (tabs.length === 0 || panels.length === 0) return;

    function activate(i) {
      tabs.forEach(function (t, j) {
        t.classList.toggle('open', j === i);
      });
      panels.forEach(function (p, j) {
        p.classList.toggle('is-active', j === i);
      });
      document.dispatchEvent(new CustomEvent('opm-tab-changed', { detail: { index: i } }));
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function (e) {
        e.preventDefault();
        var hero = $('#p7IGMimgwrapper_1');
        if (hero) hero.classList.add('ken-burns-paused');
        activate(i);
        requestAnimationFrame(function () {
          if (hero) hero.classList.remove('ken-burns-paused');
        });
      });
    });

    activate(0);
    root.classList.remove('opm-noscript');
  }

  /* ---- スクロールトップ ---- */
  function initScrollTop() {
    var buttons = ['#p7STT_1', '#p7STT_2'].map(function (s) { return $(s); }).filter(Boolean);
    if (buttons.length === 0) return;

    buttons.forEach(function (btn) {
      var anchor = $('.p7STT-anchor', btn);
      if (anchor) {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
    });

    window.addEventListener('scroll', function () {
      var show = window.scrollY > 200;
      buttons.forEach(function (btn) {
        btn.classList.toggle('is-visible', show);
      });
    }, { passive: true });
  }

  /* ---- 記事内画像 ---- */
  function initImageBlocks() {
    $$('.p7IR2').forEach(function (block) {
      var listItems = $$('.p7ir2-list li', block);
      var box = $('.p7ir2-box', block);
      if (!box || listItems.length === 0) return;

      var slides = listItems.map(function (li) {
        var a = $('a', li);
        var desc = $('.p7ir2_desc', li);
        var extLink = $('.p7ir2_link a', li);
        return {
          src: a ? a.getAttribute('href') : '',
          alt: a ? a.textContent.trim() : '',
          desc: desc ? desc.textContent.trim() : '',
          href: extLink ? extLink.getAttribute('href') : '',
        };
      }).filter(function (s) { return s.src; });

      if (slides.length === 0) return;

      var idx = 0;
      var slideEl = $('.p7ir2-slide', box);

      function render() {
        var s = slides[idx];
        var html = s.href
          ? '<a class="p7ir2-link" href="' + s.href + '" target="_blank" rel="noopener">'
            + '<img class="p7ir2-image" src="' + s.src + '" alt="' + s.alt + '"></a>'
          : '<img class="p7ir2-image" src="' + s.src + '" alt="' + s.alt + '">';
        if (slideEl) slideEl.innerHTML = html;

        var existingDesc = $('.p7ir2_desc', block);
        if (existingDesc) existingDesc.remove();
        if (s.desc) {
          var d = document.createElement('div');
          d.className = 'p7ir2_desc under-image trans-left';
          d.textContent = s.desc;
          box.parentElement.appendChild(d);
        }
      }

      render();

      if (slides.length > 1) {
        var interval = setInterval(function () {
          idx = (idx + 1) % slides.length;
          render();
        }, 8000);
        block._ir2Timer = interval;
      }
    });
  }

  /* ---- ライトボックス ---- */
  function initLightbox() {
    var openPanel = null;

    function close() {
      if (openPanel) {
        openPanel.classList.remove('is-open');
        openPanel = null;
        document.body.style.overflow = '';
      }
    }

    $$('.pbx-trigger[data-pbx]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var id = trigger.getAttribute('data-pbx').split(',')[0];
        var panelId = id.replace('p7PBX_', 'p7PBXp_');
        var panel = document.getElementById(panelId);
        if (!panel) return;
        close();
        panel.classList.add('is-open');
        openPanel = panel;
        document.body.style.overflow = 'hidden';
      });
    });

    $$('.pbx-panel .pbx-close a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        close();
      });
    });

    $$('.pbx-panel').forEach(function (panel) {
      panel.addEventListener('click', function (e) {
        if (e.target === panel) close();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    initModalGallery();
  }

  /* ---- モーダル内ギャラリー ---- */
  function initModalGallery() {
    var gallery = $('#p7IRM_1');
    if (!gallery) return;

    var listItems = $$('#p7IRMlist_1 li', gallery);
    var imgEl = $('#p7IRMim_1');
    var pagLinks = $$('#p7IRMpg_1 a', gallery);
    if (!imgEl || listItems.length === 0) return;

    var items = listItems.map(function (li) {
      var a = $('a', li);
      return { src: a.getAttribute('href'), title: a.textContent.trim() };
    });

    var idx = 0;
    var timer = null;

    function show(i) {
      idx = i;
      imgEl.src = items[idx].src;
      imgEl.alt = items[idx].title;
      var link = $('#p7IRMlk_1');
      if (link) link.title = items[idx].title;
      pagLinks.forEach(function (a, j) {
        a.classList.toggle('is-active', j === idx);
      });
    }

    pagLinks.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        show(i);
        resetTimer();
      });
    });

    function resetTimer() {
      clearInterval(timer);
      if (items.length > 1) {
        timer = setInterval(function () {
          show((idx + 1) % items.length);
        }, 8000);
      }
    }

    show(0);
    resetTimer();
  }

  /* ---- テキストエフェクト ---- */
  function initTextEffect() {
    var el = $('#p7HFXc_4');
    if (!el) return;
    setInterval(function () {
      el.classList.add('is-glow');
      setTimeout(function () { el.classList.remove('is-glow'); }, 1500);
    }, 5000);
  }

  /* ---- グラデーション背景 ---- */
  function initGradientBg() {
    $$('[data-gba-clr]').forEach(function (el) {
      var raw = el.getAttribute('data-gba-clr');
      if (!raw) return;
      var colors = raw.split('|').filter(Boolean);
      if (colors.length < 2) return;
      var step = 0;
      el.style.background = colors[0];
      setInterval(function () {
        step = (step + 1) % colors.length;
        el.style.background = colors[step];
      }, 3000);
    });
  }

  /* ---- スクロールフェードイン ---- */
  function initScrollReveal() {
    var contentRow = $('#p7LBM_1 > .lbm-row:last-child');
    if (!contentRow) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var selector = '.hmy-section:not(:has(.broadcast-notice)), .opm-panel-content .lbm-col-wrapper, .works-index-card';
    var items = $$(selector, contentRow);
    if (items.length === 0) return;

    items.forEach(function (el) {
      el.classList.add('scroll-reveal');
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    function setStagger(panel) {
      var panelItems = $$(selector, panel);
      panelItems.forEach(function (el, i) {
        el.style.setProperty('--reveal-index', String(Math.min(i, 8)));
      });
    }

    function observePanel(panel) {
      if (!panel || !panel.classList.contains('is-active')) return;
      setStagger(panel);
      $$(selector, panel).forEach(function (el) {
        if (!el.classList.contains('is-revealed')) {
          observer.observe(el);
        }
      });
    }

    function resetPanel(panel) {
      $$(selector, panel).forEach(function (el) {
        el.classList.remove('is-revealed');
        observer.unobserve(el);
      });
    }

    function refreshActivePanel() {
      var active = $('.opm-panel.is-active', contentRow);
      if (!active) return;
      resetPanel(active);
      requestAnimationFrame(function () {
        observePanel(active);
      });
    }

    $$('.opm-panel', contentRow).forEach(function (panel) {
      if (panel.classList.contains('is-active')) {
        observePanel(panel);
      }
    });

    document.addEventListener('opm-tab-changed', function () {
      refreshActivePanel();
    });
  }

  /* ---- noscript クラス解除 ---- */
  function revealContent() {
    $$('.hmy-noscript').forEach(function (el) {
      el.classList.remove('hmy-noscript');
    });
  }

  function runDeferred(fn) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fn, { timeout: 2000 });
    } else {
      setTimeout(fn, 1);
    }
  }

  onReady(function () {
    initCoverSlideshow();
    initTabs();
    initScrollTop();
    initImageBlocks();
    initLightbox();
    revealContent();
    runDeferred(function () {
      initTextEffect();
      initGradientBg();
      initScrollReveal();
    });
  });
})();

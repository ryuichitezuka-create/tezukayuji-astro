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

  /* ---- カバー画像スライドショー（Ken Burns） ---- */
  function initCoverSlideshow() {
    var root = $('#p7IGM_1');
    if (!root) return;

    var viewport = $('#p7IGMimgwrapper_1');
    var links = $$('.p7IGM03_thumbslist li a', root);
    if (!viewport || links.length === 0) return;

    var legacyImage = $('#p7IGMimage_1');
    if (legacyImage) legacyImage.classList.add('legacy-hidden');

    var slides = links.map(function (a) {
      return {
        src: a.getAttribute('href'),
        title: a.getAttribute('title') || '',
        kb: parseKenBurns(a.getAttribute('rel')),
      };
    });

    viewport.classList.add('ken-burns-viewport');
    viewport.innerHTML =
      '<div class="ken-burns-stage">' +
      '<div class="ken-burns-layer layer-a is-visible"><img alt="" /></div>' +
      '<div class="ken-burns-layer layer-b"><img alt="" /></div>' +
      '</div>';

    var layers = $$('.ken-burns-layer', viewport);
    var activeLayer = 0;
    var index = 0;
    var slideTimer = null;

    links.forEach(function (a, i) {
      a.style.backgroundImage = 'url(' + slides[i].src + ')';
      a.addEventListener('click', function (e) {
        e.preventDefault();
        goTo(i);
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
      var img = $('img', layer);
      var slide = slides[slideIdx];
      var kb = slide.kb;

      img.alt = slide.title;

      function afterLoad() {
        startKenBurnsAnim(img, kb);
      }

      if (img.getAttribute('src') !== slide.src) {
        img.onload = afterLoad;
        img.src = slide.src;
      } else {
        afterLoad();
      }
    }

    function goTo(i) {
      if (i < 0) i = slides.length - 1;
      if (i >= slides.length) i = 0;

      clearTimers();
      var nextLayer = activeLayer === 0 ? 1 : 0;

      runKenBurns(nextLayer, i);

      layers[activeLayer].classList.remove('is-visible');
      layers[nextLayer].classList.add('is-visible');
      activeLayer = nextLayer;
      index = i;

      setActiveThumb(index);

      var kb = slides[index].kb;
      slideTimer = setTimeout(function () {
        var next = index + 1 >= slides.length ? 0 : index + 1;
        goTo(next);
      }, kb.duration + 600);
    }

    var left = $('#p7IGMleft_1');
    var right = $('#p7IGMright_1');
    if (left) {
      left.addEventListener('click', function (e) {
        e.preventDefault();
        goTo(index - 1);
      });
    }
    if (right) {
      right.addEventListener('click', function (e) {
        e.preventDefault();
        goTo(index + 1 >= slides.length ? 0 : index + 1);
      });
    }

    setActiveThumb(0);
    runKenBurns(0, 0);
    slideTimer = setTimeout(function () {
      goTo(1);
    }, slides[0].kb.duration + 600);

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
        activate(i);
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

  onReady(function () {
    initCoverSlideshow();
    initTabs();
    initScrollTop();
    initImageBlocks();
    initLightbox();
    initTextEffect();
    initGradientBg();
    revealContent();
    initScrollReveal();
  });
})();

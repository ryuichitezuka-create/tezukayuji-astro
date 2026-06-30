/**
 * 院展ギャラリー（Project Seven 非依存）
 */
(function () {
  'use strict';

  function initGallery(root) {
    var dataEl = root.querySelector('.art-gallery-data');
    if (!dataEl) return;
    var slides = JSON.parse(dataEl.textContent);
    if (!slides.length) return;

    var mainImg = root.querySelector('.art-gallery-main img');
    var descEl = root.querySelector('.art-gallery-desc');
    var thumbsEl = root.querySelector('.art-gallery-thumbs');
    var index = 0;
    var timer = null;
    var playing = true;
    var INTERVAL = 8000;

    function cleanDesc(text) {
      return text.replace(/\s+\n/g, '\n').replace(/\n\s+/g, '\n').trim();
    }

    function buildThumbs() {
      thumbsEl.innerHTML = slides
        .map(function (s, i) {
          return (
            '<button type="button" class="art-gallery-thumb' +
            (i === 0 ? ' is-active' : '') +
            '" data-i="' +
            i +
            '">' +
            '<img src="' +
            s.thumb +
            '" alt="' +
            (s.title || '') +
            '">' +
            '</button>'
          );
        })
        .join('');
      thumbsEl.querySelectorAll('.art-gallery-thumb').forEach(function (btn) {
        btn.addEventListener('click', function () {
          show(parseInt(btn.getAttribute('data-i'), 10));
        });
      });
    }

    function scrollToActive(smooth) {
      var active = thumbsEl.querySelector('.art-gallery-thumb.is-active');
      if (!active) return;
      var left = active.offsetLeft - (thumbsEl.clientWidth - active.offsetWidth) / 2;
      var max = thumbsEl.scrollWidth - thumbsEl.clientWidth;
      if (left < 0) left = 0;
      if (left > max) left = max;
      thumbsEl.scrollTo({ left: left, behavior: smooth ? 'smooth' : 'auto' });
    }

    function scrollThumbs(direction) {
      thumbsEl.scrollBy({
        left: direction * Math.max(thumbsEl.clientWidth * 0.75, 120),
        behavior: 'smooth',
      });
    }

    function updateActiveThumb(smooth) {
      thumbsEl.querySelectorAll('.art-gallery-thumb').forEach(function (btn) {
        var i = parseInt(btn.getAttribute('data-i'), 10);
        btn.classList.toggle('is-active', i === index);
      });
      scrollToActive(smooth);
    }

    function show(i) {
      if (i < 0) i = slides.length - 1;
      if (i >= slides.length) i = 0;
      index = i;
      var s = slides[index];
      mainImg.src = s.full;
      mainImg.alt = s.title || '';
      descEl.innerHTML = cleanDesc(s.description).replace(/\n/g, '<br>');
      updateActiveThumb(true);
      resetTimer();
    }

    function resetTimer() {
      clearInterval(timer);
      if (playing) {
        timer = setInterval(function () {
          show(index + 1);
        }, INTERVAL);
      }
    }

    root.querySelector('[data-action="first"]').addEventListener('click', function () {
      show(0);
    });
    root.querySelector('[data-action="prev"]').addEventListener('click', function () {
      show(index - 1);
    });
    root.querySelector('[data-action="next"]').addEventListener('click', function () {
      show(index + 1);
    });
    root.querySelector('[data-action="last"]').addEventListener('click', function () {
      show(slides.length - 1);
    });
    root.querySelector('[data-action="play"]').addEventListener('click', function (e) {
      playing = !playing;
      e.currentTarget.textContent = playing ? '⏸' : '▶';
      resetTimer();
    });
    root.querySelector('[data-action="thumbs-prev"]').addEventListener('click', function () {
      scrollThumbs(-1);
    });
    root.querySelector('[data-action="thumbs-next"]').addEventListener('click', function () {
      scrollThumbs(1);
    });

    buildThumbs();
    show(0);
    window.addEventListener('resize', function () {
      scrollToActive(false);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.art-gallery').forEach(initGallery);
  });
})();

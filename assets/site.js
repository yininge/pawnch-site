(function () {
  'use strict';

  var LANGUAGE_KEY = 'pawnchLang';
  var html = document.documentElement;

  function metadata(field, lang) {
    var element = document.querySelector(
      'meta[name="pawnch:' + field + ':' + lang + '"]'
    );
    return element ? element.getAttribute('content') : '';
  }

  function detectLanguage() {
    var saved = localStorage.getItem(LANGUAGE_KEY);
    if (saved === 'zh' || saved === 'en') return saved;
    return (navigator.language || '').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en';
  }

  function updateVideos(lang) {
    // data-src prevents both localized videos from downloading at once. Only
    // the active language receives a media URL; the other video is unloaded.
    document.querySelectorAll('video[data-src]').forEach(function (video) {
      var isActive = video.classList.contains('lang-' + lang);
      if (isActive) {
        if (video.getAttribute('src') !== video.dataset.src) {
          video.setAttribute('src', video.dataset.src);
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      } else {
        video.pause();
        if (video.hasAttribute('src')) {
          video.removeAttribute('src');
          video.load();
        }
      }
    });
  }

  function applyLanguage(lang) {
    html.setAttribute('data-lang', lang);
    html.setAttribute('lang', lang === 'zh' ? 'zh-Hant' : 'en');
    document.querySelectorAll('[data-lang-btn]').forEach(function (button) {
      button.classList.toggle('active', button.getAttribute('data-lang-btn') === lang);
    });

    var title = metadata('title', lang);
    var description = metadata('description', lang);
    if (title) document.title = title;
    var descriptionElement = document.querySelector('meta[name="description"]');
    if (descriptionElement && description) {
      descriptionElement.setAttribute('content', description);
    }
    updateVideos(lang);
  }

  applyLanguage(detectLanguage());
  document.querySelectorAll('[data-lang-btn]').forEach(function (button) {
    button.addEventListener('click', function () {
      var lang = button.getAttribute('data-lang-btn');
      localStorage.setItem(LANGUAGE_KEY, lang);
      applyLanguage(lang);
    });
  });
})();

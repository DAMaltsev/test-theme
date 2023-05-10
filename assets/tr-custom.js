// Dropmenu adjustments
window.addEventListener('DOMContentLoaded', function () {
  var navigationMobile = document.getElementById('navigation-mobile');

  function registerDropmenu(desktopToggle, mobileToggle, dropmenu) {
    var backLink = dropmenu.querySelector('.navbar-dropmenu__back');

    desktopToggle.setAttribute('aria-expanded', false);

    var timeout = null;
    var isShown = false;

    function showMobileNav() {
      navigationMobile.style.visibility = '';
      navigationMobile.style.opacity = '';
    }

    function hideMobileNav() {
      navigationMobile.style.visibility = 'hidden';
      navigationMobile.style.opacity = 0;
    }

    function show() {
      if (timeout !== null) {
        clearTimeout(timeout);
        timeout = null;
      }

      if (isShown) {
        return;
      }

      isShown = true;
      dropmenu.classList.add('navbar-dropmenu--expanded');
      desktopToggle.setAttribute('aria-expanded', true);

      setTimeout(function () {
        dropmenu.addEventListener('mouseleave', leaveHandler);
        desktopToggle.addEventListener('mouseleave', leaveHandler);
        document.addEventListener('click', clickHandler);

        hideMobileNav();
      }, 150);
    }

    function hide() {
      dropmenu.removeEventListener('mouseleave', leaveHandler);
      desktopToggle.removeEventListener('mouseleave', leaveHandler);
      document.removeEventListener('click', clickHandler);

      showMobileNav();

      dropmenu.classList.remove('navbar-dropmenu--expanded');
      desktopToggle.setAttribute('aria-expanded', false);
      isShown = false;
    }

    function leaveHandler() {
      if (timeout !== null) {
        return;
      }

      timeout = setTimeout(function() {
        timeout = null;
        hide();
      }, 100);
    }

    function clickHandler(e) {
      if (dropmenu.contains(e.target)) {
        return;
      }

      hide();
    }

    dropmenu.addEventListener('mouseenter', show);
    desktopToggle.addEventListener('mouseenter', show);
    mobileToggle.addEventListener('click', function (e) {
      show();
      e.preventDefault();
    });
    backLink.addEventListener('click', function (e) {
      showMobileNav();
      setTimeout(hide, 150);
    });
    dropmenu.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  registerDropmenu(
    document.querySelector('#shopify-section-navigation-main a[href="/collections"]'),
    document.querySelector('#shopify-section-navigation-mobile a[href="/collections"]'),
    document.getElementById('hammocks-dropmenu')
  );
  registerDropmenu(
    document.querySelector('#shopify-section-navigation-main a[href="/collections#hammock-accessories"]'),
    document.querySelector('#shopify-section-navigation-mobile a[href="/collections#hammock-accessories"]'),
    document.getElementById('hangers-dropmenu')
  );
  registerDropmenu(
    document.querySelector('#shopify-section-navigation-main a[href="/collections#giftsets"]'),
    document.querySelector('#shopify-section-navigation-mobile a[href="/collections#giftsets"]'),
    document.getElementById('giftsets-dropmenu')
  );
});

// Video auto-play
window.addEventListener('DOMContentLoaded', function () {
  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const toggle = entry.target.querySelector('[data-toggle-video]');
          toggle && toggle.click();
        } else {
          const video = entry.target.querySelector('video');
          video.pause();
        }
      })
    }, {
      rootMargin: '0px',
      threshold: 0.5
    }
  );

  var elements = document.querySelectorAll('[data-component="inline-video"][data-autoplay]');
  for (var i = 0; i < elements.length; i++) {
    observer.observe(elements[i]);
  };
});

// Hero video play
window.addEventListener('DOMContentLoaded', function () {
  var hero = document.querySelector('#shopify-section-1587014178413');
  
  if(hero) {
	var heroVideo = hero.querySelector('video');
	var videoSrc = heroVideo.querySelector('source')
	
    heroVideo.setAttribute('src', videoSrc.dataset.src)
  }
})

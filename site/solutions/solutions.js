/* ============================================
   Collage.inc Solutions Pages — Scripts
   ============================================ */

(function () {
  'use strict';

  // --- Mobile Menu Toggle ---
  var menuBtn = document.querySelector('.header__menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('is-open');
      menuBtn.classList.toggle('is-active', isOpen);
      menuBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('.mobile-menu__sub a, .mobile-menu > ul > li > a, .mobile-menu__actions a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        menuBtn.classList.remove('is-active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Mobile dropdown toggles
    mobileMenu.querySelectorAll('.mobile-menu__toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var parent = toggle.parentElement;
        parent.classList.toggle('is-open');
      });
    });
  }

  // --- Solutions Dropdown Toggle ---
  var navItems = document.querySelectorAll('.header__nav-item');

  navItems.forEach(function (item) {
    var trigger = item.querySelector('.header__nav-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = item.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', isOpen);
    });

    // Close on hover out (desktop-friendly)
    item.addEventListener('mouseenter', function () {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    });

    item.addEventListener('mouseleave', function () {
      item.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function () {
    navItems.forEach(function (item) {
      item.classList.remove('is-open');
      var trigger = item.querySelector('.header__nav-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  });

  // --- Scroll Animations (IntersectionObserver) ---
  var animatedElements = document.querySelectorAll('.animate-in');

  if ('IntersectionObserver' in window && animatedElements.length > 0) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    animatedElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // --- Header scroll state ---
  var header = document.getElementById('header');

  if (header) {
    var onScroll = function () {
      if (window.scrollY > 10) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Decorative shapes fade-in on scroll ---
  var shapes = document.querySelectorAll('.deco-shape');

  if ('IntersectionObserver' in window && shapes.length > 0) {
    var shapeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            shapeObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    shapes.forEach(function (shape) {
      shapeObserver.observe(shape);
    });
  } else {
    shapes.forEach(function (shape) {
      shape.classList.add('is-visible');
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = document.querySelector('.header').offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });

        if (mobileMenu && mobileMenu.classList.contains('is-open')) {
          mobileMenu.classList.remove('is-open');
          menuBtn.classList.remove('is-active');
          menuBtn.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }
    });
  });
})();

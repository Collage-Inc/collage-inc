/* ============================================
   Collage.inc Homepage — Scripts
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

  // --- Dropdown Toggle ---
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

  // --- Personal email domain blocklist ---
  var personalDomains = [
    'gmail.com','googlemail.com','yahoo.com','yahoo.co.uk','hotmail.com',
    'hotmail.co.uk','outlook.com','live.com','msn.com','aol.com','icloud.com',
    'me.com','mac.com','mail.com','protonmail.com','proton.me','zoho.com',
    'yandex.com','gmx.com','gmx.net','fastmail.com','tutanota.com','hey.com'
  ];

  function isPersonalEmail(email) {
    var domain = (email || '').split('@')[1];
    return domain && personalDomains.indexOf(domain.toLowerCase()) !== -1;
  }

  // --- Formspree async form submission ---
  document.querySelectorAll('form[action*="formspree.io"]').forEach(function (form) {
    var emailInput = form.querySelector('input[type="email"]');
    var emailError = null;

    if (emailInput) {
      emailError = document.createElement('div');
      emailError.className = 'ct-form__email-error';
      emailError.setAttribute('role', 'alert');
      emailInput.parentNode.appendChild(emailError);

      emailInput.addEventListener('blur', function () {
        if (emailInput.value && isPersonalEmail(emailInput.value)) {
          emailError.textContent = 'Please use a work email address.';
          emailInput.classList.add('ct-form__input--error');
        } else {
          emailError.textContent = '';
          emailInput.classList.remove('ct-form__input--error');
        }
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Block personal emails
      if (emailInput && isPersonalEmail(emailInput.value)) {
        if (emailError) emailError.textContent = 'Please use a work email address.';
        if (emailInput) emailInput.classList.add('ct-form__input--error');
        emailInput.focus();
        return;
      }

      var btn = form.querySelector('[type="submit"]');
      var status = form.querySelector('.ct-form__status');
      var originalText = btn.textContent;

      btn.disabled = true;
      btn.textContent = 'Sending\u2026';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            if (status) {
              // Hide form fields, show success message
              Array.from(form.children).forEach(function (child) {
                if (child !== status) child.style.display = 'none';
              });
              status.className = 'ct-form__status ct-form__status--success';
              status.innerHTML =
                '<div class="ct-form__status-icon" style="background:#ecfdf5;color:#059669;">' +
                  '<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                '</div>' +
                '<div class="ct-form__status-heading">Message sent!</div>' +
                '<p class="ct-form__status-body">Thanks for reaching out. We\u2019ll be in touch within one business day.</p>';
            }
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(function () {
          if (status) {
            status.className = 'ct-form__status ct-form__status--error';
            status.innerHTML =
              '<div class="ct-form__status-icon" style="background:#fef2f2;color:#dc2626;">' +
                '<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '</div>' +
              '<div class="ct-form__status-heading">Something went wrong</div>' +
              '<p class="ct-form__status-body">Please try again. If the problem persists, reach out to us directly.</p>';
            btn.disabled = false;
            btn.textContent = originalText;
          }
        })
        .finally(function () {
          // Only re-enable button if not success (form is hidden on success)
          if (!status || !status.classList.contains('ct-form__status--success')) {
            btn.disabled = false;
            btn.textContent = originalText;
          }
        });
    });
  });

  // --- Blog Filter Pills ---
  var filterButtons = document.querySelectorAll('.blog-filter');

  if (filterButtons.length > 0) {
    var featurePost = document.querySelector('.blog-feature');
    var gridCards = document.querySelectorAll('.blog-grid-card');

    function matchesFilter(el, filter) {
      if (filter === 'all') return true;
      var categories = (el.getAttribute('data-category') || '').split(/\s+/);
      return categories.indexOf(filter) !== -1;
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        var filter = btn.getAttribute('data-filter');

        if (featurePost) {
          featurePost.style.display = matchesFilter(featurePost, filter) ? '' : 'none';
        }

        gridCards.forEach(function (card) {
          card.style.display = matchesFilter(card, filter) ? '' : 'none';
        });
      });
    });
  }

  // --- Logo carousel (rAF-driven, no CSS animation jump) ---
  var carouselTrack = document.querySelector('.logo-carousel__track');

  if (carouselTrack && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Remove the CSS animation so rAF takes over
    carouselTrack.style.animation = 'none';

    var pos = 0;
    var halfWidth = 0;
    var speed = window.innerWidth <= 768 ? 0.36 : 0.5; // px per frame

    function measureHalf() {
      // Half of the full track = width of one set of logos
      halfWidth = carouselTrack.scrollWidth / 2;
    }

    // Measure after images have had a chance to load
    if (document.readyState === 'complete') {
      measureHalf();
    } else {
      window.addEventListener('load', measureHalf);
    }

    function tick() {
      if (halfWidth > 0) {
        pos -= speed;
        if (pos <= -halfWidth) pos += halfWidth;
        carouselTrack.style.transform = 'translate3d(' + pos + 'px, 0, 0)';
      }
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
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

        // Close mobile menu if open
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

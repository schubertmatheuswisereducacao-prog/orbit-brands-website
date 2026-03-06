/* ============================================================
   ORBIT BRANDS — Main App JS
   ============================================================ */

(function () {
  'use strict';

  /* ── Nav scroll ────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile nav ────────────────────────────────────── */
  const burger = document.querySelector('.nav__burger');
  const mobileNav = document.querySelector('.nav__mobile');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      const spans = burger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  }

  /* ── Scroll Reveal ─────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Active nav link ───────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav__links a, .nav__mobile a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Phase accordion ───────────────────────────────── */
  const phases = document.querySelectorAll('.phase');
  if (phases.length) {
    // Open first by default
    phases[0]?.classList.add('active');

    phases.forEach(phase => {
      const header = phase.querySelector('.phase__header');
      if (!header) return;
      header.addEventListener('click', () => {
        const isActive = phase.classList.contains('active');
        phases.forEach(p => p.classList.remove('active'));
        if (!isActive) phase.classList.add('active');
      });
    });
  }

  /* ── Form submission ───────────────────────────────── */
  const form = document.getElementById('apply-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Enviando...';

      // Simulate / redirect to WhatsApp with pre-filled message
      const name = form.querySelector('#nome')?.value || '';
      const nicho = form.querySelector('#nicho')?.value || '';
      const followers = form.querySelector('#seguidores')?.value || '';
      const msg = encodeURIComponent(
        `Olá! Me chamo ${name}, atuo no nicho de ${nicho} e tenho ${followers} seguidores. Quero saber mais sobre o Método Orbit Partners.`
      );
      const wa = `https://wa.me/5547999887708?text=${msg}`;

      setTimeout(() => {
        window.open(wa, '_blank');
        btn.disabled = false;
        btn.textContent = 'Quero minha call de diagnóstico →';
      }, 800);
    });
  }

  /* ── Smooth anchor links ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Nicho tag hover sparkle ───────────────────────── */
  const nichos = document.querySelectorAll('.nicho');
  nichos.forEach(nicho => {
    nicho.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-3px) scale(1.02)';
    });
    nicho.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });

})();

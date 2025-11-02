

(() => {
  'use strict';

  /* -----------------------------
     Utilities
  ----------------------------- */
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* -----------------------------
     Cart: add/remove toggle + badge
  ----------------------------- */
  const cart = (() => {
    let count = 0;
    const badge = qs('#cart-count');
    const buttons = qsa('.add-to-cart');

    const setBadge = () => { if (badge) badge.textContent = String(count); };

    // initialize
    setBadge();

    const toggleHandler = (btn) => {
      const added = btn.getAttribute('data-added') === 'true';
      if (!added) {
        count++;
        btn.setAttribute('data-added', 'true');
        btn.textContent = 'Remove';
        btn.classList.remove('btn-outline-primary');
        btn.classList.add('btn-danger');
      } else {
        count = Math.max(0, count - 1);
        btn.setAttribute('data-added', 'false');
        btn.textContent = 'Add to Cart';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-outline-primary');
      }
      setBadge();
    };

    buttons.forEach(btn => {
      if (!btn.id) btn.id = `addbtn-${Math.random().toString(36).slice(2,9)}`;
      // initial state text
      const added = btn.getAttribute('data-added') === 'true';
      btn.textContent = added ? 'Remove' : 'Add to Cart';
      if (added) btn.classList.add('btn-danger');

      btn.addEventListener('click', () => toggleHandler(btn));
    });

    return { getCount: () => count };
  })();

  /* -----------------------------
     Navbar scroll effect
  ----------------------------- */
  const navbar = qs('.navbar');
  const onScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();


  // Contact form
  (function contact() {
    const form = qs('#contact-form');
    if (!form) return;
    const nameEl = qs('#contact-name', form);
    const emailEl = qs('#contact-email', form);
    const textEl = qs('#contact-message-text', form);
    const inlineMsg = qs('#contact-form-message', form) || qs('#contact-form-message');

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const showInline = (t, cls) => {
      if (!inlineMsg) return;
      inlineMsg.textContent = t;
      inlineMsg.className = cls;
      setTimeout(() => { inlineMsg.textContent = ''; inlineMsg.className = ''; }, 4000);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = nameEl.value.trim();
      const email = emailEl.value.trim();
      const txt = textEl.value.trim();

      if (!name) { showInline('Please enter your name.', 'text-danger'); nameEl.focus(); return; }
      if (!email || !emailRe.test(email)) { showInline('Please enter a valid email address.', 'text-danger'); emailEl.focus(); return; }
      if (!txt) { showInline('Please enter a message.', 'text-danger'); textEl.focus(); return; }

      // success: show inline + alert/toast fallback
      showInline('Message sent successfully! We will get back to you soon.', 'text-success');

      // try alert, fallback to toast if alert is blocked
      let alerted = false;
      try { window.alert('Message sent successfully! We will get back to you soon.'); alerted = true; } catch (err) { alerted = false; }
      if (!alerted) {
        try { const toastEl = qs('#contact-toast'); if (toastEl) new bootstrap.Toast(toastEl, { delay: 4000 }).show(); } catch (err) { /* noop */ }
      }

      form.reset();
      if (nameEl) nameEl.focus();
    });
  })();

})();

const btn = document.getElementById('theme-toggle');
const body = document.body;

if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
  btn.textContent = '☀️';
}

btn.onclick = () => {
  body.classList.toggle('dark-mode');
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    btn.textContent = '☀️';
  } else {
    localStorage.setItem('theme', 'light');
    btn.textContent = '🌙';
  }
};
console.log('Dark mode toggled!');



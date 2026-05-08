const body = document.body;
const themeToggle = document.querySelector('.pf-theme-toggle');
const menuButton = document.querySelector('.pf-menu-btn');
const navLinks = document.querySelector('.pf-nav-links');
const navAnchors = document.querySelectorAll('.pf-nav-links a');
const revealItems = document.querySelectorAll('.pf-hero, .pf-about, .pf-exp, .pf-edu, .pf-work, .pf-contact');
const skillTools = document.querySelector('.pf-tools');
const counters = document.querySelectorAll('[data-count]');
const backTop = document.querySelector('.pf-back-top');
const modal = document.querySelector('#projectModal');
const modalOpen = document.querySelector('[data-modal-open]');
const modalClose = document.querySelector('[data-modal-close]');
const contactForm = document.querySelector('#contactForm');
const formNote = document.querySelector('#formNote');

function setTheme(mode) {
  body.classList.toggle('dark-mode', mode === 'dark');
  themeToggle.textContent = mode === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('portfolioTheme', mode);
}

setTheme(localStorage.getItem('portfolioTheme') || 'light');

themeToggle.addEventListener('click', () => {
  setTheme(body.classList.contains('dark-mode') ? 'light' : 'dark');
});

menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navAnchors.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

revealItems.forEach((item) => revealObserver.observe(item));

if (skillTools) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        skillTools.classList.add('is-visible');
        skillObserver.disconnect();
      }
    });
  }, { threshold: 0.45 });
  skillObserver.observe(skillTools);
}

function animateCounter(counter) {
  const target = Number(counter.dataset.count);
  let current = 0;
  const hasPlus = counter.nextElementSibling?.textContent?.toLowerCase().includes('years');
  const timer = setInterval(() => {
    current += 1;
    counter.textContent = current + (hasPlus ? '+' : '');
    if (current >= target) clearInterval(timer);
  }, 220);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.8 });

counters.forEach((counter) => counterObserver.observe(counter));

window.addEventListener('scroll', () => {
  backTop.classList.toggle('is-visible', window.scrollY > 450);

  const fromTop = window.scrollY + 120;
  navAnchors.forEach((link) => {
    const section = document.querySelector(link.getAttribute('href'));
    if (!section) return;
    const isActive = section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop;
    link.classList.toggle('active', isActive);
  });
});

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function openModal() {
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

modalOpen.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('name').trim();
  const email = formData.get('email').trim();
  const message = formData.get('message').trim();

  if (!name || !email || !message) {
    formNote.textContent = 'Please complete all fields before sending.';
    return;
  }

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const bodyText = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
  window.location.href = `mailto:ryanjayvillastique78@gmail.com?subject=${subject}&body=${bodyText}`;
  formNote.textContent = 'Opening your email app...';
});

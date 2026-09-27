if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
const cleanHomepageUrl = () => window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
if (!window.location.hash) window.scrollTo(0, 0);
window.addEventListener('pageshow', () => {
  if (window.location.hash === '#reviews') window.setTimeout(cleanHomepageUrl, 0);
  else if (!window.location.hash) window.scrollTo(0, 0);
});

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 20);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
});

mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  header.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -45px' });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

const form = document.getElementById('inquiryForm');
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('guestName').value.trim();
  const phone = document.getElementById('guestPhone').value.trim();
  const type = document.getElementById('eventType').value;
  const dateValue = document.getElementById('eventDate').value;
  const note = document.getElementById('eventNote').value.trim();
  const date = dateValue ? new Date(`${dateValue}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not decided yet';
  const message = [`Hello S.R.K Convention Centre,`, `I would like to enquire about a booking.`, `Name: ${name}`, `Phone: ${phone || 'Not provided'}`, `Event: ${type}`, `Preferred date: ${date}`, note ? `Details: ${note}` : ''].filter(Boolean).join('\n');
  window.open(`https://web.whatsapp.com/send?phone=919880325484&text=${encodeURIComponent(message)}`, '_blank', 'noopener');
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox.querySelector('img');
document.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => {
  lightboxImage.src = item.dataset.full;
  lightboxImage.alt = item.querySelector('img').alt;
  lightbox.showModal();
}));
lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

document.querySelectorAll('[data-testimonial-track]').forEach(track => {
  const section = track.closest('.reviews');
  const card = track.querySelector('.review-card');
  if (!section || !card) return;

  const move = direction => {
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    const max = track.scrollWidth - track.clientWidth;
    const next = direction > 0 && track.scrollLeft >= max - 8
      ? 0
      : Math.max(0, Math.min(max, track.scrollLeft + step * direction));
    track.scrollTo({ left: next, behavior: 'smooth' });
  };

  const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer;
  const stop = () => window.clearInterval(timer);
  const start = () => {
    if (!motionAllowed) return;
    stop();
    timer = window.setInterval(() => move(1), 8000);
  };

  section.querySelectorAll('[data-testimonial-direction]').forEach(control => {
    control.addEventListener('click', () => move(control.dataset.testimonialDirection === 'next' ? 1 : -1));
  });

  document.querySelectorAll('a[href="#reviews"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      stop();
      track.scrollTo({ left: 0, behavior: 'auto' });
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      cleanHomepageUrl();
      window.setTimeout(start, 500);
    });
  });

  if (motionAllowed) {
    const visibility = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? start() : stop());
    }, { threshold: .2 });
    visibility.observe(section);
    section.addEventListener('pointerenter', stop);
    section.addEventListener('pointerleave', start);
    section.addEventListener('focusin', stop);
    section.addEventListener('focusout', start);
  }
});

document.getElementById('year').textContent = new Date().getFullYear();

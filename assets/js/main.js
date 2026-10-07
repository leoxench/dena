(() => {
  const header = document.getElementById('siteHeader');
  const slides = [...document.querySelectorAll('.hero-slide')];
  const service = document.getElementById('heroService');
  let slideIndex = 0;
  let slideTimer;

  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 50);
  setHeader();
  window.addEventListener('scroll', setHeader, {passive:true});

  function showSlide(i){
    slideIndex = (i + slides.length) % slides.length;
    slides.forEach((s,n) => s.classList.toggle('active', n === slideIndex));
    if(service){
      service.style.opacity = '0';
      service.style.transform = 'translateY(10px)';
      setTimeout(() => {
        service.textContent = slides[slideIndex].dataset.title || '';
        service.style.opacity = '1';
        service.style.transform = 'translateY(0)';
      }, 190);
    }
  }
  if(slides.length){ slideTimer = setInterval(() => showSlide(slideIndex + 1), 4800); }

  const menu = document.getElementById('mobileMenu');
  const open = document.getElementById('menuOpen');
  const close = document.getElementById('menuClose');
  const openMenu = () => { menu?.classList.add('open'); menu?.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; };
  const closeMenu = () => { menu?.classList.remove('open'); menu?.setAttribute('aria-hidden','true'); document.body.style.overflow=''; };
  open?.addEventListener('click', openMenu);
  close?.addEventListener('click', closeMenu);
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, {threshold:.10, rootMargin:'0px 0px -28px 0px'});
  document.querySelectorAll('.reveal-up,.reveal-media').forEach(el => observer.observe(el));

  const track = document.getElementById('reviewTrack');
  const cards = track ? [...track.children] : [];
  const prev = document.getElementById('reviewPrev');
  const next = document.getElementById('reviewNext');
  let reviewIndex = 0;
  const perView = () => window.innerWidth <= 700 ? 1 : (window.innerWidth <= 1050 ? 2 : 3);
  const maxIndex = () => Math.max(0, cards.length - perView());
  function renderReviews(){
    if(!track || !cards.length) return;
    reviewIndex = Math.min(reviewIndex, maxIndex());
    const card = cards[0];
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    track.style.transform = `translateX(-${reviewIndex * step}px)`;
  }
  prev?.addEventListener('click', () => { reviewIndex = Math.max(0, reviewIndex - 1); renderReviews(); });
  next?.addEventListener('click', () => { reviewIndex = Math.min(maxIndex(), reviewIndex + 1); renderReviews(); });
  window.addEventListener('resize', renderReviews);
  setTimeout(renderReviews, 100);
})();

(() => {
  document.querySelectorAll('[data-before-after]').forEach(slider => {
    const input = slider.querySelector('input[type="range"]');
    const after = slider.querySelector('.ba-after-wrap');
    const divider = slider.querySelector('.ba-divider');
    if(!input || !after || !divider) return;
    const sync = value => {
      after.style.width = `${value}%`;
      divider.style.left = `${value}%`;
    };
    sync(input.value || 50);
    input.addEventListener('input', e => sync(e.target.value));
  });

  const modal = document.getElementById('videoModal');
  const open = document.getElementById('openVideoModal');
  const close = document.getElementById('closeVideoModal');
  const iframe = document.getElementById('videoIframe');
  const closeTargets = modal ? modal.querySelectorAll('[data-close-video]') : [];
  const videoSrc = 'https://www.youtube.com/embed/mY_Vd7XrXn8?autoplay=1&rel=0';
  const closeVideo = () => {
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden','true');
    if(iframe) iframe.src = '';
    document.body.style.overflow = '';
  };
  const openVideo = () => {
    modal?.classList.add('open');
    modal?.setAttribute('aria-hidden','false');
    if(iframe) iframe.src = videoSrc;
    document.body.style.overflow = 'hidden';
  };
  open?.addEventListener('click', openVideo);
  close?.addEventListener('click', closeVideo);
  closeTargets.forEach(el => el.addEventListener('click', closeVideo));
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape' && modal?.classList.contains('open')) closeVideo();
  });
})();

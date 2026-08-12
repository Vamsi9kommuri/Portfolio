// mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// highlight active section link on scroll
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
);

sections.forEach(section => navObserver.observe(section));

// scroll-reveal for sections
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach(el => revealObserver.observe(el));

// animated stat counters
const statNums = document.querySelectorAll('.stat-num');

const countUp = el => {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();

  const tick = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const statsObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNums.forEach(countUp);
        statsObserver.disconnect();
      }
    });
  },
  { threshold: 0.4 }
);

const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

// scroll progress bar
const progressBar = document.getElementById('progressBar');

const updateProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
};

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// live IST clock
const clockEl = document.getElementById('liveClock');

const updateClock = () => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  clockEl.textContent = `IST ${time}`;
};

updateClock();
setInterval(updateClock, 1000);

// typewriter role cycler
const roleEl = document.getElementById('roleType');
const roles = ['Data Scientist', 'ML Engineer', 'EDA Specialist'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let roleIndex = 0;
let charIndex = roles[0].length;
let deleting = false;

const typeLoop = () => {
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    if (charIndex > current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    if (charIndex < 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      charIndex = 0;
    }
  }

  roleEl.textContent = current.slice(0, charIndex);
  setTimeout(typeLoop, deleting ? 45 : 85);
};

if (!reduceMotion) {
  charIndex = 0;
  setTimeout(typeLoop, 2400);
}

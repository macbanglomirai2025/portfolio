// ============================================================
//  script.js — AkeleCoder Portfolio
//  Contains:
//    1. Navbar scroll + active link highlight
//    2. Hamburger mobile menu
//    3. Typing animation (hero section)
//    4. Skill bar animation on scroll
//    5. Section fade-in on scroll
//    6. Contact form → Formspree (async fetch)
//    7. Project cards loader (from data/projects.json)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Set footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Dark / Light theme toggle ─────────────────────────────────────
  const themeToggle = document.getElementById('theme-toggle');
  const root        = document.documentElement;

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }


  // ─────────────────────────────────────────────
  // 1. NAVBAR — add shadow when page is scrolled
  // ─────────────────────────────────────────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });


  // ─────────────────────────────────────────────
  // 2. NAVBAR — highlight active link on scroll
  // ─────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 90;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });


  // ─────────────────────────────────────────────
  // 3. HAMBURGER — toggle mobile menu
  // ─────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });


  // ─────────────────────────────────────────────
  // 4. TYPING ANIMATION — hero section
  // ─────────────────────────────────────────────
  const typedEl = document.getElementById('typed-text');

  if (typedEl) {
    const words    = ['Frontend Developer', 'Web Designer', 'JavaScript Enthusiast', 'BTech CSE Student'];
    let wordIndex  = 0;
    let charIndex  = 0;
    let isDeleting = false;

    function type() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        typedEl.textContent = currentWord.slice(0, charIndex - 1);
        charIndex--;
      } else {
        typedEl.textContent = currentWord.slice(0, charIndex + 1);
        charIndex++;
      }

      // Word fully typed — pause then start deleting
      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 1500);
        return;
      }

      // Word fully deleted — move to next word
      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex  = (wordIndex + 1) % words.length;
      }

      const speed = isDeleting ? 60 : 100;
      setTimeout(type, speed);
    }

    type();
  }


  // ─────────────────────────────────────────────
  // 5. SKILL BARS — animate width on scroll
  // ─────────────────────────────────────────────
  const skillFills = document.querySelectorAll('.skill-fill');

  // Start all bars at 0 width
  skillFills.forEach(bar => {
    bar.style.width = '0';
  });

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Set width to the value stored in --w CSS variable
        entry.target.style.width = entry.target.style.getPropertyValue('--w');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(bar => skillObserver.observe(bar));


  // ─────────────────────────────────────────────
  // 6. SCROLL REVEAL — fade in sections
  // ─────────────────────────────────────────────
  const fadeElements = document.querySelectorAll('.section, .hero');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  fadeElements.forEach(el => fadeObserver.observe(el));


  // ─────────────────────────────────────────────
  // 7. CONTACT FORM → FORMSPREE
  //
  //    HOW TO SET UP:
  //    1. Go to https://formspree.io and sign up free
  //    2. Create a new form, copy your endpoint
  //       e.g.  https://formspree.io/f/xyzabc12
  //    3. In index.html find the <form> tag and replace
  //       YOUR_FORMSPREE_ID with your actual ID
  //       e.g.  action="https://formspree.io/f/xyzabc12"
  //    Done! Messages will arrive in your Gmail inbox.
  // ─────────────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  const submitBtn   = document.getElementById('submit-btn');
  const successMsg  = document.getElementById('form-success');
  const errorMsg    = document.getElementById('form-error');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Check the user has replaced the placeholder ID
      if (contactForm.action.includes('YOUR_FORMSPREE_ID')) {
        alert('⚠️ Please set up Formspree first!\nReplace YOUR_FORMSPREE_ID in index.html with your real Formspree endpoint.');
        return;
      }

      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled    = true;
      successMsg.style.display = 'none';
      errorMsg.style.display   = 'none';

      try {
        const response = await fetch(contactForm.action, {
          method:  'POST',
          body:    new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          // ✅ Message sent successfully
          successMsg.style.display = 'block';
          errorMsg.style.display   = 'none';
          contactForm.reset();
        } else {
          // ❌ Formspree returned an error
          const data = await response.json();
          console.error('Formspree error:', data);
          successMsg.style.display = 'none';
          errorMsg.style.display   = 'block';
        }

      } catch (err) {
        // ❌ Network / connection error
        console.error('Network error:', err);
        errorMsg.style.display = 'block';
      }

      // Restore button
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled    = false;
    });
  }


  // ─────────────────────────────────────────────
  // 8. PROJECT CARDS — load from data/projects.json
  // ─────────────────────────────────────────────
  const projectContainer = document.getElementById('project-container');
  const projectLoading   = document.getElementById('project-loading');
  const projectError     = document.getElementById('project-error');

  if (!projectContainer) return;

  // Escape HTML to prevent XSS
  function escHtml(str) {
    return String(str ?? '')
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;');
  }

  // Build a single project card
  function buildCard(project, index) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const name   = escHtml(project.name        || 'Project');
    const desc   = escHtml(project.description || '');
    const imgSrc = escHtml(project.image       || '');
    const live   = escHtml(project.live        || '');
    const github = escHtml(project.github      || '');

    // Tech tags
    const tags = Array.isArray(project.tech) && project.tech.length
      ? project.tech.map(t => `<span class="card-tag">${escHtml(t)}</span>`).join('')
      : '';

    // Thumbnail
    const imgHtml = imgSrc
      ? `<div class="project-card-img">
           <img
             src="${imgSrc}"
             alt="${name}"
             loading="lazy"
             onerror="this.parentElement.innerHTML='<span>No preview</span>';
                      this.parentElement.classList.add('no-img');"
           />
         </div>`
      : `<div class="project-card-img no-img"><span>No preview</span></div>`;

    // Buttons
    const liveBtn = live
      ? `<a href="${live}" target="_blank" rel="noopener noreferrer" class="card-link card-link-live">Live Demo</a>`
      : '';

    const sourceBtn = github
      ? `<a href="${github}" target="_blank" rel="noopener noreferrer" class="card-link card-link-code">Source Code</a>`
      : '';

    card.innerHTML = `
      ${imgHtml}
      <div class="card-body">
        <h3>${name}</h3>
        <p>${desc}</p>
        ${tags ? `<div class="card-tags">${tags}</div>` : ''}
        <div class="card-links">${liveBtn}${sourceBtn}</div>
      </div>`;

    // Stagger the reveal animation using IntersectionObserver
    const cardObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => card.classList.add('show'), index * 100);
      cardObserver.disconnect();
    }, { threshold: 0.08 });

    cardObserver.observe(card);

    return card;
  }

  // Fetch projects.json and render cards
  async function loadProjects() {
    try {
      projectLoading.style.display = 'flex';

      const response = await fetch('data/projects.json');

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const projects = await response.json();
      projectLoading.style.display = 'none';

      if (!Array.isArray(projects) || projects.length === 0) {
        projectContainer.innerHTML = '<p style="text-align:center; color:#888; padding:40px 0; grid-column:1/-1;">No projects added yet. Check back soon!</p>';
        projectContainer.style.display = 'grid';
        return;
      }

      projectContainer.innerHTML = '';
      projects.forEach((project, i) => {
        projectContainer.appendChild(buildCard(project, i));
      });
      projectContainer.style.display = 'grid';

    } catch (err) {
      console.error('Could not load projects:', err);
      projectLoading.style.display = 'none';
      projectError.style.display   = 'block';
    }
  }

  loadProjects();

}); // end DOMContentLoaded
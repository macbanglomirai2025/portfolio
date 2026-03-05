// js/script.js — Portfolio project loader

document.addEventListener('DOMContentLoaded', () => {
  const container      = document.getElementById('project-container');
  const loadingElement = document.getElementById('project-loading');
  const errorElement   = document.getElementById('project-error');

  if (!container) {
    console.error('Project container not found');
    return;
  }

  // ── Helpers ────────────────────────────────────────────

  function escHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Build a single card element
  function buildCard(project, index) {
    const card = document.createElement('article');
    card.className = 'project-card';

    // Staggered entrance — CSS handles the animation via --i
    card.style.setProperty('--i', index);
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';

    const imageSrc   = escHtml(project.image  || 'images/placeholder-project.jpg');
    const liveLink   = escHtml(project.live   || '#');
    const githubLink = escHtml(project.github || '#');
    const name       = escHtml(project.name   || 'Unnamed Project');
    const desc       = escHtml(project.description || 'No description available.');

    // Tech tags (optional field)
    const techTags = Array.isArray(project.tech) && project.tech.length
      ? `<div class="project-tags">${project.tech.map(t => `<span class="project-tag">${escHtml(t)}</span>`).join('')}</div>`
      : '';

    // Only render links that aren't '#'
    const liveBtn = project.live
      ? `<a href="${liveLink}" target="_blank" rel="noopener noreferrer" class="proj-link proj-link--live" aria-label="Live demo of ${name}">
           <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
             <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
             <polyline points="15 3 21 3 21 9"/>
             <line x1="10" y1="14" x2="21" y2="3"/>
           </svg>
           Live Demo
         </a>`
      : '';

    const githubBtn = project.github
      ? `<a href="${githubLink}" target="_blank" rel="noopener noreferrer" class="proj-link proj-link--code" aria-label="GitHub repository for ${name}">
           <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
             <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
           </svg>
           Source Code
         </a>`
      : '';

    card.innerHTML = `
      <div class="project-img-wrap">
        <img
          src="${imageSrc}"
          alt="${name} screenshot"
          loading="lazy"
          class="project-img"
          onerror="this.closest('.project-img-wrap').classList.add('img-error')"
        />
        <div class="project-img-overlay" aria-hidden="true"></div>
      </div>
      <div class="project-card-content">
        <h3 class="project-name">${name}</h3>
        <p class="project-desc">${desc}</p>
        ${techTags}
        <div class="project-links">
          ${liveBtn}
          ${githubBtn}
        </div>
      </div>
    `;

    return card;
  }

  // ── Animate cards in after append ──────────────────────

  function animateCards() {
    const cards = container.querySelectorAll('.project-card');
    cards.forEach((card, i) => {
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)';
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';
      }, i * 100);
    });
  }

  // ── Main loader ─────────────────────────────────────────

  async function loadProjects() {
    try {
      if (loadingElement) loadingElement.style.display = 'block';

      const response = await fetch('data/projects.json');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Could not fetch projects.`);
      }

      const projects = await response.json();

      if (loadingElement) loadingElement.style.display = 'none';

      if (!Array.isArray(projects) || projects.length === 0) {
        container.innerHTML = `
          <p style="grid-column:1/-1; text-align:center; color:var(--text-muted, #8892a4); font-size:1rem; padding:3rem 0;">
            No projects yet — check back soon!
          </p>`;
        container.style.display = 'grid';
        return;
      }

      container.innerHTML = '';
      projects.forEach((project, i) => {
        container.appendChild(buildCard(project, i));
      });

      container.style.display = 'grid';

      // Trigger stagger after paint
      requestAnimationFrame(() => requestAnimationFrame(animateCards));

    } catch (error) {
      console.error('Failed to load projects:', error);

      if (loadingElement) loadingElement.style.display = 'none';

      if (errorElement) {
        errorElement.style.display = 'flex';
        const p = errorElement.querySelector('p');
        if (p) p.textContent = 'Could not load projects. Please refresh the page.';
      } else {
        container.innerHTML = `
          <p style="grid-column:1/-1; color:#f87171; text-align:center; padding:4rem 1rem;">
            Error loading projects. Please refresh the page.
          </p>`;
        container.style.display = 'grid';
      }
    }
  }

  loadProjects();
});
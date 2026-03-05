// js/script.js - Main portfolio project loader

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('project-container');
  const loadingElement = document.getElementById('project-loading');
  const errorElement = document.getElementById('project-error');

  if (!container) {
    console.error('Project container not found');
    return;
  }

  async function loadProjects() {
    try {
      // Show loading state
      if (loadingElement) loadingElement.style.display = 'block';

      const response = await fetch('data/projects.json');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const projects = await response.json();

      // Hide loading
      if (loadingElement) loadingElement.style.display = 'none';

      if (!projects || projects.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#94a3b8; font-size:1.1rem;">No projects added yet. Check back soon!</p>';
        container.style.display = 'block';
        return;
      }

      // Clear container (in case of reloads)
      container.innerHTML = '';

      projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';

        // Safely handle missing fields
        const imageSrc = project.image || 'images/placeholder-project.jpg'; // fallback image (add one if needed)
        const liveLink = project.live || '#';
        const githubLink = project.github || '#';

        card.innerHTML = `
          <img 
            src="${imageSrc}" 
            alt="${project.name || 'Project screenshot'}" 
            loading="lazy" 
            class="project-img"
          >
          <div class="project-card-content">
            <h3>${project.name || 'Unnamed Project'}</h3>
            <p>${project.description || 'No description available'}</p>
            <div class="project-links">
              <a 
                href="${liveLink}" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Live demo of ${project.name}"
              >
                Live Demo
              </a>
              <a 
                href="${githubLink}" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub repository for ${project.name}"
              >
                Source Code
              </a>
            </div>
          </div>
        `;

        container.appendChild(card);
      });

      // Finally show the grid
      container.style.display = 'grid';

    } catch (error) {
      console.error('Failed to load projects:', error);

      if (loadingElement) loadingElement.style.display = 'none';
      if (errorElement) {
        errorElement.style.display = 'block';
        errorElement.querySelector('p').textContent = 
          'Could not load projects. Please try again later or check your internet connection.';
      } else {
        // Fallback if no error element exists
        container.innerHTML = '<p style="color:#fca5a5; text-align:center; padding:4rem 1rem;">Error loading projects. Please refresh the page.</p>';
      }
    }
  }

  // Run the loader
  loadProjects();
});
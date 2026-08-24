(function applyPortfolioTruth() {
  const projects = Array.isArray(window.BSS_PORTFOLIO_PROJECTS)
    ? window.BSS_PORTFOLIO_PROJECTS
    : [];
  const byId = new Map(projects.map((project) => [project.id, project]));

  const hydrate = (attribute, field) => {
    document.querySelectorAll(`[${attribute}]`).forEach((element) => {
      const project = byId.get(element.getAttribute(attribute));
      if (project && project[field]) {
        element.textContent = project[field];
      }
    });
  };

  hydrate('data-project-status', 'status');
  hydrate('data-project-availability', 'availability');
  hydrate('data-project-description', 'desc');
})();

const filterButtons = document.querySelectorAll('.filter-btn');
const projects = document.querySelectorAll('article');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {

    // active button UI
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projects.forEach(project => {
      const category = project.dataset.category;

      if (filter === 'all' || category === filter) {
        project.classList.remove('hide');
        project.classList.add('show');
      } else {
        project.classList.remove('show');
        project.classList.add('hide');
      }
    });

  });
});
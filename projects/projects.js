import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const projectsTitle = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

// Function call to render projects
projectsTitle.textContent = `${projects.length} Projects`;
renderProjects(projects, projectsContainer, 'h2');

// Function to render pie chart and legend
let selectedIndex = -1;
function renderPieChart(projectsGiven) {
  // Clear existing SVG and legend
  d3.select('#projects-plot').selectAll('*').remove();
  d3.select('.legend').selectAll('*').remove();

  // Re-calculate rolled data
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  // Re-calculate data
  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  // D3 pie chart setup
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  // Paths for each slice
  let svg = d3.select('#projects-plot');
  let arcs = svg.selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', (d, i) => colors(i))
    .attr('class', (d, i) => (i === selectedIndex ? 'selected' : ''))
    .on('click', function(event, d) {
      selectedIndex = selectedIndex === d.index ? -1 : d.index;
      svg.selectAll('path')
        .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

      // Filter projects by selected year
      if (selectedIndex === -1) {
        renderProjects(projects, projectsContainer, 'h2');
      } else {
        let filteredProjects = projects.filter(project => project.year === d.data.label);
        renderProjects(filteredProjects, projectsContainer, 'h2');
      }
    });

  // Create legend
  let legend = d3.select('.legend');
  data.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', `legend-item ${idx === selectedIndex ? 'selected' : ''}`)
      .html(`<span class="swatch"></span>${d.label}`)
      .on('click', function() {
        selectedIndex = selectedIndex === idx ? -1 : idx;
        svg.selectAll('path')
          .attr('class', (_, i) => (i === selectedIndex ? 'selected' : ''));
        legend.selectAll('li')
          .attr('class', (_, i) => `legend-item ${i === selectedIndex ? 'selected' : ''}`);

        // Filter projects by selected year
        if (selectedIndex === -1) {
          renderProjects(projects, projectsContainer, 'h2');
        } else {
          let filteredProjects = projects.filter(project => project.year === d.label);
          renderProjects(filteredProjects, projectsContainer, 'h2');
        }
      });
  });
}

// Initial render of pie chart
renderPieChart(projects);

// Search field functions
let query = '';

searchInput.addEventListener('input', (event) => {
  // Update query value
  query = event.target.value.toLowerCase();

  // Filter the projects
  let filteredProjects = projects.filter((project) => 
    project.title.toLowerCase().includes(query) ||
    project.description.toLowerCase().includes(query)
  );

  // Render updated projects and pie chart
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

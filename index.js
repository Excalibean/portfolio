import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

const projects = await fetchJSON('./lib/projects.json');
const projectsContainer = document.querySelector('.projects');
const latestProjects = projects.slice(0, 3);
const githubData = await fetchGitHubData('giorgianicolaou');
const profileStats = document.querySelector('#profile-stats');


(async () => {
    try {
      const projects = await fetchJSON('./lib/projects.json');
      console.log('Fetched projects:', projects);
      const projectsContainer = document.querySelector('.projects');
      const latestProjects = projects.slice(0, 3);
      const githubData = await fetchGitHubData('giorgianicolaou');
      console.log('Fetched GitHub data:', githubData);
      const profileStats = document.querySelector('.profile-stats-content');
  
      // Render the first three projects
      if (projectsContainer) {
        renderProjects(latestProjects, projectsContainer, 'h2');
      } else {
        console.error('Projects container element not found');
      }
  
      // Render GitHub profile stats
      if (profileStats) {
        profileStats.innerHTML = `
          <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
          </dl>
        `;
      } else {
        console.error('Profile stats container element not found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  })();
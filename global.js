console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Current Page Highlighting and Tracking (Intro)
// const navLinks = $$('nav a');
// console.log(navLinks);
// let currentLink = navLinks.find(
//     (a) => a.host === location.host && a.pathname === location.pathname
//   );
// currentLink.classList.add('current');
// if (currentLink) {
//     // or if (currentLink !== undefined)
//     currentLink.classList.add('current');
//   }


// Function to set the color scheme
function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    localStorage.colorScheme = colorScheme;
}

// Create and insert the color scheme selector
document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <label class="color-scheme">
      Theme:
      <select id="color-scheme-select">
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>`
  );
  
  const colorSchemeSelect = document.getElementById('color-scheme-select');
  
  // Load user preference from localStorage if available
  if ('colorScheme' in localStorage) {
    const savedScheme = localStorage.colorScheme;
    setColorScheme(savedScheme);
    colorSchemeSelect.value = savedScheme;
  }
  
  colorSchemeSelect.addEventListener('input', (event) => {
    console.log('color scheme changed to', event.target.value);
    setColorScheme(event.target.value);
  });

//Automatic Navigation Page
let pages = [
    { url: 'index.html', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'CV/', title: 'Resume'},
    { url: 'contact/', title: 'Contact' },
    { url: 'https://github.com/Excalibean', title: 'Github' },
  ];
let nav = document.createElement('nav');
document.body.prepend(nav);
const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    if (!ARE_WE_HOME && !url.startsWith('http')) {
        url = '../' + url;
      }
      let title = p.title;
      let a = document.createElement('a');
      a.href = url;
      a.textContent = title;
      nav.append(a);
      if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
      }
    }
  
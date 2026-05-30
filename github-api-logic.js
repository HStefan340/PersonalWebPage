const gitHubUsername = "HStefan340";

const projectsGrid = document.getElementById('github-projects-grid');
const loadingMessage = document.getElementById('api-loading-message');
const errorMessage = document.getElementById('connection-error-container');
const searchInput = document.getElementById('project-search-input');

let allProjects = [];

async function fetchGitHubProjects(){
    try{
        const response = await fetch(`https://api.github.com/users/${gitHubUsername}/repos`);

        if(!response.ok){
            throw new Error(`Eroare HTTP: ${response.status} - Am atins limita de request-uri.`);
        }

        const rawData = await response.json();

        let myProjects = rawData.filter(repo => repo.fork === false);

        myProjects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        allProjects = myProjects;

        loadingMessage.classList.add('hidden');

        renderProjects(allProjects);
    } catch (error){
        loadingMessage.classList.add('hidden');
        errorMessage.textContent = "Nu am putut incarca proiectele momentan. " + error.message;
        errorMessage.classList.remove('hidden');
    }
}

function renderProjects(projectsArray){
    projectsGrid.innerHTML = '';

    projectsArray.forEach(repo =>{
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';

        const description = repo.description ? repo.description : "This project has no description.";

        const language = repo.language ? repo.language : "Not specified";

        projectCard.innerHTML = `
        <h4> ${repo.name} </h4>
        <p class = "project-description"> ${description} </p>
        <div class = "project-stats">
            <span class = "language-tag"> ${language} </span>
            <span class = "stars"> ⭐ ${repo.stargazers_count} </span>
            <span class = "forks"> Ψ ${repo.forks_count} </span>
        </div>
        <a href = "${repo.html_url}" target = "_blank" class = "github-link"> See project on Github </a> 
        `;

        projectsGrid.appendChild(projectCard);
    });
}

fetchGitHubProjects();

searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();

    const filteredProjects = allProjects.filter(repo =>{ 
        const words = repo.name.toLowerCase().split(/[-_ ]/);
        return words.some(word => word.startsWith(searchTerm));
    });

    renderProjects(filteredProjects);
})
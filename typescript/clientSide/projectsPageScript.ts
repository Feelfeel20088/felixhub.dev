interface GitHubRelease {
    url: string;
    assets_url: string;
    upload_url: string;
    html_url: string;
    id: number;
    tag_name: string;  // This will be the version of the release
    name: string;
    body: string;
    created_at: string;
    published_at: string;
    author: {
      login: string;
      id: number;
      avatar_url: string;
      url: string;
      html_url: string;
    };
    assets: Array<{
      url: string;
      id: number;
      name: string;
      label: string | null;
      content_type: string;
      size: number;
      download_count: number;
      created_at: string;
      updated_at: string;
    }>;
    prerelease: boolean;
    draft: boolean;
    tarball_url: string;
    zipball_url: string;
  }
  

interface GitHubOwner {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    url: string;
    html_url: string;
    type: string;
  }
  
  interface GitHubRepository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: GitHubOwner;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: string;
    forks_count: number;
    open_issues_count: number;
    license: string | null;
    visibility: string;
    forks: number;
    open_issues: number;
    watchers: number;
    default_branch: string;
  }






  function createProjectCard(project: GitHubRepository, release: GitHubRelease | null): HTMLElement {
    const projectLink = document.createElement('div');
    projectLink.classList.add('project-link');
  
    const projectCard = document.createElement('div');
    projectCard.classList.add('project-card');
  
    const projectImage = document.createElement('img');
    projectImage.src = `static/images/${project.name}.jpg`;
    projectImage.classList.add('project-image');
  
    const projectInfo = document.createElement('div');
    projectInfo.classList.add('project-info');
  
    const projectTitle = document.createElement('h3');
    projectTitle.classList.add('project-title');
    projectTitle.textContent = project.name;
  
    const projectDescription = document.createElement('p');
    projectDescription.classList.add('project-description');
    projectDescription.textContent = project.description || 'No description available';
  
    const projectVersion = document.createElement('span');
    projectVersion.classList.add('project-version');
    projectVersion.textContent = release?.tag_name || 'No releases';
  
    const projectButtons = document.createElement('div');
    projectButtons.classList.add('project-buttons');
  
    const githubButton = document.createElement('a');
    githubButton.href = project.html_url || '#';
    githubButton.target = "_blank";
    githubButton.classList.add('btn');
    githubButton.textContent = 'GitHub';
  
    const documentationButton = document.createElement('a');
    documentationButton.href = `/${project.name}:documentation`
    documentationButton.target = "_blank";
    documentationButton.classList.add('btn');
    documentationButton.textContent = 'Documentation';
  
    const demoButton = document.createElement('a');
    demoButton.href = `/${project.name}:liveDemo`
    demoButton.target = "_blank";
    demoButton.classList.add('btn');
    demoButton.textContent = 'Live Demo';
  
    // Append buttons to the project buttons section
    projectButtons.appendChild(githubButton);
    projectButtons.appendChild(documentationButton);
    projectButtons.appendChild(demoButton);
  
    // Append all elements to the project card
    projectInfo.appendChild(projectTitle);
    projectInfo.appendChild(projectDescription);
    projectInfo.appendChild(projectVersion);
    projectInfo.appendChild(projectButtons);
  
    projectCard.appendChild(projectImage);
    projectCard.appendChild(projectInfo);
  
    projectLink.appendChild(projectCard);
    
    projectImage.onerror = () => {
        projectImage.src = 'static/images/default-image.jpg';
    };
  
    return projectLink;
}






(async () => {

     

    const data = await fetch(`https://api.github.com/users/Feelfeel20088/repos?per_page=100`);
    const repos = await data.json()
    const projectsContainer = document.getElementById('projects-container');
    for (const repo of repos) {
        const r = await fetch(`https://api.github.com/repos/Feelfeel20088/${repo.name}/releases`);
        const release: GitHubRelease[] = await r.json();
        if (!release) {
            const project = createProjectCard(repo, null);
        }
        
        const project = createProjectCard(repo, release[0]);
        projectsContainer?.appendChild(project);
    }
        
    
    
    
})();



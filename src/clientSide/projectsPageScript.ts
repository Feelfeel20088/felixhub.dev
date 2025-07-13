
// TODO
// seperate interfaces 
// make anamations work

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


const addLinkButton = async (
  container: HTMLElement,
  url: string,
  text: string
) => {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (res.status === 404) {
      console.warn(`Skipping ${text} for ${url}: 404 Not Found`);
      return;
    }
    if (!res.ok) {
      console.warn(`Skipping ${text} for ${url}: status ${res.status}`);
      return;
    }
    const button = document.createElement('a');
    button.href = url;
    button.target = '_blank';
    button.classList.add('btn');
    button.textContent = text;
    container.appendChild(button);
  } catch (err) {
    console.warn(`Skipping ${text} for ${url}:`, err);
  }
};



async function createProjectCard(
  project: GitHubRepository,
  release: GitHubRelease | null,
): Promise<HTMLElement> {
  const projectLink = document.createElement('div');
  projectLink.classList.add('project-link');

  const projectCard = document.createElement('div');
  projectCard.classList.add('project-card');

  const projectImage = document.createElement('img');
  projectImage.src = `static/images/${project.name}.jpg`;
  projectImage.classList.add('project-image');
  projectImage.alt = `${project.name} preview`;

  projectImage.onerror = () => {
    projectImage.src = 'static/images/default-image.jpg';
  };

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
  githubButton.target = '_blank';
  githubButton.classList.add('btn');
  githubButton.textContent = 'GitHub';

  await Promise.all([
    addLinkButton(projectButtons, `/${project.name}:documentation`, 'Documentation'),
    addLinkButton(projectButtons, `/${project.name}:liveDemo`, 'Live Demo'),
  ]);

  projectButtons.append(githubButton);

  // Build card
  projectInfo.append(projectTitle, projectDescription, projectVersion, projectButtons);
  projectCard.append(projectImage, projectInfo);
  projectLink.appendChild(projectCard);


  return projectLink;
}

async function makeCards(type: string, name: string) {

  const data = await fetch(`https://api.github.com/${type}/${name}/repos?per_page=1000`);
  const repos = await data.json();
  const projectsContainer = document.getElementById('projects-container');
  for (const repo of repos) {
    const r = await fetch(`https://api.github.com/repos/${name}/${repo.name}/releases`);
    const release: GitHubRelease[] = await r.json();
    const project = await createProjectCard(repo, release[0] || null);

    projectsContainer?.appendChild(project);
  }

}

https://api.github.com/users/Feelfeel20088/repos?per_page=1000


(async () => {

  Promise.all([
    makeCards("users", "Feelfeel20088"),
    makeCards("orgs", "felixhub-dev")
  ])

})();





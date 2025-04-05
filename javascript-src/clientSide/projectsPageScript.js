"use strict";
// TODO
// seperate interfaces 
// make anamations work
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function createProjectCard(project, release) {
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
    projectVersion.textContent = (release === null || release === void 0 ? void 0 : release.tag_name) || 'No releases';
    const projectButtons = document.createElement('div');
    projectButtons.classList.add('project-buttons');
    const githubButton = document.createElement('a');
    githubButton.href = project.html_url || '#';
    githubButton.target = '_blank';
    githubButton.classList.add('btn');
    githubButton.textContent = 'GitHub';
    const documentationButton = document.createElement('a');
    documentationButton.href = `/${project.name}:documentation`;
    documentationButton.target = '_blank';
    documentationButton.classList.add('btn');
    documentationButton.textContent = 'Documentation';
    const demoButton = document.createElement('a');
    demoButton.href = `/${project.name}:liveDemo`;
    demoButton.target = '_blank';
    demoButton.classList.add('btn');
    demoButton.textContent = 'Live Demo';
    // Append buttons
    projectButtons.append(githubButton, documentationButton, demoButton);
    // Build card
    projectInfo.append(projectTitle, projectDescription, projectVersion, projectButtons);
    projectCard.append(projectImage, projectInfo);
    projectLink.appendChild(projectCard);
    return projectLink;
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch(`https://api.github.com/users/Feelfeel20088/repos?per_page=100`);
    const repos = yield data.json();
    const projectsContainer = document.getElementById('projects-container');
    for (const repo of repos) {
        const r = yield fetch(`https://api.github.com/repos/Feelfeel20088/${repo.name}/releases`);
        const release = yield r.json();
        const project = createProjectCard(repo, release[0] || null);
        projectsContainer === null || projectsContainer === void 0 ? void 0 : projectsContainer.appendChild(project);
    }
}))();

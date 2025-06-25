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
const addLinkButton = (container, url, text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield fetch(url, { method: 'HEAD' });
        console.log(url);
        console.log(res.status);
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
    }
    catch (err) {
        console.warn(`Skipping ${text} for ${url}:`, err);
    }
});
function createProjectCard(project, release) {
    return __awaiter(this, void 0, void 0, function* () {
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
        yield Promise.all([
            addLinkButton(projectButtons, `/${project.name}:documentation`, 'Documentation'),
            addLinkButton(projectButtons, `/${project.name}:liveDemo`, 'Live Demo'),
        ]);
        projectButtons.append(githubButton);
        // Build card
        projectInfo.append(projectTitle, projectDescription, projectVersion, projectButtons);
        projectCard.append(projectImage, projectInfo);
        projectLink.appendChild(projectCard);
        return projectLink;
    });
}
function makeCards(type, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetch(`https://api.github.com/${type}/${name}/repos?per_page=1000`);
        const repos = yield data.json();
        const projectsContainer = document.getElementById('projects-container');
        for (const repo of repos) {
            const r = yield fetch(`https://api.github.com/repos/${name}/${repo.name}/releases`);
            const release = yield r.json();
            const project = yield createProjectCard(repo, release[0] || null);
            projectsContainer === null || projectsContainer === void 0 ? void 0 : projectsContainer.appendChild(project);
        }
    });
}
https: //api.github.com/users/Feelfeel20088/repos?per_page=1000
 (() => __awaiter(void 0, void 0, void 0, function* () {
    Promise.all([
        makeCards("users", "Feelfeel20088"),
        makeCards("orgs", "felixhub-dev")
    ]);
}))();

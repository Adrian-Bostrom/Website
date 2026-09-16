console.log('%cHELLO, CURIOUS HUMAN.', 'font-size: 18px; font-weight: bold;');
console.log('%cWelcome to Adrian\'s tiny corner of the internet.', 'color: #a5a5a5;');

const logList = document.querySelector('#dev-log-list');
const projectTitle = document.querySelector('#project-title');
const projectIntro = document.querySelector('#project-intro');
const projectStatus = document.querySelector('#project-status');
const readmeContent = document.querySelector('#readme-content');
const detailsContent = document.querySelector('#details-content');
const readmePath = document.querySelector('#readme-path');
const detailsPath = document.querySelector('#details-path');
const sourceLink = document.querySelector('#source-link');
const renderLogs = (logs) => {
	logList.replaceChildren();
	logs.forEach((log) => {
		const entry = document.createElement('article');
		entry.className = 'dev-log-entry';
		const date = document.createElement('time');
		date.dateTime = log.date;
		date.textContent = log.date;
		const text = document.createElement('p');
		text.textContent = log.text;
		entry.append(date, text);
		logList.append(entry);
	});
};

const loadProject = async () => {
	const slug = new URLSearchParams(window.location.search).get('slug');
	try {
		if (!slug) throw new Error('No project was selected.');
		const response = await fetch(`/api/projects/${encodeURIComponent(slug)}`);
		if (!response.ok) throw new Error(`API returned HTTP ${response.status}.`);
		const project = await response.json();
		const readmeLines = project.readme.trim().split('\n');
		const title = readmeLines.shift().trim();
		const intro = readmeLines.filter((line) => !line.toLowerCase().startsWith('status:')).join(' ').trim();
		projectStatus.textContent = `${String(project.number).padStart(2, '0')} / ${project.status}`;
		projectTitle.textContent = title;
		projectIntro.textContent = intro;
		document.title = `A_B / ${title}`;
		readmePath.textContent = `~/projects/${project.slug}/readme.txt`;
		detailsPath.textContent = `~/projects/${project.slug}/details.txt`;
		readmeContent.textContent = project.readme.trim();
		detailsContent.textContent = project.details.trim();
		if (project.sourceUrl) {
			sourceLink.href = project.sourceUrl;
			sourceLink.hidden = false;
		}
		renderLogs(project.logs);
	} catch (error) {
		readmeContent.textContent = `Project unavailable: ${error.message}`;
		detailsContent.textContent = '';
		logList.textContent = `Dev log unavailable: ${error.message}`;
	}
};

loadProject();

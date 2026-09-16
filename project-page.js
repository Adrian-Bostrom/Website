console.log('%cHELLO, CURIOUS HUMAN.', 'font-size: 18px; font-weight: bold;');
console.log('%cWelcome to Adrian\'s tiny corner of the internet.', 'color: #a5a5a5;');

const logRoot = document.body.dataset.logPath;
const projectRoot = document.body.dataset.projectPath || logRoot;
const logList = document.querySelector('#dev-log-list');
const projectTitle = document.querySelector('#project-title');
const projectIntro = document.querySelector('#project-intro');
const readmeContent = document.querySelector('#readme-content');
const detailsContent = document.querySelector('#details-content');
window.projectContent = null;
window.projectLogs = [];
window.projectLogFiles = [];

window.addProjectLog = (log) => {
	window.projectLogs.push(log);
};

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

const loadScript = (url) => new Promise((resolve, reject) => {
	const script = document.createElement('script');
	script.src = url;
	script.onload = resolve;
	script.onerror = () => reject(new Error(`Could not load ${url}.`));
	document.head.append(script);
});


loadScript(new URL(`${projectRoot}/content.js`, document.baseURI).href)
	.then(() => {
		const { readme, details } = window.projectContent;
		const readmeLines = readme.trim().split('\n');
		const title = readmeLines.shift().trim();
		const intro = readmeLines.filter((line) => !line.toLowerCase().startsWith('status:')).join(' ').trim();
		projectTitle.textContent = title;
		projectIntro.textContent = intro;
		document.title = `A_B / ${title}`;
		readmeContent.textContent = readme.trim();
		detailsContent.textContent = details.trim();
	})
	.catch((error) => {
		readmeContent.textContent = `Project files unavailable: ${error.message}`;
		detailsContent.textContent = '';
	});

loadScript(new URL(`${logRoot}/logs/index.js`, document.baseURI).href)
	.then(() => Promise.all(window.projectLogFiles.map((file) => loadScript(new URL(`${logRoot}/logs/${file}`, document.baseURI).href))))
	.then(() => renderLogs(window.projectLogs.sort((a, b) => b.date.localeCompare(a.date))))
	.catch((error) => {
		logList.textContent = `Dev log unavailable: ${error.message}`;
	});

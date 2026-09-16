window.devLogCommands = [];
window.devLogInitialCommands = ['ls-projects', 'cat-about', 'open-dev-log'];

const commandFiles = ['ls-projects.js', 'cat-about.js', 'open-dev-log.js'];

window.addTerminalCommand = (command) => {
	window.devLogCommands.push(command);
};

window.removeTerminalCommand = (commandId) => {
	const commandIndex = window.devLogCommands.findIndex((command) => command.id === commandId);
	if (commandIndex !== -1) window.devLogCommands.splice(commandIndex, 1);
};

const loadScript = (fileName) => new Promise((resolve, reject) => {
	const script = document.createElement('script');
	script.src = `commands/${fileName}`;
	script.onload = resolve;
	script.onerror = reject;
	document.head.append(script);
});

const addProjectCommands = async () => {
	const response = await fetch('/api/projects');
	if (!response.ok) throw new Error('Project API unavailable.');
	const { projects } = await response.json();
	const projectIds = [];

	projects.forEach((project) => {
		const commandId = `read-project-${project.slug}`;
		projectIds.push(commandId);
		window.addTerminalCommand({
			id: commandId,
			label: `[ read about ${project.title} ]`,
			command: `./${project.slug}`,
			mainCommand: `./${project.slug}`,
			response: 'opening project terminal ...',
			action: 'open-details-terminal',
			detailPath: project.slug,
			projectPage: `project.html?slug=${encodeURIComponent(project.slug)}`,
			detailCommand: `cat /projects/${project.slug}/readme.txt`,
			detailResponse: project.readme,
			detailActions: [
				{ label: '[ show details ]', command: 'cat details.txt', response: project.details },
				{ label: '[ take me there ]', action: 'go-to-project' }
			],
			next: ['ls-projects', 'open-dev-log', 'cat-about']
		});
	});

	const listCommand = window.devLogCommands.find((command) => command.id === 'ls-projects');
	if (listCommand) {
		listCommand.response = projects.map((project) => `${String(project.number).padStart(2, '0')}-${project.slug}/`).join('\n');
		listCommand.next = [...projectIds, 'cat-about', 'open-dev-log'];
	}
};

Promise.all(commandFiles.map(loadScript)).then(addProjectCommands).then(() => {
	window.devLogCommandsReady = true;
	window.dispatchEvent(new Event('terminal-commands-ready'));
}).catch((error) => {
	console.error(error);
	window.devLogCommandsReady = true;
	window.dispatchEvent(new Event('terminal-commands-ready'));
});

window.devLogCommands = [];
window.devLogInitialCommands = ['ls-projects', 'cat-about', 'open-dev-log'];

const commandFiles = [
	'ls-projects.js',
	'cat-about.js',
	'open-dev-log.js',
	'../projects/01-Dev-website/read-command.js',
	'../projects/01-Dev-website/read-more-command.js',
	'../projects/02-StudyZone/read-command.js',
	'../projects/02-StudyZone/read-more-command.js',
	'../projects/03-project-three/read-command.js',
	'../projects/03-project-three/read-more-command.js'
];

window.addTerminalCommand = (command) => {
	window.devLogCommands.push(command);
};

window.removeTerminalCommand = (commandId) => {
	const commandIndex = window.devLogCommands.findIndex((command) => command.id === commandId);
	if (commandIndex !== -1) window.devLogCommands.splice(commandIndex, 1);
};

const loadCommandFile = (fileName) => new Promise((resolve, reject) => {
	const script = document.createElement('script');
	script.src = `commands/${fileName}`;
	script.onload = resolve;
	script.onerror = reject;
	document.head.append(script);
});

Promise.all(commandFiles.map(loadCommandFile)).then(() => {
	window.devLogCommandsReady = true;
	window.dispatchEvent(new Event('terminal-commands-ready'));
});

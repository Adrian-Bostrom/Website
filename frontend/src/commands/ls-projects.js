window.addTerminalCommand({
	id: 'ls-projects',
	label: '[ ls /projects/ ]',
	command: 'ls /projects/',
	response: 'loading projects from database ...',
	next: ['cat-about', 'open-dev-log']
});

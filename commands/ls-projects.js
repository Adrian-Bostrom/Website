window.addTerminalCommand({
	id: 'ls-projects',
	label: '[ ls /projects/ ]',
	command: 'ls /projects/',
	response: '01-Dev-website/\n02-StudyZone/\n03-project-three/',
	next: ['read-project-one', 'read-project-two', 'read-project-three', 'cat-about', 'open-dev-log']
});

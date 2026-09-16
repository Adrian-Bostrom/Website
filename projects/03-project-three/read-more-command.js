window.addTerminalCommand({
	id: 'read-project-three-more',
	label: '[ read more ]',
	command: 'cat /projects/03-project-three/details.txt',
	response: 'A place for questions before they become finished projects.\nSome experiments stay here; others grow into something else.\nstatus: exploring',
	next: ['ls-projects', 'open-dev-log']
});

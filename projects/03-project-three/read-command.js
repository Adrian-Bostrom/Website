window.addTerminalCommand({
	id: 'read-project-three',
	label: '[ read about project 3 ]',
	command: './read-more-p3',
	mainCommand: './read-more-p3',
	response: 'opening project terminal ...',
	action: 'open-details-terminal',
	detailPath: 'project-three',
	projectPage: 'project-three.html',
	detailCommand: 'cat /projects/03-project-three/readme.txt',
	detailResponse: 'PROJECT THREE\nA collection of notes, research, and unfinished directions.\nstatus: notes',
	detailActions: [
		{ label: '[ show details ]', command: 'cat details.txt', response: 'A place for questions before they become finished projects.\nSome experiments stay here; others grow into something else.\nstatus: exploring' },
		{ label: '[ take me there ]', action: 'go-to-project' }
	],
	next: ['ls-projects', 'open-dev-log', 'cat-about']
});

window.addTerminalCommand({
	id: 'read-project-one',
	label: '[ read about dev website ]',
	command: './dev-website',
	mainCommand: './dev-website',
	response: 'opening project terminal ...',
	action: 'open-details-terminal',
	detailPath: '01-Dev-website',
	projectPage: 'project-one.html',
	detailCommand: 'cat /projects/01-Dev-website/readme.txt',
	detailResponse: 'DEV WEBSITE\nAn interactive development log for sharing projects, experiments, and notes.\nstatus: in progress',
	detailActions: [
		{ label: '[ show details ]', command: 'cat details.txt', response: 'A closer look at the dev website.\nThe site uses a command tree, typewriter output, separate project pages, responsive layouts, and console easter eggs.\nstatus: making progress' },
		{ label: '[ take me there ]', action: 'go-to-project' }
	],
	next: ['ls-projects', 'open-dev-log', 'cat-about']
});

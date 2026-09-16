window.addTerminalCommand({
	id: 'read-project-one-more',
	label: '[ read more ]',
	command: 'cat /projects/01-Dev-website/details.txt',
	response: 'A closer look at the dev website.\nThe site uses a command tree, typewriter output, separate project pages, responsive layouts, and console easter eggs.\nstatus: making progress',
	next: ['ls-projects', 'open-dev-log']
});

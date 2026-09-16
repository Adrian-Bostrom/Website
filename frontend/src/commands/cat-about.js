window.addTerminalCommand({
	id: 'cat-about',
	label: '[ cat about.txt ]',
	command: 'cat about.txt',
	response: 'Adrian Boström\nindependent developer\nbuilding small, thoughtful things.',
	next: ['ls-projects', 'open-dev-log']
});

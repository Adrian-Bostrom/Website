window.addTerminalCommand({
	id: 'read-project-two-more',
	label: '[ read more ]',
	command: 'cat /projects/02-StudyZone/content.js',
	response: 'StudyZone combines Canvas course data with AI models to create a study planner tailored to specific courses.\nI developed it together with seven other people.\nstatus: maintained',
	next: ['ls-projects', 'open-dev-log']
});

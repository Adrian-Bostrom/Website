window.addTerminalCommand({
	id: 'read-project-two',
	label: '[ read about StudyZone ]',
	command: './read-more-p2',
	mainCommand: './read-more-p2',
	response: 'opening project terminal ...',
	action: 'open-details-terminal',
	detailPath: '02-StudyZone',
	projectPage: 'project-two.html',
	detailCommand: 'cat /projects/02-StudyZone/content.js',
	detailResponse: 'STUDYZONE\nAn AI-powered study planner built from course information gathered from Canvas through a browser extension.\nstatus: live',
	detailActions: [
		{ label: '[ show details ]', command: 'cat details.txt', response: 'StudyZone combines Canvas course data with AI models to create a study planner tailored to specific courses.\nI developed it together with seven other people.\nstatus: maintained' },
		{ label: '[ take me there ]', action: 'go-to-project' }
	],
	next: ['ls-projects', 'open-dev-log', 'cat-about']
});

console.log('%cHELLO, CURIOUS HUMAN.', 'font-size: 18px; font-weight: bold;');
console.log('%cWelcome to Adrian\'s tiny corner of the internet.', 'color: #a5a5a5;');

const dotMessages = [
	'Nice try. This dot is purely decorative.',
	'This terminal has no minimizing department.',
	'Congratulations, you found the pretend maximize button.'
];

document.addEventListener('click', (event) => {
	const dot = event.target.closest('.dot');
	if (!dot) return;
	if (Number(dot.dataset.dotIndex) === 0) {
		const contactTerminal = dot.closest('.contact-terminal');
		if (contactTerminal) {
			closeContactTerminal();
			return;
		}
		const detailTerminal = dot.closest('.detail-terminal');
		if (detailTerminal) {
			openedProjects.delete(detailTerminal.dataset.detailPath);
			detailTerminal.remove();
			if (!detailTerminals.children.length) terminalLayout.classList.remove('side-open');
			return;
		}
		enterSite();
		return;
	}
	window.alert(dotMessages[Number(dot.dataset.dotIndex)]);
});

document.addEventListener('keydown', (event) => {
	if (!['Enter', ' '].includes(event.key) || !event.target.matches('.dot')) return;
	event.preventDefault();
	event.target.click();
});

const output = document.querySelector('#terminal-output');
const terminalBody = document.querySelector('.terminal-body');
const bootLines = document.querySelectorAll('[data-boot-text]');
const welcomeText = document.querySelector('#welcome-text');
const terminalPrompt = document.querySelector('#terminal-prompt');
const commandArea = document.querySelector('.terminal-actions');
const terminalLayout = document.querySelector('.terminal-layout');
const detailTerminals = document.querySelector('#detail-terminals');
const openedProjects = new Set();
const contactButton = document.querySelector('#contact-button');
const contactBackdrop = document.querySelector('#contact-terminal-backdrop');
const contactCommand = document.querySelector('#contact-command');
const contactResponse = document.querySelector('#contact-response');
const closeContact = document.querySelector('#close-contact');
let activePrompt = terminalPrompt;

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));
const typeText = (element, text, speed = 24) => new Promise((resolve) => {
	let index = 0;
	const typeNextCharacter = () => {
		if (index === text.length) {
			resolve();
			return;
		}
		element.textContent += text[index];
		index += 1;
		window.setTimeout(typeNextCharacter, speed);
	};
	typeNextCharacter();
});

const runBootSequence = async () => {
	for (const line of bootLines) {
		await typeText(line, line.dataset.bootText);
		await wait(110);
	}
	await typeText(welcomeText, 'WELCOME', 80);
	await wait(180);
	await typeText(terminalPrompt, 'visitor@adrian:~$', 24);
	await wait(110);
	terminalBody.classList.add('boot-complete');
};

const enterSite = () => {
	document.body.classList.add('entered');
	window.setTimeout(() => document.querySelector('#projects').focus(), 500);
};

if (window.location.hash === '#projects') {
	document.body.classList.add('entered');
	window.setTimeout(() => document.querySelector('#projects').scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
}

const openContactTerminal = async () => {
	contactBackdrop.hidden = false;
	contactCommand.textContent = '';
	contactResponse.textContent = '';
	await typeText(contactCommand, 'contact@adrian:~$ cat contact.txt');
	await typeText(contactResponse, 'email: adrian@familybostrom.se\n');
	await typeText(contactResponse, 'location: Stockholm, Sweden\n');
	await typeText(contactResponse, 'status: open to interesting projects\n');
};

const closeContactTerminal = () => {
	contactBackdrop.hidden = true;
};

contactButton.addEventListener('click', openContactTerminal);
closeContact.addEventListener('click', closeContactTerminal);
contactBackdrop.addEventListener('click', (event) => {
	if (event.target === contactBackdrop) closeContactTerminal();
});

const renderCommands = (commandIds) => {
	commandArea.replaceChildren();
	commandIds.forEach((commandId) => {
		const command = window.devLogCommands.find((registeredCommand) => registeredCommand.id === commandId);
		if (!command) return;
		const button = document.createElement('button');
		button.className = 'command-button';
		button.type = 'button';
		button.textContent = command.label;
		button.addEventListener('click', () => runCommand(command, button));
		commandArea.append(button);
	});
	commandArea.classList.remove('is-typing');
};

const createDetailTerminal = (command) => {
	const terminal = document.createElement('div');
	terminal.className = 'detail-terminal';
	terminal.dataset.detailPath = command.detailPath;
	terminal.setAttribute('aria-label', `${command.detailPath} project terminal`);
	const bar = document.createElement('div');
	bar.className = 'terminal-bar';
	bar.innerHTML = '<span class="dot" data-dot-index="0" role="button" tabindex="0" aria-label="Close terminal"></span><span class="dot" data-dot-index="1" role="button" tabindex="0" aria-label="Minimize terminal"></span><span class="dot" data-dot-index="2" role="button" tabindex="0" aria-label="Maximize terminal"></span>';
	const name = document.createElement('span');
	name.className = 'terminal-name';
	name.textContent = `details@adrian:~/${command.detailPath}`;
	bar.append(name);
	const body = document.createElement('div');
	body.className = 'terminal-body';
	const detailCommand = document.createElement('p');
	const detailResponse = document.createElement('p');
	detailResponse.className = 'dim';
	const detailPrompt = document.createElement('p');
	const actionArea = document.createElement('div');
	actionArea.className = 'detail-actions is-typing';
	body.append(detailCommand, detailResponse, detailPrompt, actionArea);
	terminal.append(bar, body);
	detailTerminals.append(terminal);
	command.detailActions.forEach((action) => {
		const button = document.createElement('button');
		button.className = 'detail-button';
		button.type = 'button';
		button.textContent = action.label;
		button.addEventListener('click', async () => {
			actionArea.classList.add('is-typing');
			button.disabled = true;
			if (action.action === 'go-to-project') {
				window.location.href = command.projectPage;
				return;
			}
			const actionResponse = document.createElement('p');
			actionResponse.className = 'dim';
			await typeText(detailPrompt, ` ${action.command}`);
			body.insertBefore(actionResponse, actionArea);
			await typeText(actionResponse, action.response);
			button.remove();
			actionArea.classList.remove('is-typing');
		});
		actionArea.append(button);
	});
	return { detailCommand, detailResponse, detailPrompt, actionArea };
};

const runCommand = async (command, button) => {
	commandArea.classList.add('is-typing');
	if (command.action === 'open-details-terminal') {
		await typeText(activePrompt, ` ${command.command}`);
		if (openedProjects.has(command.detailPath)) {
			const errorLine = document.createElement('p');
			errorLine.className = 'output-line dim';
		errorLine.textContent = `ERROR: terminal for ${command.detailPath} is already open.`;
			output.append(errorLine);
			activePrompt = document.createElement('p');
			activePrompt.className = 'output-line terminal-prompt';
			output.append(activePrompt);
			await typeText(activePrompt, 'visitor@adrian:~$');
			renderCommands(command.next);
			return;
		}
		openedProjects.add(command.detailPath);
		terminalLayout.classList.add('side-open');
		const detailTerminal = createDetailTerminal(command);
		const { detailCommand, detailResponse, detailPrompt, actionArea } = detailTerminal;
		await typeText(detailCommand, `visitor@adrian:~/projects/${command.detailPath}/$ cat readme.txt`);
		await typeText(detailResponse, command.detailResponse);
		await typeText(detailPrompt, 'visitor@adrian:~/projects/' + command.detailPath + '/$');
		actionArea.classList.remove('is-typing');
		activePrompt = document.createElement('p');
		activePrompt.className = 'output-line terminal-prompt';
		output.append(activePrompt);
		await typeText(activePrompt, 'visitor@adrian:~$');
		renderCommands(command.next);
		return;
	}
	const responseLine = document.createElement('p');
	responseLine.className = 'output-line dim';
	output.append(responseLine);
	button.disabled = true;
	await typeText(activePrompt, ` ${command.command}`);
	await typeText(responseLine, command.response);
	if (command.action === 'open-site') {
		window.setTimeout(enterSite, 300);
		return;
	}
	activePrompt = document.createElement('p');
	activePrompt.className = 'output-line terminal-prompt';
	output.append(activePrompt);
	await typeText(activePrompt, 'visitor@adrian:~$');
	renderCommands(command.next);
};

document.addEventListener('keydown', (event) => {
	if (event.key === 'Enter' && event.target.tagName !== 'BUTTON' && !document.body.classList.contains('entered')) enterSite();
});

const initializeTerminal = () => {
	runBootSequence();
	renderCommands(window.devLogInitialCommands);
};

if (window.devLogCommandsReady) {
	initializeTerminal();
} else {
	window.addEventListener('terminal-commands-ready', initializeTerminal, { once: true });
}

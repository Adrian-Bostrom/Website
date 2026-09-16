const contactButton = document.querySelector('#contact-button');
const contactBackdrop = document.querySelector('#contact-terminal-backdrop');
const contactCommand = document.querySelector('#contact-command');
const contactResponse = document.querySelector('#contact-response');
const closeContact = document.querySelector('#close-contact');
const dotMessages = [
	'Nice try. This dot is purely decorative.',
	'This terminal has no minimizing department.',
	'Congratulations, you found the pretend maximize button.'
];

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

const openContactTerminal = async () => {
	contactBackdrop.hidden = false;
	contactCommand.textContent = '';
	contactResponse.textContent = '';
	await typeText(contactCommand, 'contact@adrian:~$ cat contact.txt');
	await typeText(contactResponse, 'email: adrian@familybostrom.se\nlocation: Stockholm, Sweden\nstatus: open to interesting projects');
};

const closeContactTerminal = () => {
	contactBackdrop.hidden = true;
};

contactButton.addEventListener('click', openContactTerminal);
closeContact.addEventListener('click', closeContactTerminal);
contactBackdrop.addEventListener('click', (event) => {
	if (event.target === contactBackdrop) closeContactTerminal();
});
document.addEventListener('click', (event) => {
	const dot = event.target.closest('.contact-terminal .dot');
	if (!dot) return;
	if (Number(dot.dataset.dotIndex) === 0) {
		closeContactTerminal();
		return;
	}
	window.alert(dotMessages[Number(dot.dataset.dotIndex)]);
});
document.addEventListener('keydown', (event) => {
	if (!['Enter', ' '].includes(event.key) || !event.target.matches('.contact-terminal .dot')) return;
	event.preventDefault();
	event.target.click();
});

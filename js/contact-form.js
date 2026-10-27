const contactForm = document.getElementById('contact-form');
const successMessage = document.getElementById('form-success');
const messageCounter = document.getElementById('message-counter');

const rules = {
    name:    [value => /^[A-Za-zĂÂÎȘȚăâîșț\s-]{2,}$/.test(value), "Name must have at least 2 letters."],
    email:   [value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Please enter a valid email address."],
    phone:   [value => value === "" || /^[0-9+\s()-]{7,20}$/.test(value), "Phone can contain only digits, spaces, +, - and ( )."],
    subject: [value => value !== "", "Please choose a subject."],
    message: [value => value.length >= 10 && value.length <= 1000, "Message must have between 10 and 1000 characters."]
}

function validateField(field){
    const [isCorrect, errorText] = rules[field.name];

    const value = field.value.trim();
    const isValid = isCorrect(value);

    field.parentElement.querySelector('.field-error').textContent = isValid ? "" : errorText;

    field.classList.toggle('invalid', !isValid);
    field.classList.toggle('valid', isValid && value !== "");

    return isValid;
}

contactForm.addEventListener('focusout', (event) => {
    if(rules[event.target.name]) validateField(event.target);
});

contactForm.addEventListener('input', (event) =>{
    if(event.target.classList.contains('invalid')) validateField(event.target);

    const length = contactForm.elements.message.value.length;
    messageCounter.textContent = `${length} / 1000`;
    messageCounter.classList.toggle('over-limit', length > 1000);
});

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = Object.keys(rules).map(name => contactForm.elements[name]);

    const results = fields.map(field => validateField(field))

    if(results.includes(false)){
        successMessage.classList.add('hidden');
        contactForm.querySelector('.invalid').focus();
        return;
    }

    const name = contactForm.elements.name.value.trim();

    successMessage.textContent = `Thank you, ${name}! Your message has been validated successfully.`;
    successMessage.classList.remove('hidden');

    contactForm.reset();
    fields.forEach(field => field.classList.remove('valid'));
    messageCounter.textContent = "0 / 1000";
});


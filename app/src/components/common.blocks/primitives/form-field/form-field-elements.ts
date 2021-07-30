type FormFieldElement = HTMLDivElement;

const formFieldElements = document.querySelectorAll<FormFieldElement>('.js-form-field');

export { formFieldElements as default, FormFieldElement };

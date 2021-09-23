import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';

import formFieldElements, { FormFieldElement } from './form-field-elements';

type FormFieldDOM = {
  input: HTMLInputElement | HTMLTextAreaElement;
};

// eslint-disable-next-line @typescript-eslint/ban-types
type FormFieldCustomEvents = {};

class FormField extends BEMComponent<FormFieldElement, FormFieldCustomEvents> {
  protected readonly _DOM: Readonly<FormFieldDOM>;

  constructor(formFieldElement: FormFieldElement) {
    super(formFieldElement);

    this._DOM = this._initDOM();
  }

  get() {
    return this._DOM.input.value;
  }

  set(value: string) {
    this._DOM.input.value = value;

    return this;
  }

  protected _initDOM() {
    const input = this.element.querySelector(
      '.js-form-field__input'
    ) as FormFieldDOM['input'];

    return { input };
  }
}

type FormFieldElementWithComponent = HTMLElementWithComponent<
  FormFieldElement,
  FormFieldCustomEvents,
  FormField
>;

const formFields = Array.from(
  formFieldElements,
  (formFieldElement) => new FormField(formFieldElement)
);

export type { FormFieldCustomEvents, FormField, FormFieldElementWithComponent };

export { formFields as default };

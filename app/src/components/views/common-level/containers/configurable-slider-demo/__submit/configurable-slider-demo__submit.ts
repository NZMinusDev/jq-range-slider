import BEMComponent, {
  HTMLElementWithComponent,
} from '@shared/utils/scripts/view/BEM/BEMComponent';

import configurableSliderDemoElements from '../configurable-slider-demo-elements';

type ConfigurableSliderDemoSubmitElement = HTMLFormElement;

type ConfigurableSliderDemoSubmitDOM = {
  textField: HTMLInputElement;
  submitBtn: HTMLButtonElement;
  resetBtn: HTMLButtonElement;
};

type ConfigurableSliderDemoSubmitCustomEvents = {
  customSubmit: { value: string };
  customReset: { value: string };
};

class ConfigurableSliderDemoSubmit extends BEMComponent<
  ConfigurableSliderDemoSubmitElement,
  ConfigurableSliderDemoSubmitCustomEvents
> {
  protected readonly _DOM: Readonly<ConfigurableSliderDemoSubmitDOM>;

  constructor(
    configurableSliderDemoSubmitElement: ConfigurableSliderDemoSubmitElement
  ) {
    super(configurableSliderDemoSubmitElement);

    this._DOM = this._initDOM();

    this._bindListeners();
  }

  set(value: string) {
    this._DOM.textField.value = value;

    return this;
  }

  protected _initDOM() {
    const formName = this.element.name;

    const textField = this.element.elements.namedItem(
      `${formName}-setter`
    ) as ConfigurableSliderDemoSubmitDOM['textField'];
    const submitBtn = this.element.elements.namedItem(
      `${formName}-set`
    ) as ConfigurableSliderDemoSubmitDOM['submitBtn'];
    const resetBtn = this.element.elements.namedItem(
      `${formName}-reset`
    ) as ConfigurableSliderDemoSubmitDOM['resetBtn'];

    return { textField, submitBtn, resetBtn };
  }

  protected _bindListeners() {
    this.element.addEventListener('submit', this.onSubmit);
    this.element.addEventListener('reset', this.onReset);

    return this;
  }

  protected onSubmit = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    this.element.dispatchEvent(
      new CustomEvent('customSubmit', {
        bubbles: true,
        detail: { value: this._DOM.textField.value },
      })
    );
  };

  protected onReset = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    this.element.dispatchEvent(
      new CustomEvent('customReset', {
        bubbles: true,
        detail: { value: this._DOM.textField.value },
      })
    );
  };
}

type ConfigurableSliderDemoSubmitElementWithComponent =
  HTMLElementWithComponent<
    ConfigurableSliderDemoSubmitElement,
    ConfigurableSliderDemoSubmitCustomEvents,
    ConfigurableSliderDemoSubmit
  >;

const configurableSliderDemoSubmits = Array.from(
  configurableSliderDemoElements,
  (configurableSliderDemoElement) => {
    const configurableSliderDemoSubmitElement =
      configurableSliderDemoElement.querySelector(
        '.js-configurable-slider-demo__submit'
      ) as ConfigurableSliderDemoSubmitElement;

    return new ConfigurableSliderDemoSubmit(
      configurableSliderDemoSubmitElement
    );
  }
);

export type {
  ConfigurableSliderDemoSubmitCustomEvents,
  ConfigurableSliderDemoSubmit,
  ConfigurableSliderDemoSubmitElementWithComponent,
};

export { configurableSliderDemoSubmits as default };

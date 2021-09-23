import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';
import type { FormFieldElementWithComponent } from '@views/common-level/primitives/form-field/form-field';
import '@views/common-level/primitives/form-field/form-field';

import type {
  SliderDatepickerSliderCustomEvents,
  SliderDatepickerSliderElementWithComponent,
} from './__slider/slider-datepicker__slider';
import './__slider/slider-datepicker__slider';
import sliderDatepickerElements, {
  SliderDatepickerElement,
} from './slider-datepicker-elements';

type SliderDatepickerDOM = {
  slider: SliderDatepickerSliderElementWithComponent;
  resultTextFields: [
    FormFieldElementWithComponent,
    FormFieldElementWithComponent
  ];
};

type SliderDatepickerState = { value: [Date, Date] };

type SliderDatepickerCustomEvents = SliderDatepickerSliderCustomEvents;

class SliderDatepicker extends BEMComponent<
  SliderDatepickerElement,
  SliderDatepickerCustomEvents
> {
  protected readonly _DOM: Readonly<SliderDatepickerDOM>;

  protected readonly _state: SliderDatepickerState;

  constructor(sliderDatepickerElement: SliderDatepickerElement) {
    super(sliderDatepickerElement);

    this._DOM = this._initDOM();

    this._state = this._initState();

    this._bindSlidersListeners();

    this._initDisplay();
  }

  protected _initDOM() {
    const slider = this.element.querySelector(
      '.js-slider-datepicker__slider'
    ) as SliderDatepickerDOM['slider'];
    const resultTextFields = [
      ...this.element.querySelectorAll(
        '.js-slider-datepicker__text-field .js-form-field'
      ),
    ] as SliderDatepickerDOM['resultTextFields'];

    return { slider, resultTextFields };
  }

  // eslint-disable-next-line class-methods-use-this
  protected _initState() {
    const value = this._DOM.slider.component
      .get()
      .map((val) => new Date(val)) as SliderDatepickerState['value'];

    return { value };
  }

  protected _bindSlidersListeners() {
    this._DOM.slider.component.addCustomEventListener(
      'update',
      this._sliderEventListenerObject.handleSliderUpdate
    );

    return this;
  }

  protected _sliderEventListenerObject = {
    handleSliderUpdate: (
      event: CustomEvent<SliderDatepickerCustomEvents['update']>
    ) => {
      this._state.value = [...event.detail.value];

      this._displayResult();
    },
  };

  protected _initDisplay() {
    this._displayResult();

    return this;
  }

  protected _displayResult() {
    const [lowerValueResultTextField, greaterValueResultTextField] =
      this._DOM.resultTextFields;
    const [lowerValue, greaterValue] = this._state.value;

    lowerValueResultTextField.component.set(lowerValue.toString());
    greaterValueResultTextField.component.set(greaterValue.toString());

    return this;
  }
}

type SliderDatepickerElementWithComponent = HTMLElementWithComponent<
  SliderDatepickerElement,
  SliderDatepickerCustomEvents,
  SliderDatepicker
>;

const sliderDatepickers = Array.from(
  sliderDatepickerElements,
  (sliderDatepickerElement) => new SliderDatepicker(sliderDatepickerElement)
);

export type {
  SliderDatepickerCustomEvents,
  SliderDatepicker,
  SliderDatepickerElementWithComponent,
};

export { sliderDatepickers as default };

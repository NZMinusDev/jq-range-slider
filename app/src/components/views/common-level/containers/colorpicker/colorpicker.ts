import BEMComponent, {
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/view/BEM/BEMComponent';

import type {
  ColorpickerSliderCustomEvents,
  ColorpickerSliderElementWithComponent,
} from './__slider/colorpicker__slider';
import './__slider/colorpicker__slider';
import colorpickerElements, {
  ColorpickerElement,
} from './colorpicker-elements';

type ColorpickerDOM = {
  sliders: ColorpickerSliderElementWithComponent[];
  result: HTMLDivElement;
};

type ColorpickerState = { value: [number, number, number] };

type ColorpickerCustomEvents = ColorpickerSliderCustomEvents;

class Colorpicker extends BEMComponent<
  ColorpickerElement,
  ColorpickerCustomEvents
> {
  protected readonly _DOM: Readonly<ColorpickerDOM>;

  protected readonly _state: ColorpickerState;

  constructor(colorpickerElement: ColorpickerElement) {
    super(colorpickerElement);

    this._DOM = this._initDOM();

    this._state = Colorpicker._initState();

    this._bindSlidersListeners();

    this._initDisplay();
  }

  protected _initDOM() {
    const sliders = [
      ...this.element.querySelectorAll('.js-colorpicker__slider'),
    ] as ColorpickerDOM['sliders'];
    const result = this.element.querySelector(
      '.js-colorpicker__result'
    ) as ColorpickerDOM['result'];

    return { sliders, result };
  }

  protected static _initState() {
    const value = [127, 127, 127] as ColorpickerState['value'];

    return { value };
  }

  protected _bindSlidersListeners() {
    this._DOM.sliders.forEach((slider) => {
      slider.component.addCustomEventListener(
        'update',
        this._sliderEventListenerObject.handleSliderUpdate
      );
    });

    return this;
  }

  protected _sliderEventListenerObject = {
    handleSliderUpdate: (
      event: CustomEvent<ColorpickerCustomEvents['update']>
    ) => {
      const target = event.target as Node;
      const sliderIndex = this._DOM.sliders.findIndex((slider) =>
        slider.contains(target)
      );
      const sliderValue = event.detail.value;

      this._state.value[sliderIndex] = sliderValue;

      this._displayResult();
    },
  };

  protected _initDisplay() {
    this._displayResult();

    return this;
  }

  protected _displayResult() {
    const color = `rgb(${this._state.value.join(',')})`;

    this._DOM.result.style.backgroundColor = color;
    this._DOM.result.style.color = color;

    return this;
  }
}

type ColorpickerElementWithComponent = HTMLElementWithComponent<
  ColorpickerElement,
  ColorpickerCustomEvents,
  Colorpicker
>;

const colorpickers = Array.from(
  colorpickerElements,
  (colorpickerElement) => new Colorpicker(colorpickerElement)
);

export type {
  ColorpickerCustomEvents,
  Colorpicker,
  ColorpickerElementWithComponent,
};

export { colorpickers as default };

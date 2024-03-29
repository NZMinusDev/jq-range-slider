import BEMComponent, {
  HTMLElementWithComponent,
} from '@shared/utils/scripts/components/BEM/BEMComponent';
import type {
  SliderCustomEvents,
  SliderElementWithComponent,
} from '@components/common-level/primitives/slider/slider';
import '@components/common-level/primitives/slider/slider';

import colorpickerElements from '../colorpicker-elements';

type ColorpickerSliderElement = HTMLDivElement;

type ColorpickerSliderDOM = {
  slider: SliderElementWithComponent;
};

type ColorpickerSliderCustomEvents = Omit<SliderCustomEvents, 'update'> & {
  update: { value: number };
};

class ColorpickerSlider extends BEMComponent<
  ColorpickerSliderElement,
  ColorpickerSliderCustomEvents
> {
  protected readonly _DOM: Readonly<ColorpickerSliderDOM>;

  constructor(colorpickerSliderElement: ColorpickerSliderElement) {
    super(colorpickerSliderElement);

    this._DOM = this._initDOM();

    this._bindSliderListeners();
  }

  protected _initDOM() {
    const slider = this.element.querySelector(
      '.js-slider'
    ) as ColorpickerSliderDOM['slider'];

    return { slider };
  }

  protected _bindSliderListeners() {
    this._DOM.slider.component.addCustomEventListener(
      'update',
      this._sliderEventListenerObject.handleSliderUpdate
    );

    return this;
  }

  protected _sliderEventListenerObject = {
    handleSliderUpdate: (event: CustomEvent<SliderCustomEvents['update']>) => {
      const reassignedEvent = event as unknown as CustomEvent<
        ColorpickerSliderCustomEvents['update']
      >;
      const [colorValue] = event.detail.value;

      reassignedEvent.detail.value = colorValue;
    },
  };
}

type ColorpickerSliderElementWithComponent = HTMLElementWithComponent<
  ColorpickerSliderElement,
  ColorpickerSliderCustomEvents,
  ColorpickerSlider
>;

const colorpickerSliders = Array.from(
  colorpickerElements,
  (colorpickerElement) =>
    Array.from(
      colorpickerElement.querySelectorAll<ColorpickerSliderElement>(
        '.js-colorpicker__slider'
      ),
      (colorpickerSliderElement) =>
        new ColorpickerSlider(colorpickerSliderElement)
    )
).flat();

export type {
  ColorpickerSliderCustomEvents,
  ColorpickerSlider,
  ColorpickerSliderElementWithComponent,
};

export { colorpickerSliders as default };

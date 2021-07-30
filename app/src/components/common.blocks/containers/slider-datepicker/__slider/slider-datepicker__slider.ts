import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';
import { Unpacked } from '@utils/devTools/scripts/TypingHelper';
import type {
  Slider,
  SliderCustomEvents,
  SliderElementWithComponent,
} from '@common.blocks/primitives/slider/slider';
import '@common.blocks/primitives/slider/slider';

import sliderDatepickerElements from '../slider-datepicker-elements';

type SliderDatepickerSliderElement = HTMLDivElement;

type SliderDatepickerSliderDOM = {
  slider: SliderElementWithComponent;
};

type SliderDatepickerSliderCustomEvents = Omit<SliderCustomEvents, 'update'> & {
  update: { value: [Date, Date] };
};

class SliderDatepickerSlider extends BEMComponent<
  SliderDatepickerSliderElement,
  SliderDatepickerSliderCustomEvents
> {
  protected readonly _DOM: Readonly<SliderDatepickerSliderDOM>;

  constructor(sliderDatepickerSliderElement: SliderDatepickerSliderElement) {
    super(sliderDatepickerSliderElement);

    this._DOM = this._initDOM();

    this._bindSliderListeners();
  }

  get() {
    return this._DOM.slider.component.get();
  }
  set(value: Unpacked<Parameters<Slider['set']>>) {
    this._DOM.slider.component.set(value);

    return this;
  }

  protected _initDOM() {
    const slider = this.element.querySelector('.js-slider') as SliderDatepickerSliderDOM['slider'];

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
      const dates = event.detail.value.map((value) => new Date(value));
      // eslint-disable-next-line no-param-reassign
      ((event as unknown) as CustomEvent<
        SliderDatepickerSliderCustomEvents['update']
      >).detail.value = dates as SliderDatepickerSliderCustomEvents['update']['value'];
    },
  };
}

type SliderDatepickerSliderElementWithComponent = HTMLElementWithComponent<
  SliderDatepickerSliderElement,
  SliderDatepickerSliderCustomEvents,
  SliderDatepickerSlider
>;

const sliderDatepickerSliders = Array.from(sliderDatepickerElements, (sliderDatepickerElement) => {
  const sliderDatepickerSliderElement = sliderDatepickerElement.querySelector(
    '.js-slider-datepicker__slider'
  ) as SliderDatepickerSliderElement;

  return new SliderDatepickerSlider(sliderDatepickerSliderElement);
});

export type {
  SliderDatepickerSliderCustomEvents,
  SliderDatepickerSlider,
  SliderDatepickerSliderElementWithComponent,
};

export { sliderDatepickerSliders as default };

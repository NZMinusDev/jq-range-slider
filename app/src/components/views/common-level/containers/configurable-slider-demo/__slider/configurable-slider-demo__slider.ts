import BEMComponent, {
  HTMLElementWithComponent,
} from '@shared/utils/scripts/view/BEM/BEMComponent';
import { Unpacked } from '@shared/utils/scripts/TypingHelper';
import type {
  Slider,
  SliderCustomEvents,
  SliderElementWithComponent,
  RangeSliderOptions,
} from '@views/common-level/primitives/slider/slider';
import '@views/common-level/primitives/slider/slider';

import configurableSliderDemoElements from '../configurable-slider-demo-elements';

type ConfigurableSliderDemoSliderElement = HTMLDivElement;

type ConfigurableSliderDemoSliderDOM = {
  slider: SliderElementWithComponent;
};

type ConfigurableSliderDemoSliderCustomEvents = {} & SliderCustomEvents;

class ConfigurableSliderDemoSlider extends BEMComponent<
  ConfigurableSliderDemoSliderElement,
  ConfigurableSliderDemoSliderCustomEvents
> {
  protected readonly _DOM: Readonly<ConfigurableSliderDemoSliderDOM>;

  constructor(
    configurableSliderDemoSliderElement: ConfigurableSliderDemoSliderElement
  ) {
    super(configurableSliderDemoSliderElement);

    this._DOM = this._initDOM();
  }

  getOptions() {
    return this._DOM.slider.component.getOptions();
  }

  setOptions(options?: Unpacked<Parameters<Slider['setOptions']>>) {
    this._DOM.slider.component.setOptions(options);

    return this;
  }

  get() {
    return this._DOM.slider.component.get();
  }

  set(value?: Unpacked<Parameters<Slider['set']>>) {
    this._DOM.slider.component.set(value);

    return this;
  }

  protected _initDOM() {
    const slider = this.element.querySelector(
      '.js-slider'
    ) as ConfigurableSliderDemoSliderDOM['slider'];

    return { slider };
  }
}

type ConfigurableSliderDemoSliderElementWithComponent =
  HTMLElementWithComponent<
    ConfigurableSliderDemoSliderElement,
    ConfigurableSliderDemoSliderCustomEvents,
    ConfigurableSliderDemoSlider
  >;

const configurableSliderDemoSliders = Array.from(
  configurableSliderDemoElements,
  (configurableSliderDemoElement) => {
    const configurableSliderDemoSliderElement =
      configurableSliderDemoElement.querySelector(
        '.js-configurable-slider-demo__slider'
      ) as ConfigurableSliderDemoSliderElement;

    return new ConfigurableSliderDemoSlider(
      configurableSliderDemoSliderElement
    );
  }
);

export type {
  ConfigurableSliderDemoSliderCustomEvents,
  ConfigurableSliderDemoSlider,
  ConfigurableSliderDemoSliderElementWithComponent,
  RangeSliderOptions,
};

export { configurableSliderDemoSliders as default };

import BEMComponent, {
  HTMLElementWithComponent,
} from '@shared/utils/scripts/components/BEM/BEMComponent';
import { Unpacked } from '@shared/utils/scripts/types/utility';
import { RangeSliderPluginOptions } from '@plugin/types';
import '@plugin/range-slider-plugin';

import sliderElements, { SliderElement } from './slider-elements';

type RangeSliderPlugin = InstanceType<typeof window.RangeSliderPlugin>;

type SliderHTMLOptions = Omit<RangeSliderPluginOptions, 'formatter'> & {
  formatter: string;
};

type SliderCustomEvents = {
  start: {};
  slide: {};
  update: { value: number[] };
  change: { value: number[] };
  set: { value: number[] };
  end: {};
  render: {};
};

class Slider extends BEMComponent<SliderElement, SliderCustomEvents> {
  protected readonly _options: RangeSliderPluginOptions;

  protected readonly _libSlider: RangeSliderPlugin;

  constructor(sliderElement: SliderElement) {
    super(sliderElement);

    this._options = this._initOptionsFromHTML();

    this._libSlider = this._initLibSlider();

    this._bindLibSliderListeners();
  }

  getOptions() {
    return this._libSlider.getOptions();
  }

  setOptions(options?: RangeSliderPluginOptions) {
    this._libSlider.setOptions(options);
    this.element.dispatchEvent(
      new CustomEvent('set', {
        bubbles: true,
        detail: { value: this._libSlider.get() },
      })
    );

    return this;
  }

  get() {
    return this._libSlider.get();
  }

  set(value: Unpacked<Parameters<RangeSliderPlugin['set']>>) {
    this._libSlider.set(value);

    return this;
  }

  protected _initOptionsFromHTML() {
    const options = JSON.parse(
      this.element.dataset.options as string
    ) as SliderHTMLOptions;
    // eslint-disable-next-line no-eval
    options.formatter = window.eval(options.formatter);

    return options as unknown as RangeSliderPluginOptions;
  }

  protected _initLibSlider() {
    const plugin = new window.RangeSliderPlugin(this.element, {
      options: this._options,
    });

    this.element.plugin = plugin;

    return plugin;
  }

  protected _bindLibSliderListeners() {
    this._libSlider.on(
      'start',
      this._libSliderEventListenerObject.handleLibSliderStart
    );
    this._libSlider.on(
      'slide',
      this._libSliderEventListenerObject.handleLibSliderSlide
    );
    this._libSlider.on(
      'update',
      this._libSliderEventListenerObject.handleLibSliderUpdate
    );
    this._libSlider.on(
      'change',
      this._libSliderEventListenerObject.handleLibSliderChange
    );
    this._libSlider.on(
      'set',
      this._libSliderEventListenerObject.handleLibSliderSet
    );
    this._libSlider.on(
      'end',
      this._libSliderEventListenerObject.handleLibSliderEnd
    );
    this._libSlider.on(
      'render',
      this._libSliderEventListenerObject.handleLibSliderRender
    );

    return this;
  }

  protected _libSliderEventListenerObject = {
    handleLibSliderStart: () => {
      this.element.dispatchEvent(new CustomEvent('start', { bubbles: true }));
    },
    handleLibSliderSlide: () => {
      this.element.dispatchEvent(new CustomEvent('slide', { bubbles: true }));
    },
    handleLibSliderUpdate: () => {
      this.element.dispatchEvent(
        new CustomEvent('update', {
          bubbles: true,
          detail: { value: this._libSlider.get() },
        })
      );
    },
    handleLibSliderChange: () => {
      this.element.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          detail: { value: this._libSlider.get() },
        })
      );
    },
    handleLibSliderSet: () => {
      this.element.dispatchEvent(
        new CustomEvent('set', {
          bubbles: true,
          detail: { value: this._libSlider.get() },
        })
      );
    },
    handleLibSliderEnd: () => {
      this.element.dispatchEvent(new CustomEvent('end', { bubbles: true }));
    },
    handleLibSliderRender: () => {
      this.element.dispatchEvent(new CustomEvent('render', { bubbles: true }));
    },
  };
}

type SliderElementWithComponent = HTMLElementWithComponent<
  SliderElement,
  SliderCustomEvents,
  Slider
>;

const sliders = Array.from(
  sliderElements,
  (sliderElement) => new Slider(sliderElement)
);

export type { SliderCustomEvents, Slider, SliderElementWithComponent };

export { sliders as default };

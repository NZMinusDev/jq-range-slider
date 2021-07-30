import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';
import '@plugin/range-slider-plugin';
import IRangeSliderPresenter from '@plugin/presenter/range-slider.coupling';
import { RangeSliderOptions } from '@plugin/view/range-slider.view.coupling';

type SliderElement = HTMLDivElement;

type SliderHTMLOptions = Omit<RangeSliderOptions, 'formatter'> & { formatter: string };

type SliderCustomEvents = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  start: {};
  // eslint-disable-next-line @typescript-eslint/ban-types
  slide: {};
  update: { value: number[] };
  change: { value: number[] };
  set: { value: number[] };
  // eslint-disable-next-line @typescript-eslint/ban-types
  end: {};
  // eslint-disable-next-line @typescript-eslint/ban-types
  render: {};
};

class Slider extends BEMComponent<SliderElement, SliderCustomEvents> {
  protected readonly _options: RangeSliderOptions;

  protected readonly _libSlider: IRangeSliderPresenter;

  constructor(sliderElement: SliderElement) {
    super(sliderElement);

    this._options = this._initOptionsFromHTML();

    this._libSlider = this._initLibSlider();

    this._bindLibSliderListeners();
  }

  getOptions() {
    return this._libSlider.view.getOptions();
  }
  setOptions(options?: RangeSliderOptions) {
    this._libSlider.view.setOptions(options);

    return this;
  }

  get() {
    return this._libSlider.view.get();
  }
  set(value: RangeSliderOptions['start']) {
    this._libSlider.view.set(value);

    return this;
  }

  protected _initOptionsFromHTML() {
    const options = JSON.parse(this.element.dataset.options as string) as SliderHTMLOptions;
    // eslint-disable-next-line no-eval
    options.formatter = window.eval(options.formatter);

    return (options as unknown) as RangeSliderOptions;
  }

  protected _initLibSlider() {
    return new window.RangeSliderPresenter(this.element, this._options);
  }

  protected _bindLibSliderListeners() {
    this._libSlider.view.on('start', this._libSliderEventListenerObject.handleLibSliderStart);
    this._libSlider.view.on('slide', this._libSliderEventListenerObject.handleLibSliderSlide);
    this._libSlider.view.on('update', this._libSliderEventListenerObject.handleLibSliderUpdate);
    this._libSlider.view.on('change', this._libSliderEventListenerObject.handleLibSliderChange);
    this._libSlider.view.on('set', this._libSliderEventListenerObject.handleLibSliderSet);
    this._libSlider.view.on('end', this._libSliderEventListenerObject.handleLibSliderEnd);
    this._libSlider.view.on('render', this._libSliderEventListenerObject.handleLibSliderRender);

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
        new CustomEvent('update', { bubbles: true, detail: { value: this._libSlider.view.get() } })
      );
    },
    handleLibSliderChange: () => {
      this.element.dispatchEvent(
        new CustomEvent('change', { bubbles: true, detail: { value: this._libSlider.view.get() } })
      );
    },
    handleLibSliderSet: () => {
      this.element.dispatchEvent(
        new CustomEvent('set', { bubbles: true, detail: { value: this._libSlider.view.get() } })
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
  document.querySelectorAll<SliderElement>('.js-slider'),
  (sliderElement) => new Slider(sliderElement)
);

export type { SliderCustomEvents, Slider, SliderElementWithComponent, RangeSliderOptions };

export { sliders as default };

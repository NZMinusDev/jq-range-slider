import BEMComponent, {
  HTMLElementWithComponent,
} from '@shared/utils/scripts/view/BEM/BEMComponent';
import { FixedRangeSliderOptions } from '@plugin/view/IRangeSliderView';

import sliderConfigElements, {
  SliderConfigElement,
} from './slider-config-elements';

type SliderConfigDOM = {
  configItems: {
    orientation: HTMLFieldSetElement;
    min: HTMLInputElement;
    max: HTMLInputElement;
    padLeft: HTMLInputElement;
    padRight: HTMLInputElement;
    start: HTMLInputElement;
    steps: HTMLInputElement;
    connect: HTMLInputElement;
    intervals: HTMLInputElement;
    tooltips: HTMLInputElement;
    mode: HTMLFieldSetElement;
    pipsDensity: HTMLInputElement;
    pipsValues: HTMLInputElement;
    pipsIsHidden: HTMLInputElement;
  };
  reset: HTMLButtonElement;
};

type SliderConfigCustomEvents = {
  change: { name: keyof SliderConfigDOM['configItems']; value: string };
  customReset: {};
};

class SliderConfig extends BEMComponent<
  SliderConfigElement,
  SliderConfigCustomEvents
> {
  protected readonly _DOM: Readonly<SliderConfigDOM>;

  constructor(sliderConfigElement: SliderConfigElement) {
    super(sliderConfigElement);

    this._DOM = this._initDOM();

    this._bindConfigItemsListeners()._bindResetListeners();
  }

  set(options: FixedRangeSliderOptions) {
    const { configItems } = this._DOM;

    (
      configItems.orientation.elements.namedItem(
        `${configItems.orientation.id}-${options.orientation}`
      ) as HTMLInputElement
    ).checked = true;
    configItems.min.value = options.intervals.min.toString();
    configItems.max.value = options.intervals.max.toString();
    [configItems.padLeft.value, configItems.padRight.value] =
      options.padding.map((pad) => pad.toString());
    configItems.start.value = `[${options.start}]`;
    configItems.steps.value = `[${options.steps}]`;
    configItems.connect.value = `[${options.connect}]`;
    configItems.intervals.value = JSON.stringify(options.intervals);
    configItems.tooltips.value = `[${options.tooltips}]`;
    (
      configItems.mode.elements.namedItem(
        `${configItems.mode.id}-${options.pips.mode}`
      ) as HTMLInputElement
    ).checked = true;
    configItems.pipsDensity.value = options.pips.density.toString();
    configItems.pipsValues.value =
      options.pips.mode === 'count'
        ? `${options.pips.values}`
        : `[${options.pips.values}]`;
    configItems.pipsIsHidden.checked = options.pips.isHidden;

    return this;
  }

  protected _initDOM() {
    const orientation = this.element.elements.namedItem(
      'orientation'
    ) as unknown as SliderConfigDOM['configItems']['orientation'];
    const min = this.element.elements.namedItem(
      'min'
    ) as SliderConfigDOM['configItems']['min'];
    const max = this.element.elements.namedItem(
      'max'
    ) as SliderConfigDOM['configItems']['max'];
    const padLeft = this.element.elements.namedItem(
      'pad-left'
    ) as SliderConfigDOM['configItems']['padLeft'];
    const padRight = this.element.elements.namedItem(
      'pad-right'
    ) as SliderConfigDOM['configItems']['padRight'];
    const start = this.element.elements.namedItem(
      'start'
    ) as SliderConfigDOM['configItems']['start'];
    const steps = this.element.elements.namedItem(
      'steps'
    ) as SliderConfigDOM['configItems']['steps'];
    const connect = this.element.elements.namedItem(
      'connect'
    ) as SliderConfigDOM['configItems']['connect'];
    const intervals = this.element.elements.namedItem(
      'intervals'
    ) as SliderConfigDOM['configItems']['intervals'];
    const tooltips = this.element.elements.namedItem(
      'tooltips'
    ) as SliderConfigDOM['configItems']['tooltips'];
    const mode = this.element.elements.namedItem(
      'mode'
    ) as unknown as SliderConfigDOM['configItems']['mode'];
    const pipsDensity = this.element.elements.namedItem(
      'pips-density'
    ) as SliderConfigDOM['configItems']['pipsDensity'];
    const pipsValues = this.element.elements.namedItem(
      'pips-values'
    ) as SliderConfigDOM['configItems']['pipsValues'];
    const pipsIsHidden = this.element.elements.namedItem(
      'pips-is-hidden'
    ) as SliderConfigDOM['configItems']['pipsIsHidden'];
    const reset = this.element.elements.namedItem(
      'reset'
    ) as SliderConfigDOM['reset'];

    return {
      configItems: {
        orientation,
        min,
        max,
        padLeft,
        padRight,
        start,
        steps,
        connect,
        intervals,
        tooltips,
        mode,
        pipsDensity,
        pipsValues,
        pipsIsHidden,
      },
      reset,
    };
  }

  protected _bindConfigItemsListeners() {
    Object.values(this._DOM.configItems).forEach((configItem) => {
      configItem.addEventListener(
        'change',
        this._configItemsEventListenerObject.handleConfigItemChange
      );
    });

    return this;
  }

  protected _configItemsEventListenerObject = {
    handleConfigItemChange: (event: Event) => {
      event.stopPropagation();

      const input = event.target as HTMLInputElement;
      const { name, value, checked } = input;
      const changedValue = input.type === 'checkbox' ? `${checked}` : value;

      this.element.dispatchEvent(
        new CustomEvent('change', {
          bubbles: true,
          detail: { name, value: changedValue },
        })
      );
    },
  };

  protected _bindResetListeners() {
    this._DOM.reset.addEventListener(
      'click',
      this._resetEventListenerObject.handleResetClick
    );

    return this;
  }

  protected _resetEventListenerObject = {
    handleResetClick: (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      this.element.dispatchEvent(
        new CustomEvent('customReset', { bubbles: true })
      );
    },
  };
}

type SliderConfigElementWithComponent = HTMLElementWithComponent<
  SliderConfigElement,
  SliderConfigCustomEvents,
  SliderConfig
>;

const sliderConfigs = Array.from(
  sliderConfigElements,
  (sliderConfigElement) => new SliderConfig(sliderConfigElement)
);

export type {
  SliderConfigCustomEvents,
  SliderConfig,
  SliderConfigElementWithComponent,
};

export { sliderConfigs as default };

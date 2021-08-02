import camelCase from 'lodash-es/camelCase';

import {
  BEMComponent,
  HTMLElementWithComponent,
} from '@utils/devTools/scripts/ComponentCreationHelper';
import type {
  EventsLoggerCustomEvents,
  EventsLoggerElementWithComponent,
} from '@views/common-level/containers/events-logger/events-logger';
import '@views/common-level/containers/events-logger/events-logger';
import type { FormFieldElementWithComponent } from '@views/common-level/primitives/form-field/form-field';
import '@views/common-level/primitives/form-field/form-field';
import type {
  SliderConfigCustomEvents,
  SliderConfigElementWithComponent,
} from '@views/common-level/containers/slider-config/slider-config';
import '@views/common-level/containers/slider-config/slider-config';

import type {
  ConfigurableSliderDemoSliderCustomEvents,
  ConfigurableSliderDemoSliderElementWithComponent,
  RangeSliderOptions,
} from './__slider/configurable-slider-demo__slider';
import './__slider/configurable-slider-demo__slider';
import type {
  ConfigurableSliderDemoSubmitCustomEvents,
  ConfigurableSliderDemoSubmitElementWithComponent,
} from './__submit/configurable-slider-demo__submit';
import './__submit/configurable-slider-demo__submit';
import configurableSliderDemoHTMLElements, {
  ConfigurableSliderDemoElement,
} from './configurable-slider-demo-elements';

type ConfigurableSliderDemoDOM = {
  slider: ConfigurableSliderDemoSliderElementWithComponent;
  eventsLogger: EventsLoggerElementWithComponent;
  submit: ConfigurableSliderDemoSubmitElementWithComponent;
  serverResponse: FormFieldElementWithComponent;
  sliderConfig: SliderConfigElementWithComponent;
};

type ConfigurableSliderDemoCustomEvents = ConfigurableSliderDemoSliderCustomEvents &
  EventsLoggerCustomEvents &
  ConfigurableSliderDemoSubmitCustomEvents &
  SliderConfigCustomEvents;

class ConfigurableSliderDemo extends BEMComponent<
  ConfigurableSliderDemoElement,
  ConfigurableSliderDemoCustomEvents
> {
  protected readonly _DOM: Readonly<ConfigurableSliderDemoDOM>;

  constructor(configurableSliderDemoElement: ConfigurableSliderDemoElement) {
    super(configurableSliderDemoElement);

    this._DOM = this._initDOM();

    this._bindSliderListeners()._bindSubmitListeners()._bindSliderConfigListeners();

    this._initDisplay();
  }

  getSlider() {
    return this._DOM.slider.component;
  }
  addServerResponse(value: string) {
    const currentValue = this._DOM.serverResponse.component.get();
    this._DOM.serverResponse.component.set(`${currentValue}${value}\n`);

    return this;
  }

  protected _initDOM() {
    const slider = this.element.querySelector(
      '.js-configurable-slider-demo__slider'
    ) as ConfigurableSliderDemoDOM['slider'];
    const eventsLogger = this.element.querySelector(
      '.js-events-logger'
    ) as ConfigurableSliderDemoDOM['eventsLogger'];
    const submit = this.element.querySelector(
      '.js-configurable-slider-demo__submit'
    ) as ConfigurableSliderDemoDOM['submit'];
    const serverResponse = this.element.querySelector(
      '.js-configurable-slider-demo__server-response'
    )?.firstElementChild as ConfigurableSliderDemoDOM['serverResponse'];
    const sliderConfig = this.element.querySelector(
      '.js-slider-config'
    ) as ConfigurableSliderDemoDOM['sliderConfig'];

    return { slider, eventsLogger, submit, serverResponse, sliderConfig };
  }

  protected _bindSliderListeners() {
    this._DOM.slider.component.addCustomEventListener(
      'start',
      this._sliderEventListenerObject.handleSliderStart
    );
    this._DOM.slider.component.addCustomEventListener(
      'slide',
      this._sliderEventListenerObject.handleSliderSlide
    );
    this._DOM.slider.component.addCustomEventListener(
      'update',
      this._sliderEventListenerObject.handleSliderUpdate
    );
    this._DOM.slider.component.addCustomEventListener(
      'change',
      this._sliderEventListenerObject.handleSliderChange
    );
    this._DOM.slider.component.addCustomEventListener(
      'set',
      this._sliderEventListenerObject.handleSliderSet
    );
    this._DOM.slider.component.addCustomEventListener(
      'set',
      this._sliderEventListenerObject.handleSliderSet
    );
    this._DOM.slider.component.addCustomEventListener(
      'end',
      this._sliderEventListenerObject.handleSliderEnd
    );
    this._DOM.slider.component.addCustomEventListener(
      'render',
      this._sliderEventListenerObject.handleSliderRender
    );

    return this;
  }
  protected _sliderEventListenerObject = {
    handleSliderStart: () => {
      this._DOM.eventsLogger.component.blinkFirefly(0);
    },
    handleSliderSlide: () => {
      this._DOM.eventsLogger.component.blinkFirefly(1);
    },
    handleSliderUpdate: () => {
      this._DOM.eventsLogger.component.blinkFirefly(2);
    },
    handleSliderChange: () => {
      this._DOM.eventsLogger.component.blinkFirefly(3);
    },
    handleSliderSet: () => {
      this._DOM.eventsLogger.component.blinkFirefly(4);
      this._displaySubmit();
    },
    handleSliderEnd: () => {
      this._DOM.eventsLogger.component.blinkFirefly(5);
    },
    handleSliderRender: () => {
      this._DOM.eventsLogger.component.blinkFirefly(6);
    },
  };

  protected _bindSubmitListeners() {
    this._DOM.submit.component.addCustomEventListener(
      'customSubmit',
      this._submitEventListenerObject.handleSubmitCustomSubmit
    );
    this._DOM.submit.component.addCustomEventListener(
      'customReset',
      this._submitEventListenerObject.handleSubmitCustomReset
    );

    return this;
  }
  protected _submitEventListenerObject = {
    handleSubmitCustomSubmit: (
      event: CustomEvent<ConfigurableSliderDemoSubmitCustomEvents['customSubmit']>
    ) => {
      const slider = this._DOM.slider.component;

      slider.set(JSON.parse(event.detail.value));
    },
    handleSubmitCustomReset: (
      event: CustomEvent<ConfigurableSliderDemoSubmitCustomEvents['customReset']>
    ) => {
      const slider = this._DOM.slider.component;

      slider.set();
    },
  };

  protected _bindSliderConfigListeners() {
    const sliderConfig = this._DOM.sliderConfig.component;

    sliderConfig.addCustomEventListener(
      'change',
      this._sliderConfigEventListenerObject.handleSliderConfigChange
    );
    sliderConfig.addCustomEventListener(
      'customReset',
      this._sliderConfigEventListenerObject.handleSliderConfigCustomReset
    );

    return this;
  }
  protected _sliderConfigEventListenerObject = {
    handleSliderConfigChange: (event: CustomEvent<SliderConfigCustomEvents['change']>) => {
      const sliderContainer = this._DOM.slider;
      const slider = this._DOM.slider.component;
      const { name, value } = event.detail;
      const camelCaseName = camelCase(name);

      switch (camelCaseName) {
        case 'orientation': {
          sliderContainer.style.height = value === 'vertical' ? '300px' : '';

          const newOptions = { [name]: value as RangeSliderOptions['orientation'] };

          slider.setOptions(newOptions);

          break;
        }
        case 'min': {
          const { intervals } = slider.getOptions();
          intervals.min = Number(value);

          slider.setOptions({ intervals });

          break;
        }
        case 'max': {
          const { intervals } = slider.getOptions();
          intervals.max = Number(value);

          slider.setOptions({ intervals });

          break;
        }
        case 'padLeft': {
          const { padding } = slider.getOptions();
          padding[0] = Number(value);

          slider.setOptions({ padding });

          break;
        }
        case 'padRight': {
          const { padding } = slider.getOptions();
          padding[1] = Number(value);

          slider.setOptions({ padding });

          break;
        }
        case 'start':
        case 'steps':
        case 'connect':
        case 'tooltips': {
          slider.setOptions({ [name]: JSON.parse(value) });

          break;
        }
        case 'intervals': {
          const { intervals } = slider.getOptions();
          Object.entries(JSON.parse(value)).forEach(([key, val]) => {
            intervals[key] = val as number;
          });

          slider.setOptions({ [name]: intervals });

          break;
        }
        case 'mode': {
          const newOptions = {
            pips: { [name]: value } as RangeSliderOptions['pips'],
          };

          slider.setOptions(newOptions);

          break;
        }
        case 'pipsDensity': {
          const newOptions = {
            pips: { density: JSON.parse(value) } as RangeSliderOptions['pips'],
          };

          slider.setOptions(newOptions);

          break;
        }
        case 'pipsValues': {
          const newOptions = {
            pips: { values: JSON.parse(value) } as RangeSliderOptions['pips'],
          };

          slider.setOptions(newOptions);

          break;
        }
        case 'pipsIsHidden': {
          const newOptions = {
            pips: { isHidden: JSON.parse(value) },
          };

          slider.setOptions(newOptions);

          break;
        }

        // no default
      }

      this._displaySliderConfig();
    },
    handleSliderConfigCustomReset: (
      event: CustomEvent<SliderConfigCustomEvents['customReset']>
    ) => {
      this._DOM.slider.component.setOptions();
      this._DOM.slider.style.height = '';

      this._displaySliderConfig();
    },
  };

  protected _initDisplay() {
    this._initSliderConfigDisplay()._initSubmitDisplay();

    return this;
  }
  protected _initSubmitDisplay() {
    this._displaySubmit();

    return this;
  }
  protected _initSliderConfigDisplay() {
    this._displaySliderConfig();

    return this;
  }

  protected _displaySubmit() {
    const slider = this._DOM.slider.component;
    const submit = this._DOM.submit.component;

    submit.set(`[${slider.get()}]`);

    return this;
  }
  protected _displaySliderConfig() {
    const slider = this._DOM.slider.component;
    const sliderConfig = this._DOM.sliderConfig.component;

    sliderConfig.set(slider.getOptions());

    return this;
  }
}

type ConfigurableSliderDemoElementWithComponent = HTMLElementWithComponent<
  ConfigurableSliderDemoElement,
  ConfigurableSliderDemoCustomEvents,
  ConfigurableSliderDemo
>;

const configurableSliderDemos = Array.from(
  configurableSliderDemoHTMLElements,
  (configurableSliderDemoElement) => new ConfigurableSliderDemo(configurableSliderDemoElement)
);

export type {
  ConfigurableSliderDemoCustomEvents,
  ConfigurableSliderDemo,
  ConfigurableSliderDemoElementWithComponent,
};

export { configurableSliderDemos as default };

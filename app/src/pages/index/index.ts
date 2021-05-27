import '@common.blocks/primitives/range-slider/range-slider-plugin';
import '@common.blocks/primitives/range-slider/jq-range-slider-plugin';
import { RangeSliderOptions } from '@common.blocks/primitives/range-slider/view/range-slider.view.coupling';

import './index.pug';
import './index.scss';

const RANGE_SLIDER_OPTIONS: RangeSliderOptions = {};

const $sliderContainers = $('.demo__slider');

// Demonstration of the independence of the sliders, but you can initialize it with other options for each container manually or reset options later.
const sliders = $sliderContainers.initRangeSlider(RANGE_SLIDER_OPTIONS);

const [
  redColorSlider,
  greenColorSlider,
  blueColorSlider,
  datesSlider,
  configurableSlider,
] = sliders;

/* Colorpicker */
const colorResultElem = document.getElementById('color-result') as HTMLDivElement;
const colors = [0, 0, 0];
[redColorSlider, greenColorSlider, blueColorSlider].forEach((slider, index) => {
  const colorPickerUpdateHandler = () => {
    [colors[index]] = slider.view.get();

    const color = `rgb(${colors.join(',')})`;

    colorResultElem.style.backgroundColor = color;
    colorResultElem.style.color = color;
  };

  slider.view
    .setOptions({
      orientation: 'vertical',
      intervals: { min: 0, max: 255 },
      connect: [true, false],
      tooltips: false,
      pips: { isHidden: true },
    })
    .on('update', colorPickerUpdateHandler)
    .set(127);
});

/* Dates */
const WEEK_TIME = 7 * 24 * 60 * 60 * 1000;
const timestamp = (str) => new Date(str).getTime();

const datesForm = document.forms.namedItem('dates') as HTMLFormElement;
const datesLowerResultElem = datesForm.elements.namedItem('dates-lower-result') as HTMLInputElement;
const datesGreaterResultElem = datesForm.elements.namedItem(
  'dates-greater-result'
) as HTMLInputElement;
const currentYear = new Date().getUTCFullYear();
const datesUpdateHandler = () => {
  const [lowerValue, greaterValue] = datesSlider.view.get();

  datesLowerResultElem.value = new Date(lowerValue).toString();
  datesGreaterResultElem.value = new Date(greaterValue).toString();
};

datesSlider.view
  .setOptions({
    intervals: {
      min: timestamp(`${currentYear - 1}`),
      max: timestamp(`${currentYear + 1}`),
    },
    steps: WEEK_TIME,
    start: [timestamp(`${currentYear - 0.5}`), timestamp(`${currentYear + 0.5}`)],
    formatter: (number) => new Date(number).toString(),
    tooltips: false,
    pips: {
      mode: 'count',
      values: 4,
    },
  })
  .set([timestamp(`${currentYear - 0.5}`), timestamp(`${currentYear + 0.5}`)])
  .on('update', datesUpdateHandler);
const [lowerValue, greaterValue] = datesSlider.view.get();
datesLowerResultElem.value = new Date(lowerValue).toString();
datesGreaterResultElem.value = new Date(greaterValue).toString();

/* Playground */
const IS_ACTIVE_FIREFLY_SELECTOR = 'logger__firefly_isActive';
const FIREFLY_ANIMATION_DURATION = 250;
const logger = document.getElementById('logger') as HTMLDivElement;
const fireflyElements = logger.querySelectorAll<HTMLDivElement>('.js-logger__firefly');
const [
  startFirefly,
  slideFirefly,
  updateFirefly,
  changeFirefly,
  setFirefly,
  endFirefly,
  renderFirefly,
] = fireflyElements;
const makeFireflyAnimationHandler = (fireflyElement: HTMLDivElement) => {
  const handlers = {
    start: () => {
      fireflyElement.classList.add(IS_ACTIVE_FIREFLY_SELECTOR);
      setTimeout(handlers.end, FIREFLY_ANIMATION_DURATION);
    },
    end: () => {
      fireflyElement.classList.remove(IS_ACTIVE_FIREFLY_SELECTOR);
    },
  };

  return handlers.start;
};

const setForm = document.forms.namedItem('submit') as HTMLFormElement;
const setFormElements = {
  textField: setForm.elements.namedItem('setter') as HTMLInputElement,
  submitBtn: setForm.elements.namedItem('set') as HTMLInputElement,
  resetBtn: setForm.elements.namedItem('reset') as HTMLInputElement,
};
const setFormOnSetSliderHandler = () => {
  setFormElements.textField.value = `[${configurableSlider.view.get()}]`;
};

const configForm = document.forms.namedItem('config') as HTMLFormElement;
const UPDATE_SLIDER_OPTION_ON_CHANGE_KEY = 'updateSliderOptionOnChange';
const configElements = {
  orientationHorizontal: {
    element: (configForm.elements.namedItem('orientation') as RadioNodeList).item(
      0
    ) as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      $sliderContainers.get(4).style.height = '';
      configurableSlider.view.setOrientationOption('horizontal');
    }),
  },
  orientationVertical: {
    element: (configForm.elements.namedItem('orientation') as RadioNodeList).item(
      1
    ) as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      $sliderContainers.get(4).style.height = '300px';
      configurableSlider.view.setOrientationOption('vertical');
    }),
  },
  min: {
    element: configForm.elements.namedItem('min') as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      const intervals = configurableSlider.view.getIntervalsOption();
      intervals.min = Number.parseFloat(e.target.value);
      configurableSlider.view.setIntervalsOption(intervals);
    }),
  },
  max: {
    element: configForm.elements.namedItem('max') as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      const intervals = configurableSlider.view.getIntervalsOption();
      intervals.max = Number.parseFloat(e.target.value);
      configurableSlider.view.setIntervalsOption(intervals);
    }),
  },
  padLeft: {
    element: configForm.elements.namedItem('pad-left') as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      const padding = configurableSlider.view.getPaddingOption();
      padding[0] = Number.parseFloat(e.target.value);
      configurableSlider.view.setPaddingOption(padding);
    }),
  },
  padRight: {
    element: configForm.elements.namedItem('pad-right') as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      const padding = configurableSlider.view.getPaddingOption();
      padding[1] = Number.parseFloat(e.target.value);
      configurableSlider.view.setPaddingOption(padding);
    }),
  },
  start: {
    element: configForm.elements.namedItem('start') as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      configurableSlider.view.setStartOption(JSON.parse(e.target.value));
    }),
  },
  steps: {
    element: configForm.elements.namedItem('steps') as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      configurableSlider.view.setStepsOption(JSON.parse(e.target.value));
    }),
  },
  connect: {
    element: configForm.elements.namedItem('connect') as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      configurableSlider.view.setConnectOption(JSON.parse(e.target.value));
    }),
  },
  intervals: {
    element: configForm.elements.namedItem('intervals') as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      const intervals = configurableSlider.view.getIntervalsOption();
      Object.entries(JSON.parse(e.target.value)).forEach(([key, val]) => {
        intervals[key] = val as number;
      });
      configurableSlider.view.setIntervalsOption(intervals);
    }),
  },
  tooltips: {
    element: configForm.elements.namedItem('tooltips') as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      configurableSlider.view.setTooltipsOption(JSON.parse(e.target.value));
    }),
  },
  modeIntervals: {
    element: (configForm.elements.namedItem('mode') as RadioNodeList).item(0) as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      configurableSlider.view.setPipsOption({ mode: 'intervals' });
    }),
  },
  modeCount: {
    element: (configForm.elements.namedItem('mode') as RadioNodeList).item(1) as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      configurableSlider.view.setPipsOption({ mode: 'count' });
    }),
  },
  modePositions: {
    element: (configForm.elements.namedItem('mode') as RadioNodeList).item(2) as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      configurableSlider.view.setPipsOption({ mode: 'positions' });
    }),
  },
  modeValues: {
    element: (configForm.elements.namedItem('mode') as RadioNodeList).item(3) as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      configurableSlider.view.setPipsOption({ mode: 'values' });
    }),
  },
  pipsDensity: {
    element: configForm.elements.namedItem('pips-density') as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      configurableSlider.view.setPipsOption({ density: e.target.value });
    }),
  },
  pipsValues: {
    element: configForm.elements.namedItem('pips-values') as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      configurableSlider.view.setPipsOption({ values: JSON.parse(e.target.value) });
    }),
  },
  pipsIsHidden: {
    element: configForm.elements.namedItem('pips-isHidden') as HTMLInputElement,
    handlers: new Map().set(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY, (e) => {
      configurableSlider.view.setPipsOption({ isHidden: e.target.checked });
    }),
  },
  reset: {
    element: configForm.elements.namedItem('reset') as HTMLInputElement,
    handlers: new Map().set('click', (e) => {
      configurableSlider.view.setOptions();
      $sliderContainers.get(4).style.height = '';

      // eslint-disable-next-line no-use-before-define
      showConfig();
    }),
  },
};
const showConfig = () => {
  configElements.orientationHorizontal.element.checked =
    configurableSlider.view.getOrientationOption() === 'horizontal';
  configElements.orientationVertical.element.checked =
    configurableSlider.view.getOrientationOption() === 'vertical';
  configElements.min.element.value = configurableSlider.view.getIntervalsOption().min.toString();
  configElements.max.element.value = configurableSlider.view.getIntervalsOption().max.toString();
  const [leftPad, rightPad] = configurableSlider.view.getPaddingOption();
  configElements.padLeft.element.value = leftPad.toString();
  configElements.padRight.element.value = rightPad.toString();
  configElements.start.element.value = `[${configurableSlider.view.getStartOption()}]`;
  configElements.steps.element.value = `[${configurableSlider.view.getStepsOption()}]`;
  configElements.connect.element.value = `[${configurableSlider.view.getConnectOption()}]`;
  const intervals = configurableSlider.view.getIntervalsOption();
  configElements.intervals.element.value = JSON.stringify(intervals);
  configElements.tooltips.element.value = `[${configurableSlider.view.getTooltipsOption()}]`;
  configElements.modeIntervals.element.checked =
    configurableSlider.view.getPipsOption().mode === 'intervals';
  configElements.modeCount.element.checked =
    configurableSlider.view.getPipsOption().mode === 'count';
  configElements.modePositions.element.checked =
    configurableSlider.view.getPipsOption().mode === 'positions';
  configElements.modeValues.element.checked =
    configurableSlider.view.getPipsOption().mode === 'values';
  configElements.pipsDensity.element.value = configurableSlider.view
    .getPipsOption()
    .density.toString();
  configElements.pipsValues.element.value =
    configurableSlider.view.getPipsOption().mode === 'count'
      ? `${configurableSlider.view.getPipsOption().values}`
      : `[${configurableSlider.view.getPipsOption().values}]`;
  configElements.pipsIsHidden.element.checked = configurableSlider.view.getPipsOption().isHidden;
};

// events
configurableSlider.view.on('start', makeFireflyAnimationHandler(startFirefly));
configurableSlider.view.on('slide', makeFireflyAnimationHandler(slideFirefly));
configurableSlider.view.on('update', makeFireflyAnimationHandler(updateFirefly));
configurableSlider.view.on('change', makeFireflyAnimationHandler(changeFirefly));
configurableSlider.view
  .on('set', makeFireflyAnimationHandler(setFirefly))
  .on('set', setFormOnSetSliderHandler);
configurableSlider.view.on('end', makeFireflyAnimationHandler(endFirefly));
configurableSlider.view.on('render', makeFireflyAnimationHandler(renderFirefly));

// buttons
const submitOnClickHandler = (event: Event) => {
  event.preventDefault();

  configurableSlider.view.set(JSON.parse(setFormElements.textField.value));
};

const resetOnClickHandler = (event: Event) => {
  event.preventDefault();

  configurableSlider.view.set();
};

setForm.addEventListener('submit', submitOnClickHandler);
setForm.addEventListener('reset', resetOnClickHandler);

// Tip: set options (it doesn't run render. If you need rerender use setOptions(options) method instead)
Object.values(configElements).forEach((configElement) => {
  configElement.element.addEventListener(
    'change',
    configElement.handlers.get(UPDATE_SLIDER_OPTION_ON_CHANGE_KEY)
  );
});

// reset
configElements.reset.element.addEventListener('click', configElements.reset.handlers.get('click'));

// run render
const runRender = () => {
  configurableSlider.view.setOptions({});
  showConfig();
};

Object.values(configElements).forEach((configElem) => {
  configElem.element.addEventListener('change', runRender);
});

// init config
showConfig();

setFormOnSetSliderHandler();

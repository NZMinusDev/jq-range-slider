type ConfigurableSliderDemoElement = HTMLDivElement;

const configurableSliderDemoHTMLElements =
  document.querySelectorAll<ConfigurableSliderDemoElement>(
    '.js-configurable-slider-demo'
  );

export {
  configurableSliderDemoHTMLElements as default,
  ConfigurableSliderDemoElement,
};

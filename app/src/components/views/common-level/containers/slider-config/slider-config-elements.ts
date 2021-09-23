type SliderConfigElement = HTMLFieldSetElement;

const sliderConfigElements =
  document.querySelectorAll<SliderConfigElement>('.js-slider-config');

export { sliderConfigElements as default, SliderConfigElement };

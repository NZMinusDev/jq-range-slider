type SliderDatepickerElement = HTMLDivElement;

const sliderDatepickerElements = document.querySelectorAll<SliderDatepickerElement>(
  '.js-slider-datepicker'
);

export { sliderDatepickerElements as default, SliderDatepickerElement };

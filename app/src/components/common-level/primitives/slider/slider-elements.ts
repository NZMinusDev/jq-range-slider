import RangeSliderPlugin from '@plugin/RangeSliderPlugin';

type SliderElement = HTMLDivElement & { plugin: RangeSliderPlugin };

const sliderElements = document.querySelectorAll<SliderElement>('.js-slider');

export { sliderElements as default, SliderElement };

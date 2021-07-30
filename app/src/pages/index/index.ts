import sliderMainModel from '@models/primitives/slider/mainModel';
import sliders from '@views/common-level/primitives/slider/slider';
import SliderPresenter from '@presenters/primitives/slider/Presenter';
import './index.pug';
import './index.scss';

// eslint-disable-next-line prefer-destructuring
const configurableSlider = sliders[4];
const configurableSliderPresenter = new SliderPresenter(configurableSlider, sliderMainModel);

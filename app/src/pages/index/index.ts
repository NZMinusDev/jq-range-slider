import configurableSliderDemoMainModel from '@models/containers/configurable-slider-demo/mainModel';
import configurableSliderDemos from '@views/common-level/containers/configurable-slider-demo/configurable-slider-demo';
import ConfigurableSliderDemoPresenter from '@presenters/containers/configurable-slider-demo/Presenter';

import './index.pug';
import './index.scss';

const configurableSliderDemoErrorCatcher = () => {};

const [configurableSliderDemo] = configurableSliderDemos;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const configurableSliderDemoPresenter = new ConfigurableSliderDemoPresenter(
  configurableSliderDemo,
  configurableSliderDemoErrorCatcher,
  configurableSliderDemoMainModel
);

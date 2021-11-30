import './component/configurable-slider-demo.scss';
import {
  configurableSliderDemoHTMLElements,
  ConfigurableSliderDemo,
} from './component';
import { ConfigurableSliderDemoMainModel } from './models';

const configurableSliderDemos = Array.from(
  configurableSliderDemoHTMLElements,
  (configurableSliderDemoElement) =>
    new ConfigurableSliderDemo(
      configurableSliderDemoElement,
      new ConfigurableSliderDemoMainModel()
    )
);

export { configurableSliderDemos };

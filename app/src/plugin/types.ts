import {
  RangeSliderPresentationModelOptions,
  RangeSliderPresentationModelNormalizedOptions,
  IRangeSliderFacadeModel,
} from './models/types';

type RangeSliderPluginOptions = RangeSliderPresentationModelOptions;

type RangeSliderPluginNormalizedOptions =
  RangeSliderPresentationModelNormalizedOptions;

interface IRangeSliderPluginFacadeModel extends IRangeSliderFacadeModel {}

export {
  RangeSliderPluginOptions,
  RangeSliderPluginNormalizedOptions,
  IRangeSliderPluginFacadeModel,
};

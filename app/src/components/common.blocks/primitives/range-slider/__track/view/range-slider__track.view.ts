import template from "./range-slider__track.view.pug";
import "./range-slider__track.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderTrackView extends MVPView<TrackOptions> {
  getOrientationOption(): TrackOptions["orientation"];
  getPaddingOption(): TrackOptions["padding"];
  getStepOption(): TrackOptions["step"];
  getAnimateOption(): TrackOptions["animate"];
  setOrientationOption(orientation?: TrackOptions["orientation"]): this;
  setPaddingOption(padding?: TrackOptions["padding"]): this;
  setStepOption(step?: TrackOptions["step"]): this;
  setAnimateOption(animate?: TrackOptions["animate"]): this;
}

export default class RangeSliderTrackView {}

export type TrackOptions = {
  orientation: "horizontal" | "vertical";
  padding: number | [number, number];
  step: number;
  animate: (timeFraction: number) => number;
};

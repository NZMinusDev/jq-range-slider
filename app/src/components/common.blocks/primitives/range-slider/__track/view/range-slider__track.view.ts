import template from "./range-slider__track.view.pug";
import "./range-slider__track.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderTrackView extends MVPView<TrackOptions> {
  getOrientationOption(): TrackOptions["orientation"];
  getPaddingOption(): TrackOptions["padding"];
  getRangeOption(): TrackOptions["range"];
  getStepOption(): TrackOptions["step"];
  getAnimateOption(): TrackOptions["animate"];
  setOrientationOption(orientation?: TrackOptions["orientation"]): this;
  setPaddingOption(padding?: TrackOptions["padding"]): this;
  setRangeOption(range?: TrackOptions["range"]): this;
  setStepOption(step?: TrackOptions["step"]): this;
  setAnimateOption(animate?: TrackOptions["animate"]): this;
}

export default class RangeSliderTrackView {
  constructor(
    private container: HTMLElement,
    private _options: TrackOptions = {
      orientation: "horizontal",
      padding: 0,
      range: { min: 0, max: 1000 },
      step: Infinity,
      animate: (timeFraction: number) => Math.pow(timeFraction, 2),
    }
  ) {}
}

export type TrackOptions = {
  orientation?: "horizontal" | "vertical";
  padding?: number | [number, number];
  range?: {
    min?: number;
    max?: number;
    [key: string]: number | undefined;
  };
  step?: number;
  animate?: (timeFraction: number) => number;
};

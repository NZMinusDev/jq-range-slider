import template from "./range-slider__thumb.view.pug";
import "./range-slider__thumb.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderThumbView extends MVPView<ThumbOptions> {
  getId(): Id;
  getStartOption(): ThumbOptions["start"];
  setStartOption(start?: ThumbOptions["start"]): this;
}

export default class RangeSliderThumbView {
  constructor(private container: HTMLElement, private _options: ThumbOptions = { start: 0 }) {}
}

export type ThumbOptions = { start?: number };

type Id = string;

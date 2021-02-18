import template from "./range-slider__thumb.view.pug";
import "./range-slider__thumb.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderThumbView extends MVPView<ThumbOptions> {
  getId(): Id;
  getValue(): number;
  setValue(value?: number): this;
}

export default class RangeSliderThumbView {}

export type ThumbOptions = {};

type Id = string;

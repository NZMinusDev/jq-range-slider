import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";

export default interface RangeSliderPipsView
  extends MVPView<Required<PipsOptions>, PipsOptions, PipsState> {
  getOrientationOption(): PipsOptions["orientation"];
  getIsHiddenOption(): PipsOptions["isHidden"];
  getValuesOption(): PipsOptions["values"];
  getDensityOption(): PipsOptions["density"];
  getFormatterOption(): PipsOptions["formatter"];
  setOrientationOption(orientation?: PipsOptions["orientation"]): this;
  setIsHiddenOption(isHidden?: PipsOptions["isHidden"]): this;
  setValuesOption(values?: PipsOptions["values"]): this;
  setDensityOption(density?: PipsOptions["density"]): this;
  setFormatterOption(formatter?: PipsOptions["formatter"]): this;
}

export type PipsOptions = {
  orientation?: "horizontal" | "vertical";
  isHidden?: boolean;
  values?: { percent: number; value: number }[];
  density?: number;
  formatter?: Formatter;
};

export type PipsState = {};

export type Formatter = (value: number) => string;
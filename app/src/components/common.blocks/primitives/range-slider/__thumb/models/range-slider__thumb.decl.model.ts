import { MVPModel } from "@utils/devTools/tools/PluginCreationHelper";

export interface RangeSliderThumbModel extends MVPModel<ThumbState> {
  getValue(): Promise<ThumbState["value"]>;
  setValue(value?: ThumbState["value"]): Promise<this>;
  whenValueIsChanged(callback: (value: ThumbState["value"]) => void): void;
}

export type ThumbState = { value: number };

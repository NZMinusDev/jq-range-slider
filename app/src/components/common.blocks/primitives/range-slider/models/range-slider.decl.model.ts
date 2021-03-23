import { MVPModel } from "@utils/devTools/tools/PluginCreationHelper";

import { ThumbState } from "../__thumb/models/range-slider__thumb.decl.model";

export interface RangeSliderModel extends MVPModel<RangeSliderState> {
  getThumbsValues(): Promise<RangeSliderState["thumbsValues"]>;
  setThumbsValues(thumbsValues?: Partial<RangeSliderState["thumbsValues"]>): Promise<this>;
  whenThumbsValuesIsChanged(
    callback: (thumbsValues: RangeSliderState["thumbsValues"]) => void
  ): void;
}

export type RangeSliderState = {
  thumbsValues: ThumbState["value"][];
};

import { RangeSliderModel, RangeSliderState } from "./range-slider.decl.model";

export default class RangeSliderMainModel implements RangeSliderModel {
  getState(): Promise<RangeSliderState> {
    throw new Error("Method not implemented.");
  }
  setState(state?: Partial<RangeSliderState>): Promise<this> {
    throw new Error("Method not implemented.");
  }
  whenStateIsChanged(callback: (state: RangeSliderState) => void): void {
    throw new Error("Method not implemented.");
  }

  getThumbsValues(): Promise<number[]> {
    throw new Error("Method not implemented.");
  }
  setThumbsValues(thumbsValues?: (number | undefined)[]): Promise<this> {
    throw new Error("Method not implemented.");
  }
  whenThumbsValuesIsChanged(callback: (thumbsValues: number[]) => void): void {
    throw new Error("Method not implemented.");
  }
}

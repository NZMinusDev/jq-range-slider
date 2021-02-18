import { RangeSliderThumbModel, ThumbState } from "./range-slider__thumb.decl.model";

export default class RangeSliderThumbMainModel implements RangeSliderThumbModel {
  getState(): Promise<ThumbState> {
    throw new Error("Method not implemented.");
  }
  setState(state?: Partial<ThumbState>): Promise<this> {
    throw new Error("Method not implemented.");
  }
  whenStateIsChanged(callback: (state: ThumbState) => void): void {
    throw new Error("Method not implemented.");
  }

  getValue(): Promise<number> {
    throw new Error("Method not implemented.");
  }
  setValue(value?: number): Promise<this> {
    throw new Error("Method not implemented.");
  }
  whenValueIsChanged(callback: (value: number) => void): void {
    throw new Error("Method not implemented.");
  }
}

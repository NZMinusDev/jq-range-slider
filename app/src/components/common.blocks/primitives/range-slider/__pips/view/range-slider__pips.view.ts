import "./range-slider__pips.scss";

import { MVPView } from "@utils/devTools/tools/PluginCreationHelper";
import { collapsingParseInt, collapsingParseFloat } from "@utils/devTools/tools/ParserHelper";
import { ascending } from "@utils/devTools/tools/ProcessingOfPrimitiveDataHelper";

export default interface RangeSliderPipsView {
  readonly dom: {
    self: HTMLElement;
    markers: HTMLCollectionOf<HTMLDivElement>;
    values: HTMLCollectionOf<HTMLDivElement>;
  };

  getIsHiddenOption(): PipsOptions["isHidden"];
  getValuesOption(): PipsOptions["values"];
  getDensityOption(): PipsOptions["density"];
  getFormatterOption(): PipsOptions["formatter"];
  setIsHiddenOption(isHidden?: PipsOptions["isHidden"]): this;
  setValuesOption(values?: PipsOptions["values"]): this;
  setDensityOption(density?: PipsOptions["density"]): this;
  setFormatterOption(formatter?: PipsOptions["formatter"]): this;
}

export type PipsOptions = {
  isHidden?: boolean;
  values?: number[];
  density?: number;
  formatter?: Formatter;
};

export const DEFAULT_OPTIONS: Required<PipsOptions> = {
  isHidden: false,
  values: [],
  density: 1,
  formatter: (value: number) => value.toFixed(2).toLocaleString(),
};

const VALUES_CALCULATION_PRECISION = 2;
const RENDER_CALCULATION_PRECISION = 4;
export default class RangeSliderPipsView
  extends MVPView<Required<PipsOptions>, PipsOptions>
  implements RangeSliderPipsView {
  constructor(container: HTMLElement, options: PipsOptions = DEFAULT_OPTIONS) {
    super(container, DEFAULT_OPTIONS, options, ["isHidden", "values", "density", "formatter"]);

    this._render();
  }

  getIsHiddenOption() {
    return this._options.isHidden;
  }
  getValuesOption() {
    return ([] as number[]).concat(this._options.values);
  }
  getDensityOption() {
    return this._options.density;
  }
  getFormatterOption() {
    return this._options.formatter;
  }

  setIsHiddenOption(isHidden: PipsOptions["isHidden"] = DEFAULT_OPTIONS.isHidden) {
    this._options.isHidden = isHidden;

    this._renderIsHiddenOption();

    return this;
  }
  setValuesOption(values: PipsOptions["values"] = DEFAULT_OPTIONS.values) {
    this._options.values = ([] as number[]).concat(values);
    this._fixValuesOption()._renderValuesOption();

    return this;
  }
  setDensityOption(density: PipsOptions["density"] = DEFAULT_OPTIONS.density) {
    this._options.density = density;
    this._fixDensityOption()._renderDensityOption();

    return this;
  }
  setFormatterOption(formatter: PipsOptions["formatter"] = DEFAULT_OPTIONS.formatter) {
    this._options.formatter = formatter;

    this._renderFormatterOption();

    return this;
  }

  protected _fixValuesOption() {
    this._options.values = this._options.values
      .map((value) => collapsingParseFloat(`${value}`, VALUES_CALCULATION_PRECISION))
      .sort(ascending);

    return this;
  }
  protected _fixDensityOption() {
    this._options.density =
      this._options.density < 0 ? DEFAULT_OPTIONS["density"] : this._options.density;
    this._options.density = collapsingParseInt(`${this._options.density}`);

    return this;
  }

  protected _renderIsHiddenOption() {
    this.dom.self.classList.add("range-slider__pips");

    if (this._options.isHidden) {
      this.dom.self.classList.add("range-slider__pips_isHidden");
    } else {
      this.dom.self.classList.remove("range-slider__pips_isHidden");
    }

    return this;
  }
  protected _renderValuesOption() {
    if (this.dom.values) {
      Array.from(this.dom.values).forEach((value) => {
        value.remove();
      });
    }

    const TEMPLATE = document.createElement("div");
    TEMPLATE.classList.add("range-slider__pips-value");
    const size = this._options.values[this._options.values.length - 1] - this._options.values[0];

    let elem: HTMLDivElement;
    let valuePosition = 0;
    let rangeShift = 0;
    this._options.values.forEach((value, index, values) => {
      elem = TEMPLATE.cloneNode() as HTMLDivElement;

      elem.style.left = `${(valuePosition += rangeShift)}%`;
      elem.dataset.value = `${value}`;

      this.dom.self.append(elem);

      rangeShift = +(((values[index + 1] - value) / size) * 100).toFixed(
        RENDER_CALCULATION_PRECISION
      );
    });

    this.dom.values = this.dom.self.getElementsByClassName(
      "range-slider__pips-value"
    ) as HTMLCollectionOf<HTMLDivElement>;

    return this;
  }
  protected _renderDensityOption() {
    if (this.dom.markers) {
      Array.from(this.dom.markers).forEach((marker) => {
        marker.remove();
      });
    }

    const TEMPLATE = document.createElement("div");
    TEMPLATE.classList.add("range-slider__pips-marker");
    const rangeBetweenMarkers = +(1 / this._options.density).toFixed(RENDER_CALCULATION_PRECISION);

    let elem: HTMLDivElement;
    let markerPosition = 0;
    let rangeBetweenValues = 0;
    let amountOfMarkers: number;
    Array.from(this.dom.values).forEach((value, index, values) => {
      if (values[index + 1]) {
        rangeBetweenValues =
          Number.parseFloat(values[index + 1].style.left) - Number.parseFloat(value.style.left);
        amountOfMarkers = Math.floor(rangeBetweenValues * this._options.density);
        for (let j = 0; j < amountOfMarkers; j++) {
          elem = TEMPLATE.cloneNode() as HTMLDivElement;

          elem.style.left = `${(markerPosition += rangeBetweenMarkers)}%`;

          this.dom.self.append(elem);
        }
      }
    });

    this.dom.markers = this.dom.self.getElementsByClassName(
      "range-slider__pips-marker"
    ) as HTMLCollectionOf<HTMLDivElement>;

    return this;
  }
  protected _renderFormatterOption() {
    Array.from(this.dom.values).forEach((value, index) => {
      if (this._options.values[index]) {
        value.dataset.formattedValue = this._options.formatter(this._options.values[index]);
      }
    });

    return this;
  }
}

type Formatter = (value: number) => string;

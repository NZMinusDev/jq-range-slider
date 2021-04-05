import "./range-slider__pips.scss";

import { html, TemplateResult } from "lit-html";
import { ClassInfo, classMap } from "lit-html/directives/class-map.js";
import { StyleInfo, styleMap } from "lit-html/directives/style-map.js";
import { spread } from "@open-wc/lit-helpers";

import { MVPView, template } from "@utils/devTools/tools/PluginCreationHelper";
import { collapsingParseInt, collapsingParseFloat } from "@utils/devTools/tools/ParserHelper";
import { ascending } from "@utils/devTools/tools/ProcessingOfPrimitiveDataHelper";

export default interface RangeSliderPipsView {
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
export type PipsState = {};

export const DEFAULT_OPTIONS: Required<PipsOptions> = {
  isHidden: false,
  values: [],
  density: 1,
  formatter: (value: number) => value.toFixed(2).toLocaleString(),
};
export const DEFAULT_STATE: PipsState = {};

const VALUES_CALCULATION_PRECISION = 2;
const RENDER_CALCULATION_PRECISION = 4;
export default class RangeSliderPipsView
  extends MVPView<Required<PipsOptions>, PipsOptions, PipsState>
  implements RangeSliderPipsView {
  readonly template:template = ({ classInfo={}, styleInfo={}, attributes={} }) =>
    html`<div
      class=${classMap(
        Object.assign(
          {},
          {
            "range-slider__pips": true,
            "range-slider__pips_isHidden": this._options.isHidden,
          },
          classInfo
        )
      )}
        ...=${spread(attributes)}
      style=${styleMap(Object.assign({}, {}, styleInfo))}
    >
      ${this.getPipsRender()}
    </div>`;

  constructor(options: PipsOptions = DEFAULT_OPTIONS, state: PipsState = DEFAULT_STATE) {
    super(DEFAULT_OPTIONS, DEFAULT_STATE, options, state, {
      theOrderOfIteratingThroughTheOptions: ["isHidden", "values", "density", "formatter"],
    });
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

    return this;
  }
  setValuesOption(values: PipsOptions["values"] = DEFAULT_OPTIONS.values) {
    this._options.values = ([] as number[]).concat(values);
    this._fixValuesOption();

    return this;
  }
  setDensityOption(density: PipsOptions["density"] = DEFAULT_OPTIONS.density) {
    this._options.density = density;
    this._fixDensityOption();

    return this;
  }
  setFormatterOption(formatter: PipsOptions["formatter"] = DEFAULT_OPTIONS.formatter) {
    this._options.formatter = formatter;

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

  protected getPipsRender() {
    const valueClasses: ClassInfo = { "range-slider__pips-value": true };
    const markerClasses: ClassInfo = { "range-slider__pips-marker": true };
    let valueStyles: StyleInfo;
    let markerStyles: StyleInfo;

    /**values */
    const size = this._options.values[this._options.values.length - 1] - this._options.values[0];
    let valuePosition = 0;
    let rangeShift = 0;
    let rangeBetweenValues = 0;

    /**density */
    const rangeBetweenMarkers = +(1 / this._options.density).toFixed(RENDER_CALCULATION_PRECISION);
    let amountOfMarkers: number;
    let previousValueStyles: StyleInfo;
    let markerPosition = 0;

    let markers: TemplateResult[];
    return this._options.values.map((value, index, values) => {
      /**values */
      valueStyles = { left: `${(valuePosition += rangeShift)}%` };
      rangeShift = +(((values[index + 1] - value) / size) * 100).toFixed(
        RENDER_CALCULATION_PRECISION
      );
      /**density */
      markers = [];
      if (index > 0) {
        rangeBetweenValues =
          Number.parseFloat(valueStyles.left) - Number.parseFloat(previousValueStyles.left);
        amountOfMarkers = Math.floor(rangeBetweenValues * this._options.density);

        for (let j = 0; j < amountOfMarkers; j++) {
          markerStyles = { left: `${(markerPosition += rangeBetweenMarkers)}%` };
          markers.push(html`<div
            class=${classMap(markerClasses)}
            style=${styleMap(markerStyles)}
          ></div>`);
        }
      }
      previousValueStyles = valueStyles;

      return html`<div
          class=${classMap(valueClasses)}
          style=${styleMap(valueStyles)}
          data-value=${value}
          data-formatted-value="${this._options.formatter(this._options.values[index])}"
        ></div>
        ${markers}`;
    });
  }
}

type Formatter = (value: number) => string;

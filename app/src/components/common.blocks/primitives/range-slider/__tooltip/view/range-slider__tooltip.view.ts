import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map';
import { styleMap } from 'lit-html/directives/style-map';
import { spread } from '@open-wc/lit-helpers';

import { MVPView } from '@utils/devTools/tools/PluginCreationHelper';

import './range-slider__tooltip.scss';
import IRangeSliderTooltipView, {
  TooltipOptions,
  TooltipState,
} from './range-slider__tooltip.view.coupling';

const DEFAULT_OPTIONS: Required<TooltipOptions> = {
  orientation: 'top',
  isHidden: false,
  formatter: (value: number) => value.toFixed(2).toLocaleString(),
};

const DEFAULT_STATE: TooltipState = {
  value: -1,
};

class RangeSliderTooltipView
  extends MVPView<Required<TooltipOptions>, TooltipOptions, TooltipState>
  implements IRangeSliderTooltipView {
  readonly template = ({ classInfo = {}, styleInfo = {}, attributes = {} } = {}) => html`<div
    class=${classMap({
      'range-slider__tooltip': true,
      [`range-slider__tooltip_orientation-${this._options.orientation}`]: true,
      'range-slider__tooltip_isHidden': this._options.isHidden,
      ...classInfo,
    })}
    ...=${spread(attributes)}
    style=${styleMap({ ...styleInfo })}
  >
    ${this._options.formatter(this._state.value)}
  </div>`;

  constructor(options: TooltipOptions = DEFAULT_OPTIONS, state: TooltipState = DEFAULT_STATE) {
    super(DEFAULT_OPTIONS, DEFAULT_STATE, options, state, {
      theOrderOfIteratingThroughTheOptions: ['isHidden', 'formatter'],
    });
  }

  getOrientationOption() {
    return this._options.orientation;
  }
  getIsHiddenOption() {
    return this._options.isHidden;
  }
  getFormatterOption() {
    return this._options.formatter;
  }

  setOrientationOption(orientation: TooltipOptions['orientation'] = DEFAULT_OPTIONS.orientation) {
    this._options.orientation = orientation;

    return this;
  }
  setIsHiddenOption(isHidden: TooltipOptions['isHidden'] = DEFAULT_OPTIONS.isHidden) {
    this._options.isHidden = isHidden;

    return this;
  }
  setFormatterOption(formatter: TooltipOptions['formatter'] = DEFAULT_OPTIONS.formatter) {
    this._options.formatter = formatter;

    return this;
  }
}

export { RangeSliderTooltipView as default, DEFAULT_OPTIONS, DEFAULT_STATE };

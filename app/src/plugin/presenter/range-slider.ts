import defaultsDeep from 'lodash-es/defaultsDeep';

import { Unpacked } from '@utils/devTools/scripts/TypingHelper';
import { renderMVPView } from '@utils/devTools/scripts/PluginCreationHelper';

import IRangeSliderView, { RangeSliderOptions } from '../view/range-slider.view.coupling';
import RangeSliderView from '../view/range-slider.view';
import IRangeSliderModel from '../models/range-slider.model.coupling';

type ErrorCatcher = (reason: unknown) => void;

class RangeSliderPresenter {
  readonly view: IRangeSliderView;
  model?: IRangeSliderModel;

  constructor(
    container: HTMLElement,
    errorCatcher: ErrorCatcher,
    viewOptions?: RangeSliderOptions,
    model?: IRangeSliderModel
  ) {
    this.view = renderMVPView(RangeSliderView, [viewOptions] as [RangeSliderOptions], container);

    if (model !== undefined) {
      this.setModel(model, errorCatcher);
    }
  }

  setModel(model: IRangeSliderModel, errorCatcher: ErrorCatcher) {
    if (this.model !== undefined) {
      this.model.closeConnections();
    }

    this.model = defaultsDeep({}, model);

    this.model
      ?.getState()
      .then((state) => {
        this._initModelViewBinding();
        this._updateViewDisplay(state);

        return this;
      })
      .catch(errorCatcher);

    return this;
  }

  protected handleViewSet = () => {
    this.model?.setState({ value: this.view.get() });
  };

  protected _updateViewDisplay(state: Unpacked<ReturnType<IRangeSliderModel['getState']>>) {
    this.view.set(state.value);

    return this;
  }

  protected _initModelViewBinding() {
    this.view.on('set', this.handleViewSet);
    this.model?.whenStateIsChanged((state) => {
      this._updateViewDisplay(state);
    });

    return this;
  }
}

interface RangeSliderPresenterConstructor {
  new (
    container: HTMLElement,
    errorCatcher: ErrorCatcher,
    viewOptions?: RangeSliderOptions,
    model?: IRangeSliderModel
  ): RangeSliderPresenter;
}

export { RangeSliderPresenter as default, RangeSliderPresenterConstructor, ErrorCatcher };

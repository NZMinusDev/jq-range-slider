import AbstractPresenter from '@shared/utils/scripts/components/MVP/AbstractPresenter';

import RangeSliderAbstractPresentationModel from '../models/RangeSliderAbstractPresentationModel';
import RangeSliderAbstractView from '../view/RangeSliderAbstractView';
import { RangeSliderAbstractViewEvents } from '../view/types';

class RangeSliderPresenter extends AbstractPresenter<
  RangeSliderAbstractView,
  RangeSliderAbstractPresentationModel
> {
  protected _initModelViewBinding() {
    super._initModelViewBinding();

    this._view.on('start', this.handleViewStart.bind(this));
    this._view.on('slide', this.handleViewSlide.bind(this));
    this._view.on('end', this.handleViewEnd.bind(this));
    this._view.on('set', this.handelViewSet.bind(this));

    return this;
  }

  protected _removeModelViewBinding() {
    super._removeModelViewBinding();

    this._view.off('start', this.handleViewStart.bind(this));
    this._view.off('slide', this.handleViewSlide.bind(this));
    this._view.off('end', this.handleViewEnd.bind(this));
    this._view.off('set', this.handelViewSet.bind(this));

    return this;
  }

  protected handleViewStart(details: RangeSliderAbstractViewEvents['start']) {
    const { thumbIndex } = details;
    const { thumbs } = this._model.getState();

    thumbs[thumbIndex].isActive = true;

    this._model.setState({ thumbs });
  }

  protected handleViewSlide(details: RangeSliderAbstractViewEvents['slide']) {
    const { thumbIndex, newValue } = details;
    const { value } = this._model.getState();

    value[thumbIndex] = newValue;

    this._model.setState({ value });
  }

  protected handleViewEnd(details: RangeSliderAbstractViewEvents['end']) {
    const { thumbIndex } = details;
    const { thumbs } = this._model.getState();

    thumbs[thumbIndex].isActive = false;

    this._model.setState({ thumbs });
  }

  protected handelViewSet() {
    this._model.sendState();
  }
}

export { RangeSliderPresenter as default };

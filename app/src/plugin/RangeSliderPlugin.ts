import RangeSliderView from './view/RangeSliderView';
import RangeSliderMainPresentationModel from './models/RangeSliderMainPresentationModel';
import RangeSliderPresenter from './presenter/RangeSliderPresenter';
import {
  RangeSliderPluginOptions,
  RangeSliderPluginNormalizedOptions,
  IRangeSliderPluginFacadeModel,
} from './types';

class RangeSliderPlugin {
  protected view: RangeSliderView;

  protected model: RangeSliderMainPresentationModel;

  protected presenter: RangeSliderPresenter;

  constructor(
    container: HTMLElement | DocumentFragment,
    {
      options,
      facadeModel,
    }: {
      options?: RangeSliderPluginOptions;
      facadeModel?: IRangeSliderPluginFacadeModel;
    } = {}
  ) {
    this.model = new RangeSliderMainPresentationModel({
      options,
      facadeModel,
    });
    this.view = new RangeSliderView(
      this.model.getOptions(),
      this.model.getState()
    );
    this.presenter = new RangeSliderPresenter(container, this.view, this.model);
  }

  getOptions(): RangeSliderPluginNormalizedOptions {
    return this.model.getOptions();
  }

  setOptions(options?: RangeSliderPluginOptions) {
    this.model.setOptions(options);

    return this;
  }

  setFacadeModel(model: IRangeSliderPluginFacadeModel) {
    return this.model.setFacadeModel(model);
  }

  get() {
    return [...this.model.getState().value];
  }

  set(value?: number[]) {
    this.model.setState({ value });

    this.view.trigger('update', {}).trigger('set', {});

    return this;
  }

  on(
    eventName: Parameters<RangeSliderView['on']>[0] | 'response' | 'render',
    eventHandler:
      | Parameters<RangeSliderView['on']>[1]
      | Parameters<RangeSliderMainPresentationModel['on']>[1]
  ) {
    switch (eventName) {
      case 'render': {
        this.model.on('set', eventHandler);

        break;
      }
      case 'response': {
        this.model.on('response', eventHandler);

        break;
      }
      default: {
        this.view.on(eventName, eventHandler as () => void);
      }
    }

    return this;
  }

  off(
    eventName: Parameters<RangeSliderView['on']>[0] | 'response' | 'render',
    eventHandler:
      | Parameters<RangeSliderView['on']>[1]
      | Parameters<RangeSliderMainPresentationModel['on']>[1]
  ) {
    switch (eventName) {
      case 'render': {
        this.model.off('set', eventHandler);

        break;
      }
      case 'response': {
        this.model.on('response', eventHandler);

        break;
      }
      default: {
        this.view.off(eventName, eventHandler as () => void);
      }
    }

    return this;
  }

  remove() {
    this.presenter.clearContainer();

    return this;
  }
}

export { RangeSliderPlugin as default };

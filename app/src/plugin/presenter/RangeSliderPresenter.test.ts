import '@babel/polyfill';

import RangeSliderView from '../view/RangeSliderView';
import RangeSliderMainPresentationModel from '../models/RangeSliderMainPresentationModel';
import {
  RangeSliderFacadeModelState,
  IRangeSliderFacadeModel,
} from '../models/types';
import RangeSliderPresenter from './RangeSliderPresenter';

describe('RangeSliderPresenter', () => {
  jest.useFakeTimers();

  const serverState: RangeSliderFacadeModelState = { value: [50] };
  const serverStateUpdateDelay = 1000;

  const changeServerState = () => {
    serverState.value[0] = Math.random() * 100;
  };

  class FacadeModel implements IRangeSliderFacadeModel {
    async setState() {
      return this;
    }

    // eslint-disable-next-line class-methods-use-this
    async getState() {
      return serverState;
    }

    // eslint-disable-next-line class-methods-use-this
    whenStateIsChanged(callback: (state: RangeSliderFacadeModelState) => void) {
      setInterval(() => {
        changeServerState();
        callback(serverState);
      }, serverStateUpdateDelay);
    }

    closeConnections() {
      return this;
    }
  }

  let container: HTMLDivElement;
  let view: RangeSliderView;
  let presentationModel: RangeSliderMainPresentationModel;
  let facadeModel: FacadeModel;
  let presenter: RangeSliderPresenter;

  describe('basic usage: without facadeModel', () => {
    beforeEach(() => {
      container = document.createElement('div');
      presentationModel = new RangeSliderMainPresentationModel();
      view = new RangeSliderView(
        presentationModel.getOptions(),
        presentationModel.getState()
      );
      presenter = new RangeSliderPresenter(container, view, presentationModel);

      document.body.append(container);
    });

    test('after view emits event with data the presentationModel should to be updated', () => {
      const presentationModelSetStateSpy = jest.spyOn(
        presentationModel,
        'setState'
      );

      view.trigger('start', { thumbIndex: 0 });
      view.trigger('slide', { thumbIndex: 0, newValue: 35 });
      view.trigger('end', { thumbIndex: 0 });

      expect(presentationModelSetStateSpy).toBeCalledTimes(3);

      presentationModelSetStateSpy.mockRestore();
    });

    test('after presentationModel changes its state view should to be updated and rerendered one times', () => {
      const previousViewDisplay = container.innerHTML;
      const presentationModelState = presentationModel.getState();
      const viewTemplateSpy = jest.spyOn(view, 'template');

      presentationModelState.value[0] += 1;
      presentationModel.setState(presentationModelState);

      const newViewDisplay = container.innerHTML;

      expect(previousViewDisplay).not.toBe(newViewDisplay);
      expect(viewTemplateSpy).toBeCalledTimes(1);

      viewTemplateSpy.mockRestore();
    });

    test('clearContainer method should clear container', () => {
      presenter.clearContainer();

      expect(container.innerHTML).toBe('');
    });
  });

  describe('advanced usage: with facadeModel', () => {
    beforeEach(() => {
      container = document.createElement('div');
      facadeModel = new FacadeModel();
      presentationModel = new RangeSliderMainPresentationModel({ facadeModel });
      view = new RangeSliderView(
        presentationModel.getOptions(),
        presentationModel.getState()
      );
      presenter = new RangeSliderPresenter(container, view, presentationModel);

      document.body.append(container);
    });

    test('view should to be updated to fetched state', () => {
      const viewSetSpy = jest.spyOn(view, 'set');

      presenter = new RangeSliderPresenter(container, view, presentationModel);

      expect(viewSetSpy).toBeCalledWith(
        expect.anything(),
        expect.objectContaining(serverState)
      );

      viewSetSpy.mockRestore();
    });

    test('after view emits "set" event the server state should to be updated', () => {
      view.trigger('set', {});

      expect(serverState.value).toStrictEqual(
        presentationModel.getState().value
      );
    });

    test('after server changes its state view should to be updated and rendered one times', () => {
      const viewSetSpy = jest.spyOn(view, 'set');

      jest.advanceTimersByTime(serverStateUpdateDelay);
      expect(viewSetSpy).toBeCalledWith(
        expect.anything(),
        expect.objectContaining(serverState)
      );
      jest.advanceTimersByTime(serverStateUpdateDelay);
      expect(viewSetSpy).toBeCalledWith(
        expect.anything(),
        expect.objectContaining(serverState)
      );
      jest.advanceTimersByTime(serverStateUpdateDelay);
      expect(viewSetSpy).toBeCalledWith(
        expect.anything(),
        expect.objectContaining(serverState)
      );

      expect(viewSetSpy).toBeCalledTimes(3);

      viewSetSpy.mockRestore();
    });
  });
});

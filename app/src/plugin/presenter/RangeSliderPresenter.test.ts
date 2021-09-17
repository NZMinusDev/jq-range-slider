import '@babel/polyfill';
import cloneDeep from 'lodash-es/cloneDeep';

import IRangeSliderModel, { RangeSliderState } from '../models/IRangeSliderModel';
import RangeSliderPresenter from './RangeSliderPresenter';

describe('plugin presenter', () => {
  jest.useFakeTimers();

  const serverState: RangeSliderState = { value: [50] };
  const serverStateUpdateDelay = 1000;

  const changeServerState = () => {
    serverState.value[0] = Math.random() * 100;
  };

  const model: IRangeSliderModel = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async setState(state) {
      return this;
    },
    async getState() {
      return serverState;
    },
    whenStateIsChanged(callback) {
      setInterval(() => {
        changeServerState();
        callback(serverState);
      }, serverStateUpdateDelay);
    },
    closeConnections() {
      return this;
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const defaultErrorCatcher = (reason) => {};

  let root: HTMLDivElement;
  let presenter: RangeSliderPresenter;

  const getDisplayedState = () => ({ value: presenter.view.get() });

  beforeEach(() => {
    root = document.createElement('div');
    document.body.append(root);
  });

  describe('init with undefined optional args', () => {
    beforeEach(() => {
      presenter = new RangeSliderPresenter(root, defaultErrorCatcher);
    });

    test('setModel is not called', () => {
      const setModelSpy = jest.spyOn(presenter, 'setModel');

      expect(presenter.view).toBeDefined();
      expect(presenter.model).not.toBeDefined();
      expect(setModelSpy).not.toBeCalled();
    });
  });

  describe('init with defined optional args', () => {
    beforeEach(() => {
      presenter = new RangeSliderPresenter(root, defaultErrorCatcher, {}, model);
    });

    test('view and model are set', () => {
      expect(presenter.view).not.toBe(undefined);
      expect(presenter.model).not.toBe(undefined);
    });

    describe('methods', () => {
      describe('setModel', () => {
        let assignedModel: IRangeSliderModel;
        let newModel: IRangeSliderModel;

        beforeEach(() => {
          assignedModel = presenter.model as IRangeSliderModel;
          newModel = cloneDeep(model);
        });

        test('old model should call closeConnections()', () => {
          const closeConnectionsSpy = jest.spyOn(assignedModel, 'closeConnections');

          presenter.setModel(newModel, defaultErrorCatcher);

          expect(closeConnectionsSpy).toBeCalled();

          closeConnectionsSpy.mockRestore();
        });

        test('new model should be cloned', () => {
          presenter.setModel(newModel, defaultErrorCatcher);

          expect(presenter.model).not.toBe(newModel);
        });

        test('view should update its state to fetched state', () => {
          expect(getDisplayedState()).toStrictEqual(serverState);
        });

        test('after view change state model should get this value for updating', () => {
          const modelSetStateSpy = jest.spyOn(presenter.model as IRangeSliderModel, 'setState');
          const newState: RangeSliderState = { value: [-10] };

          presenter.view.set(newState.value);

          expect(modelSetStateSpy).toBeCalledWith(newState);

          modelSetStateSpy.mockRestore();
        });

        test('after model changes its state view should update display', () => {
          const viewSetSpy = jest.spyOn(presenter.view, 'set');

          jest.advanceTimersByTime(serverStateUpdateDelay);
          expect(getDisplayedState()).toStrictEqual(serverState);
          jest.advanceTimersByTime(serverStateUpdateDelay);
          expect(getDisplayedState()).toStrictEqual(serverState);
          jest.advanceTimersByTime(serverStateUpdateDelay);
          expect(getDisplayedState()).toStrictEqual(serverState);

          expect(viewSetSpy).toBeCalledTimes(3);
        });

        test('if something bad happened errorCatcher is called', () => {
          try {
            const getStateMockImplementation = jest.spyOn(model, 'getState');
            getStateMockImplementation.mockImplementation(() => {
              throw new Error('connect error');
            });
            presenter.setModel(model, defaultErrorCatcher);

            expect(presenter).not.toThrow();

            expect(defaultErrorCatcher).toBeCalled();

            getStateMockImplementation.mockRestore();
            // eslint-disable-next-line no-empty
          } catch (e) {}
        });
      });
    });
  });
});

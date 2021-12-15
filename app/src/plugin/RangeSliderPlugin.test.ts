import RangeSliderPlugin from './RangeSliderPlugin';
import { RangeSliderFacadeModelState } from './models/types';

describe('RangeSliderPlugin', () => {
  jest.useFakeTimers();
  const serverStateUpdateDelay = 1000;

  const facadeModel = {
    async getState() {
      return { value: [] };
    },
    async setState() {
      return this;
    },
    whenStateIsChanged(callback: (state: RangeSliderFacadeModelState) => void) {
      setInterval(() => {
        callback({ value: [] });
      }, serverStateUpdateDelay);
    },
    closeConnections() {
      return this;
    },
  };
  const callbackMock = jest.fn();
  let container: HTMLDivElement;
  let plugin: RangeSliderPlugin;

  beforeEach(() => {
    callbackMock.mockClear();
    container = document.createElement('div');
    plugin = new RangeSliderPlugin(container);

    document.body.append(container);
  });

  test('getters and setters should work with deep cloned values', () => {
    const options = {
      pips: {
        mode: 'count' as 'count',
      },
    };
    const value = [-10, 0, 10];

    plugin.setOptions(options);
    plugin.set(value);

    expect(plugin.getOptions()).not.toBe(options);
    expect(plugin.get()).not.toBe(value);
  });

  test('set method should set all values to passed number', () => {
    const values = plugin.get();
    const [valueToPass] = values;

    plugin.set(valueToPass);

    expect(plugin.get()).toStrictEqual(values.fill(valueToPass));
  });

  test('when set method have been called update and set events have been emitted', () => {
    plugin.on('update', callbackMock);
    plugin.on('set', callbackMock);

    plugin.set();

    expect(callbackMock).toHaveBeenCalledTimes(2);
  });

  test("render with response event shouldn't be emitted if facadeModel is unset", () => {
    plugin.on('render', callbackMock);
    plugin.on('response', callbackMock);

    jest.advanceTimersByTime(serverStateUpdateDelay);

    expect(callbackMock).toBeCalledTimes(0);
  });

  test('render with response event should be supported if facadeModel is set', () => {
    plugin.setFacadeModel(facadeModel);

    plugin.on('render', callbackMock);
    plugin.on('response', callbackMock);

    jest.advanceTimersByTime(serverStateUpdateDelay);

    expect(callbackMock).toBeCalledTimes(2);
  });

  test('event listeners should be able to be removed', () => {
    plugin.on('render', callbackMock);
    plugin.on('response', callbackMock);
    plugin.on('start', callbackMock);
    plugin.on('slide', callbackMock);
    plugin.on('change', callbackMock);
    plugin.on('update', callbackMock);
    plugin.on('set', callbackMock);
    plugin.on('end', callbackMock);

    plugin.off('render', callbackMock);
    plugin.off('response', callbackMock);
    plugin.off('start', callbackMock);
    plugin.off('slide', callbackMock);
    plugin.off('change', callbackMock);
    plugin.off('update', callbackMock);
    plugin.off('set', callbackMock);
    plugin.off('end', callbackMock);

    plugin.set();

    expect(callbackMock).not.toBeCalled();
  });

  test('remove method cleans the container', () => {
    plugin.remove();

    expect(container.innerHTML).toBe('');
  });

  test('old facadeModel should call closeConnections when the new one is set', () => {
    plugin.setFacadeModel(facadeModel);

    const closeConnectionsSpy = jest.spyOn(facadeModel, 'closeConnections');

    const newFacadeModel = {
      async getState() {
        return { value: [] };
      },
      async setState() {
        return this;
      },
      whenStateIsChanged() {},
      closeConnections() {
        return this;
      },
    };

    plugin.setFacadeModel(newFacadeModel);

    expect(closeConnectionsSpy).toBeCalled();

    closeConnectionsSpy.mockRestore();
  });
});

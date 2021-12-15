import IConfigurableSliderDemoModel from './IConfigurableSliderDemoModel';
import { RangeSliderFacadeModelState } from './types';

class ConfigurableSliderDemoMainModel implements IConfigurableSliderDemoModel {
  protected eventSource = new EventSource('/stateChanger');

  async setState(state: RangeSliderFacadeModelState) {
    await fetch('/fetch/post/state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ mode: 'set', state: JSON.stringify(state) }),
    });

    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  async getState() {
    const response = await fetch('/fetch/post/state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ mode: 'get' }),
    });

    return response.json();
  }

  whenStateIsChanged(callback: (state: RangeSliderFacadeModelState) => void) {
    this.eventSource.onmessage = (event) => {
      callback(JSON.parse(event.data).state);
    };
  }

  closeConnections() {
    this.eventSource.onmessage = null;

    return this;
  }
}

export { ConfigurableSliderDemoMainModel as default };

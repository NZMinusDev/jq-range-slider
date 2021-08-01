import IModel from './IModel';

const mainModel: IModel = {
  async setState(state) {
    await fetch('/fetch/post/state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ mode: 'set', state: JSON.stringify(state) }),
    });

    return this;
  },
  async getState() {
    const response = await fetch('/fetch/post/state', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ mode: 'get' }),
    });

    // eslint-disable-next-line sonarjs/prefer-immediate-return
    const result = await response.json();

    return result;
  },
  whenStateIsChanged(callback) {
    if (this.eventSource === undefined) {
      this.eventSource = new EventSource('/stateChanger');
    }

    this.eventSource.onmessage = function (event) {
      callback(JSON.parse(event.data).state);
    };
  },
};

export default mainModel;

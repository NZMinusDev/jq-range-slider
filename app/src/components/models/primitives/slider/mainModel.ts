import IModel from './IModel';

const mainModel: IModel = {
  async setState(state) {
    console.log('setState: ', JSON.stringify(state));

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

    const result = await response.json();

    console.log('getState: ', result);

    return result;
  },
  whenStateIsChanged(callback) {
    const eventSource = new EventSource('/stateChanger');

    eventSource.onmessage = function (event) {
      console.log('New message from server: ', event.data);
      callback(JSON.parse(event.data).state);
    };
  },
};

export default mainModel;

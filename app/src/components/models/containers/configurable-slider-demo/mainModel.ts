import IModel from './IModel';

interface MainModel extends IModel {
  eventSource: EventSource;
}

const mainModel: MainModel = {
  eventSource: new EventSource('/stateChanger'),

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

    return response.json();
  },
  whenStateIsChanged(callback) {
    this.eventSource.onmessage = (event) => {
      callback(JSON.parse(event.data).state);
    };
  },
  closeConnections() {
    this.eventSource.onmessage = null;

    return this;
  },
};

export default mainModel;

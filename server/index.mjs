/* eslint-disable import/extensions */
import express from 'express';
import path from 'path';
import isEqual from 'lodash/isEqual.js';
import cloneDeep from 'lodash/cloneDeep.js';

// local
const isDev = process.env.NODE_ENV === 'development';

const app = express();
const jsonParser = express.json();

const state = { value: [50] };

if (isDev) {
  app.use(express.static(path.resolve('app/public')));
} else {
  app.use(express.static(path.resolve('./')));
}

app.use('/fetch/post/state', jsonParser, (req, res, next) => {
  switch (req.body.mode) {
    case 'get': {
      console.log('getState: ', state);

      res.json(state);

      break;
    }
    case 'set': {
      state.value = JSON.parse(req.body.state).value;

      console.log('setState: ', state);

      res.sendStatus(200);

      break;
    }

    default: {
      res.sendStatus(200);

      break;
    }
  }

  next();
});

let timerId;
app.use('/stateChanger', (req, res, next) => {
  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });

  let sentState = cloneDeep(state);

  if (timerId === undefined) {
    clearTimeout(timerId);
  }

  timerId = setInterval(() => {
    if (!isEqual(sentState, state)) {
      res.write(
        `data: {"state": ${JSON.stringify(state)}}\nid: ${Date.now()}\n\n`
      );
      console.log('whenStateIsChanged: ', state);
    }

    sentState = cloneDeep(state);
  }, 3000);

  next();
});

app.listen(process.env.PORT || 8080, () => {
  console.log('Server started at 8080');
});

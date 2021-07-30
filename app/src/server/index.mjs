/* eslint-disable import/no-extraneous-dependencies */

import express from 'express';
import path from 'path';

const app = express();
const jsonParser = express.json();

app.use(express.static(path.resolve('app/dist')));

app.use('/fetch/post/state', jsonParser, (req, res, next) => {
  switch (req.body.mode) {
    case 'get': {
      console.log('getState');

      res.json({ value: 0 });

      break;
    }
    case 'set': {
      console.log('setState: ', req.body.state);

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

app.use('/stateChanger', (req, res, next) => {
  console.log('whenStateIsChanged');

  const state = { value: 0 };

  res.writeHead(200, {
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
  });

  setTimeout(() => {
    res.write(`data: {"state": ${JSON.stringify(state)}}\nid: ${Date.now()}\n\n`);
  }, 2000);

  next();
});

app.listen(8080, () => {
  console.log('Server started at 8080');
});

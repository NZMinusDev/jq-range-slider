import { testDOM } from '@shared/utils/scripts/testing/unit';

import TrackView from './TrackView';

testDOM({
  Creator: TrackView,
  constructorsArgs: [[{ orientation: 'horizontal' }, {}]],
  templatesArgs: [],
  callbacksWithTest: [],
});

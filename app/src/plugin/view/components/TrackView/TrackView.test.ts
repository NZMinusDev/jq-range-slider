import { testDOM } from '@shared/utils/scripts/UnitTestingHelper';

import TrackView from './TrackView';

testDOM({
  Creator: TrackView,
  constructorsArgs: [[{ orientation: 'horizontal' }, {}]],
  templatesArgs: [],
  callbacksWithTest: [],
});

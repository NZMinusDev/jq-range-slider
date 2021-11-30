import { testDOM } from '@shared/utils/scripts/UnitTestingHelper';

import RangeView from './RangeView';

testDOM({
  Creator: RangeView,
  constructorsArgs: [[{ isConnected: false }, {}]],
  templatesArgs: [],
  callbacksWithTest: [],
});

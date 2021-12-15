import { testDOM } from '@shared/utils/scripts/testing/unit';

import RangeView from './RangeView';

testDOM({
  Creator: RangeView,
  constructorsArgs: [[{ isConnected: false }, {}]],
  templatesArgs: [],
  callbacksWithTest: [],
});

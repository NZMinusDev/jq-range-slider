import { testDOM } from '@shared/utils/scripts/UnitTestingHelper';

import PipsView from './PipsView';

testDOM({
  Creator: PipsView,
  constructorsArgs: [
    [
      {
        orientation: 'horizontal',
        values: [],
        density: 1,
        formatter: () => '',
        isHidden: false,
      },
      {},
    ],
  ],
  templatesArgs: [],
  callbacksWithTest: [],
});

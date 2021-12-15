import { testDOM } from '@shared/utils/scripts/testing/unit';

import TooltipView from './TooltipView';

testDOM({
  Creator: TooltipView,
  constructorsArgs: [
    [
      { orientation: 'top', formatter: () => '', isHidden: false },
      { value: -1 },
    ],
  ],
  templatesArgs: [],
  callbacksWithTest: [],
});

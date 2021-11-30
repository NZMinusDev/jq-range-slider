import { AbstractViewEvents } from '@shared/utils/scripts/components/MVP/AbstractView';

type TrackViewOptions = {
  orientation: 'horizontal' | 'vertical';
};

type TrackViewState = {};

type TrackViewIsolatedEvents = AbstractViewEvents & {};

export { TrackViewOptions, TrackViewState, TrackViewIsolatedEvents };

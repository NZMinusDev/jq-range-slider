import { TemplateResult } from 'lit-html';
import { ClassInfo } from 'lit-html/directives/class-map';
import { StyleInfo } from 'lit-html/directives/style-map';
import defaultsDeep from 'lodash-es/defaultsDeep';

import EventManagerMixin from '../EventManagerMixin/EventManagerMixin';

type Template = (
  attributes?: {
    classInfo?: ClassInfo;
    styleInfo?: StyleInfo;
    attributes?: { [key: string]: unknown };
  },
  ...args: any | undefined
) => TemplateResult;

type AbstractViewEvents = {};

abstract class AbstractView<
  TOptions extends Required<Record<string, unknown>>,
  TState extends Required<Record<string, unknown>>,
  TEvents extends AbstractViewEvents
> extends EventManagerMixin<TEvents> {
  abstract readonly template: Template;

  protected _options: TOptions;

  protected _state: TState;

  constructor(options: TOptions, state: TState) {
    super();

    this._options = this._setOptions(options);
    this._state = this._setState(state);
  }

  set(options: TOptions, state: TState) {
    this._setOptions(options);
    this._setState(state);

    return this;
  }

  protected _setOptions(options: TOptions) {
    this._options = defaultsDeep({}, options);

    return this._options;
  }

  protected _setState(state: TState) {
    this._state = defaultsDeep({}, state);

    return this._state;
  }
}

export { AbstractView as default, AbstractViewEvents };

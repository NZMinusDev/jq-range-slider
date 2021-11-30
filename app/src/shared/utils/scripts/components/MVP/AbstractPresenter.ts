import { render } from 'lit-html';

import AbstractView, { AbstractViewEvents } from './AbstractView';
import AbstractPresentationModel from './AbstractPresentationModel';
import IFacadeModel from './IFacadeModel';

abstract class AbstractPresenter<
  TView extends AbstractView<
    Record<string, unknown>,
    Record<string, unknown>,
    AbstractViewEvents
  >,
  TModel extends AbstractPresentationModel<
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>,
    IFacadeModel<Record<string, unknown>>
  >
> {
  protected _container: HTMLElement | DocumentFragment;

  protected _view: TView;

  protected _model: TModel;

  constructor(
    container: HTMLElement | DocumentFragment,
    view: TView,
    model: TModel
  ) {
    this._container = container;
    this._view = view;
    this._model = model;

    this._bindModelWithView();
  }

  setView(view: TView) {
    this._view = view;

    this._bindModelWithView();

    return this;
  }

  setModel(model: TModel) {
    this._model = model;

    this._bindModelWithView();

    return this;
  }

  clearContainer() {
    render('', this._container);
    this._container.textContent = '';

    return this;
  }

  protected _bindModelWithView() {
    this._removeModelViewBinding();
    this._initModelViewBinding();
    this._updateViewDisplay();
  }

  protected _updateViewDisplay() {
    this._view.set(this._model.getOptions(), this._model.getState());

    render(this._view.template(), this._container);

    return this;
  }

  protected _initModelViewBinding() {
    this._model.on('set', this.handleModelSet);

    return this;
  }

  protected _removeModelViewBinding() {
    this._model.off('set', this.handleModelSet);

    return this;
  }

  protected handleModelSet = () => {
    this._updateViewDisplay();
  };
}

export { AbstractPresenter as default };

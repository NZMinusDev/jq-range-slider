interface IFacadeModel<State extends Record<string, unknown>> {
  getState(): Promise<State>;
  setState(state?: State): Promise<this>;
  whenStateIsChanged(callback: (state: State) => void): void;
  closeConnections(): this;
}

export { IFacadeModel as default };

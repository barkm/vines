export interface State {
  position: [number, number];
  color: string;
}

export interface Head extends Iterator<State> {
  spawn(): Head[];
}

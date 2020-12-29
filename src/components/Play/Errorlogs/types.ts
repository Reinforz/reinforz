export interface PlayErrorlog {
  quiz: string,
  target: string,
  message: string,
  level: "ERROR" | "WARN",
  _id: string
}

export type PlayErrorlogsState = {
  error_logs: PlayErrorlog[],
};

export interface PlayErrorlogsContextValue extends PlayErrorlogsState {
  removeErrorLogs: (items: PlayErrorlog[]) => void
}
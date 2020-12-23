export interface PlayErrorLog {
  quiz: string,
  target: string,
  message: string,
  level: "ERROR" | "WARN",
  _id: string
}

export type PlayErrorLogState = PlayErrorLog[];
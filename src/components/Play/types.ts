export interface IPlayState {
  playing: boolean
}

export interface IPlayUtils {
  setPlaying: (playing: boolean) => void
}

export interface IPlayRenderProps {
  PlayState: IPlayState,
  PlayUtils: IPlayUtils
}
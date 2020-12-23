export interface IPlayState {
  playing: boolean
}

export interface IPlayUtils {
  setPlaying: (playing: boolean) => void
}

export interface IPlayRProps {
  PlayState: IPlayState,
  PlayUtils: IPlayUtils
}
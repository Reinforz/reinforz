import React from "react";
import { useHistory } from "react-router-dom";
import { FcSettings } from "react-icons/fc";
import SplitPane from "react-split-pane";
import { useLocalStorage } from "react-use";
import { Icon } from "../../Basic/Icon"
import { useThemeSettings } from "../../../hooks";
import { PlayTable } from "..";
import View from "../../Basic/View";
// @ts-ignore
import Pane from 'react-split-pane/lib/Pane';

export function PlayContent() {
  const history = useHistory(), { theme, settings, sounds } = useThemeSettings(), [value, setLocalStorage] = useLocalStorage<string>('PANE_SIZE', '250');

  return <div className="Play-content" id="Play-content" /* style={{ ...MenuExtra.content_elem_style }} */>
    <Icon popoverText="Click to go to settings page">
      <FcSettings className="App-icon App-icon--settings" onClick={() => {
        if (settings.sound) sounds.swoosh.play()
        history.push("/settings")
      }} />
    </Icon>
    <SplitPane split="vertical" onChange={(size: any) => {
      setLocalStorage(size[0])
    }}>
      <Pane initialSize={value || "50%"} minSize="30%" maxSize="70%" className="Play-pane">
        <View lskey="PlayLists">
          {({ ViewComponent, ViewExtra }: any) =>
            <div {...ViewExtra.ViewContainerProps}>
              {ViewComponent}
            </div>
          }
        </View>
        <div className="Help" style={{ backgroundColor: theme.color.dark, color: theme.palette.text.primary }}>Need help, <a style={{ color: theme.palette.text.secondary }} href="http://github.com/Devorein/reinforz" rel="noopener noreferrer" target="_blank">click here</a> to go to the doc</div>
      </Pane>
      <PlayTable />
    </SplitPane>
  </div>
}
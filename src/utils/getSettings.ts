import { ISettings } from "../types";

export const getSettings = () => {
  let local_settings: any = localStorage.getItem("SETTINGS");
  local_settings = local_settings ? JSON.parse(local_settings) : {}
  local_settings.animation = local_settings.animation ? (local_settings.animation === "true" ? true : false) : true;
  local_settings.sound = local_settings.sound ? (local_settings.sound === "true" ? true : false) : true;
  local_settings.hovertips = local_settings.hovertips ? (local_settings.hovertips === "true" ? true : false) : true;
  local_settings.theme = local_settings.theme || "dark";
  return local_settings as ISettings;
}
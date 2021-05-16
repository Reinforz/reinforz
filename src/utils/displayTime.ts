export default function displayTime(timeout: number){
  const min = Math.floor(timeout / 60);
  const sec = timeout % 60;
  return `0${min}:${sec < 10 ? '0' + sec : sec}`;
}
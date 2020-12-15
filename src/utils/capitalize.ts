export default function (str: string) {
  return str.split("_").map(c => c.charAt(0).toUpperCase() + c.substr(1)).join(" ")
}
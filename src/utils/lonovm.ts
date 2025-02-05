/**
 * Capitalizes the string passed in (Only the first letter)
 * @param text
 * @returns capitalized word
 */
export const capitalize = (text: string) => {
  let textArr = text.split(" ");
  textArr = textArr.map((elm) => elm.charAt(0).toUpperCase() + elm.slice(1));
  return textArr.join(" ");
};

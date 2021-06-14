const ColorTypes = ['lime', 'salmon', 'blue', 'red', 'sliver'];

export type ColorType = typeof ColorTypes[number];
type Colors = {[key in ColorType]: string};

const colors: Colors = {
  lime: '#68C295',
  red: '#dc1e34',
  salmon: '#ffa319',
  blue: '#28c5f9',
  silver: '#C0C0C0',
  background: '#eee',
  disabled: '#aaa',
  black: '#000',
};

export default colors;

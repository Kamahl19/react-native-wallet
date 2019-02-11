const colors = {
  darkGray: 'rgba(0, 0, 0, .87)',
  gray: 'rgba(0, 0, 0, .32)',
  lightGray: 'rgba(0, 0, 0, .20)',
  red: '#ff3b30',
  green: '#4cd964',
  blue: '#006fff',
};

export function getColor(color) {
  return colors[color] || color;
}

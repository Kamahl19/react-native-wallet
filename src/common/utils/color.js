const colors = {
  darkGray: 'rgba(0, 0, 0, .87)',
  gray: 'rgba(0, 0, 0, .32)',
  red: '#ff3b30',
  green: '#4cd964',
};

export function getColor(color) {
  return colors[color] || color;
}

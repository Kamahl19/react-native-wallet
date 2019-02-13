const colors = {
  gray: 'rgba(0, 0, 0, .20)',
  red: '#ff3b30',
  blue: '#006fff',
  white: '#ffffff',
};

export function getColor(color) {
  return colors[color] || color;
}

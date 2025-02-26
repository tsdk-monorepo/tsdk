const folder = '└─';
const space = ' ';

const main = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
  bullet: '⏱️',
  folder,
  space,
};

function get(name: keyof typeof main) {
  const symbols = main;
  return symbols[name];
}

export default {
  ...main,
  get,
};

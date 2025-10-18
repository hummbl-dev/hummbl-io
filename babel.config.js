export default {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  babelrc: false,
  configFile: false,
};

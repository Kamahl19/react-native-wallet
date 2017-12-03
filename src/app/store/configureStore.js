export default function configureStore() {
  return __DEV__
    ? require('./configureStore.dev').default()
    : require('./configureStore.prod').default();
}

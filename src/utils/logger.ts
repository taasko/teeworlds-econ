import debugFunc from "debug";

export default (namespace: string) => {
  const log = debugFunc(namespace);
  /* tslint:disable-next-line */
  log.log = console.log.bind(console); // don't forget to bind to console!

  return {
    debug: log,
    error: debugFunc(namespace),
  };
};

declare module 'which' {
  const which: {
    sync(cmd: string): string;
  };
  export default which;
}

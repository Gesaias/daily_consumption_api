export default () => ({
  enviroment: () => {
    const ambient = process.env.NODE_ENVIROMENT;

    if (ambient === 'production') {
      return EAmbient.production;
    } else if (ambient === 'test') {
      return EAmbient.test;
    } else {
      return EAmbient.development;
    }
  },
  port: process.env.APP_PORT,
});

export enum EAmbient {
  development = 'development',
  test = 'test',
  production = 'production',
}

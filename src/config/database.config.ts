export default () => ({
  host: getHost(),
  port: getPort(),
  name: getName(),
  schema: getSchema(),
  username: getUsername(),
  password: getPassword(),
  synchronize: getSynchronization(),
  logging: getLogging(),
  migrationsRun: getMigrationsRun(),
});

function getHost(): string {
  const ambient: string = process.env.NODE_ENVIROMENT;

  if (ambient) {
    if (ambient === 'production') {
      return process.env.DB_HOST;
    } else if (ambient === 'test') {
      return process.env.DB_HOST_T;
    }
  }
  return process.env.DB_HOST_H;
}

function getPort(): number {
  const ambient: string = process.env.NODE_ENVIROMENT;

  if (ambient) {
    if (ambient === 'production') {
      return parseInt(process.env.DB_PORT);
    } else if (ambient === 'test') {
      return parseInt(process.env.DB_PORT_T);
    }
  }
  return parseInt(process.env.DB_PORT_H);
}

function getName(): string {
  const ambient: string = process.env.NODE_ENVIROMENT;

  if (ambient) {
    if (ambient === 'production') {
      return process.env.DB_NAME;
    } else if (ambient === 'test') {
      return process.env.DB_NAME_T;
    }
  }
  return process.env.DB_NAME_H;
}

function getSchema(): string {
  const ambient: string = process.env.NODE_ENVIROMENT;

  if (ambient) {
    if (ambient === 'production') {
      return process.env.DB_SCHEMA;
    } else if (ambient === 'test') {
      return process.env.DB_SCHEMA_T;
    }
  }
  return process.env.DB_SCHEMA_H;
}

function getUsername(): string {
  const ambient: string = process.env.NODE_ENVIROMENT;

  if (ambient) {
    if (ambient === 'production') {
      return process.env.DB_USERNAME;
    } else if (ambient === 'test') {
      return process.env.DB_USERNAME_T;
    }
  }
  return process.env.DB_USERNAME_H;
}

function getPassword(): string {
  const ambient: string = process.env.NODE_ENVIROMENT;

  if (ambient) {
    if (ambient === 'production') {
      return process.env.DB_PASSWORD;
    } else if (ambient === 'test') {
      return process.env.DB_PASSWORD_T;
    }
  }
  return process.env.DB_PASSWORD_H;
}

function getSynchronization(): boolean {
  const ambient: string = process.env.NODE_ENVIROMENT;

  if (ambient) {
    if (ambient === 'production') {
      return false;
    }

    if (process.env.DB_SYNCHRONIZE == 'true') {
      return true;
    } else {
      return false;
    }
  }
  return false;
}

function getLogging(): boolean {
  if (process.env.DB_LOGGING == 'true') {
    return true;
  } else {
    return false;
  }
}

function getMigrationsRun(): boolean {
  if (process.env.DB_MIGRATIONSRUN == 'true') {
    return true;
  } else {
    return false;
  }
}

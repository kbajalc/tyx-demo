import { Core, CoreServer } from 'tyx';

process.env.LOG_LEVEL = 'DEBUG';

if (require.main === module) {
  Core.init({ application: 'Debug', crudAllowed: true });
  CoreServer.start(5000);
} else {
  Core.init({ application: 'AWS', crudAllowed: true });
}

export const handler = Core.lambda();

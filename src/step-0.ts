import { Core, CoreServer } from 'tyx';

if (require.main === module) {
  Core.init('Debug', true);
  CoreServer.start(5000);
} else {
  Core.init('AWS', true);
}

export const handler = Core.lambda();

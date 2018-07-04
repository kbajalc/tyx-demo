import { Core } from 'tyx';

if (require.main === module) {
  Core.init('Debug', true);
  Core.start(5000);
}

export const handler = Core.lambda();

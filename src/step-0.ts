import { Core } from 'tyx';

if (require.main === module) {
  Core.init('Debug', true);
  Core.start(5000);
} else {
  Core.init('AWS', true);
}

export const handler = Core.lambda();

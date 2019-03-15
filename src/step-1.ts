import { Core, CoreServer, Public, Query, Service } from 'tyx';

@Service()
export class DemoService {
  @Public()
  @Query([void 0], String)
  public hello(): string {
    return `[${new Date().toISOString()}] Hello world ...`;
  }
}

if (require.main === module) {
  Core.init('Debug', true);
  CoreServer.start(5000);
} else {
  Core.init('AWS', true);
}

export const handler = Core.lambda();

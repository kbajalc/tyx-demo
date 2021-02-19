import { Core, CoreServer, Public, Query, Service } from 'tyx';

process.env.LOG_LEVEL = 'DEBUG';

@Service()
export class DemoService {
  @Public()
  @Query(String)
  public hello(): string {
    return `[${new Date().toISOString()}] Hello world ...`;
  }
}

if (require.main === module) {
  Core.init({ application: 'Debug', crudAllowed: true });
  CoreServer.start(5000);
} else {
  Core.init({ application: 'AWS', crudAllowed: true });
}

export const handler = Core.lambda();

import { Core, Public, Query, Service } from 'tyx';

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
  Core.start(5000);
}

export const handler = Core.lambda();

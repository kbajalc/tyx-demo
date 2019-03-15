import { Api, Core, CoreServer, Entity, Get, Handler, PrimaryIdColumn, Public, Query, Service } from 'tyx';

@Entity()
export class Test {
  @PrimaryIdColumn()
  public pk: string;
}

@Api()
export abstract class DemoApi {
  @Public()
  @Get('/hello')
  @Query([void 0], String)
  public async hello(): Promise<string> { throw undefined; }
}

@Service(DemoApi)
export class FirstService implements DemoApi {
  @Handler()
  public async hello(): Promise<string> {
    return `[${new Date().toISOString()}] Hello world ...`;
  }
}

// TypeErorr if it does not extends
@Service()
export class SecondService  /* extends FirstService */ implements DemoApi {
  @Handler()
  public async hello(): Promise<string> {
    return `[${new Date().toISOString()}] Hello world ...`;
  }
}

if (require.main === module) {
  Core.schema.write('schema/step-6.gql');
  Core.init('Debug', true);
  CoreServer.start(5000);
} else {
  Core.init('AWS', true);
}

export const handler = Core.lambda();

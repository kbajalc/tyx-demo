// tslint:disable-next-line:max-line-length
import { Activate, Api, ArgParam, Context, Core, CoreServer, Ctx, CtxObject, Entity, Get, Handler, Inject, Override, PrimaryIdColumn, Public, Query, Release, Service } from 'tyx';

@Entity()
export class Test {
  @PrimaryIdColumn()
  public pk: string;
}

@Api()
export class DemoApi {
  @Public()
  @Get('/hello')
  @Query(Ctx, String)
  public async hello(ctx?: Context): Promise<string> { throw undefined; }

  @Public()
  @Query(Number)
  public async add(
    @ArgParam() a: number,
    @ArgParam() b: number,
    @CtxObject() ctx?: Context
  ): Promise<number> { throw undefined; }
}

@Service(DemoApi, false)
export class FirstService implements DemoApi {
  @Handler()
  public async hello(): Promise<string> {
    return `[${new Date().toISOString()}] Hello world ...`;
  }

  @Handler()
  public async add(a: number, b: number, ctx?: Context): Promise<number> {
    return a + b;
  }
}

// TypeErorr if it does not extends
@Service()
export class SecondService extends FirstService implements DemoApi {
  @Override()
  public async hello(): Promise<string> {
    return `${SecondService.name} [${new Date().toISOString()}] Chao world ...`;
  }
}

@Service(false)
export class ThirdService {

  @Public()
  @Get('/test')
  public async test(): Promise<string> {
    return 'Test';
  }
}

@Service()
export class ForthService extends ThirdService {

  @Inject(api => DemoApi)
  private demo: DemoApi;

  constructor() {
    super();
    console.log('new', ForthService.name);
  }

  @Override()
  public async test(): Promise<string> {
    return this.demo.hello();
  }

  @Public()
  @Get('/bay')
  public async bay(): Promise<string> {
    return 'Bay';
  }

  @Activate()
  public async activate() {
    console.log('Activate');
  }

  @Release()
  public async release() {
    console.log('Release');
  }
}

async function proxy() {
  // Global proxy
  const demo = new DemoApi();
  const g = await demo.hello();
  console.log(g);

  // Local proxy
  const local = await Core.get(DemoApi);
  const l = await local.hello();
  console.log(l);

  const ins = await Core.get();
  const rr = await ins.invoke(ForthService.name, 'test');
  console.log(rr);
}

if (require.main === module) {
  Core.schema.write('schema/step-7.gql');
  Core.init('Debug', true);
  CoreServer.start(5000);
  console.log(Core.processInfo());
  proxy();
} else {
  Core.init('AWS', true);
}

export const handler = Core.lambda();

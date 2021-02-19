// Inheritance

// tslint:disable-next-line:max-line-length
import { Activate, Any, Api, Body, Command, Context, ContextObject, Core, CoreGraphQL, CoreServer, Field, Get, Handler, HttpRequest, HttpResponse, Input, Override, Post, Public, Query, Release, Schedule, Service, Type, Utils } from 'tyx';

process.env.LOG_LEVEL = 'DEBUG';

@Type()
class CpuUsageInfo {
  @Field(0) user: number;
  @Field(0) system: number;
}

@Type()
class MemoryUsageInfo {
  @Field(0) rss: number;
  @Field(0) heapTotal: number;
  @Field(0) heapUsed: number;
  @Field(0) external: number;
}

@Type()
class ProcessInfo {
  @Field() requestId: string;
  @Field() sourceIp: string;
  @Field(0) pid: number;
  @Field() title: string;
  @Field() cwd: string;
  @Field([String]) argv: string[];
  @Field() arch: string;
  @Field() platform: string;
  @Field() uptime: number;
  @Field(type => CpuUsageInfo) cpuUsage: CpuUsageInfo;
  @Field(type => MemoryUsageInfo) memoryUsage: MemoryUsageInfo;
  @Field(Object) versions: any;
  @Field(Object) config: any;
}

@Input()
class BmiRequest {
  @Field(true) height: number;
  @Field(true) weight: number;
}

@Type()
class BmiRespose {
  @Field(true) height: number;
  @Field(true) weight: number;
  @Field(true) bmi: number;
  @Field(true) timestamp: Date;
}

@Service()
export class SimpleService {
  @Public()
  @Query(String)
  public async hello(): Promise<string> {
    return `[${new Date().toISOString()}] Hello world ...`;
  }
}

@Api()
export abstract class DemoApi {
  @Public()
  @Query(String)
  public async hello(): Promise<string> { throw undefined; }

  @Public()
  @Get('/info')
  @Query(res => ProcessInfo)
  public async info(@ContextObject() ctx: Context): Promise<ProcessInfo> { throw undefined; }

  @Public()
  @Query(Any)
  public async untypedInfo(ctx: Context): Promise<ProcessInfo> { throw undefined; }

  @Public()
  @Post('/bmi')
  @Command(req => BmiRequest, res => BmiRespose)
  public async bmi(@Body() req: BmiRequest): Promise<BmiRespose> { throw undefined; }

  @Schedule()
  public async ping(ctx: Context): Promise<any> { throw undefined; }
}

@Api()
export abstract class ExtendedApi extends DemoApi {
  @Public()
  @Query(String)
  public async chao(): Promise<string> { throw undefined; }

  @Schedule()
  @Query(String)
  public async ping(ctx: Context): Promise<string> { throw undefined; }
}

@Service(ExtendedApi)
export class ImplementationService implements ExtendedApi {

  @Handler()
  public async hello(): Promise<string> {
    return `[${new Date().toISOString()}] Hello world ...`;
  }

  @Handler()
  public async chao(): Promise<string> {
    return `[${new Date().toISOString()}] Chao world ...`;
  }

  @Handler()
  public async info(ctx: Context): Promise<ProcessInfo> {
    Core.schema;
    return {
      requestId: ctx.requestId,
      sourceIp: ctx.sourceIp,

      pid: process.pid,
      title: process.title,
      cwd: process.cwd(),
      argv: process.argv,
      arch: process.arch,
      platform: process.platform,
      uptime: process.uptime(),
      cpuUsage: process.cpuUsage(),
      memoryUsage: process.memoryUsage(),
      versions: process.versions,
      config: process.config
    };
  }

  @Handler()
  public async untypedInfo(ctx: Context): Promise<ProcessInfo> {
    return this.info(ctx);
  }

  @Handler()
  public async bmi(req: BmiRequest): Promise<BmiRespose> {
    const res: BmiRespose = { ...req, bmi: req.weight / req.height ** 2, timestamp: new Date() };
    return res;
  }

  @Handler()
  public async ping() {
    console.log('Ping');
    return `Pong: ${new Date().toISOString()}`;
  }
}

@Service(false)
export class BaseService {
  @Public()
  @Query(String)
  public async hello(): Promise<string> {
    return `[${new Date().toISOString()}] Hello world ...`;
  }

  @Activate()
  public activate() {
    console.log('Activate:', Utils.toString(this));
  }

  @Release()
  public release() {
    console.log('Release:', Utils.toString(this));
  }
}

@Service(true)
export class ChildService extends BaseService {

  @Override()
  public async hello(): Promise<string> {
    return 'xx';
  }

  @Public()
  @Query(String)
  public async hello2(): Promise<string> {
    return `[${new Date().toISOString()}] Hello world ...`;
  }
}

// Core service override
@Service(true)
export class CustomGraphQL extends CoreGraphQL {

  // @Activate()
  // protected async activate(ctx: ResolverContext & Context, req: HttpRequest) {
  //   console.log('Custom activation');
  //   super.activate(ctx, req);
  // }

  @Override()
  @Public()
  public async graphql(ctx: Context, req: HttpRequest): Promise<HttpResponse> {
    return super.process(ctx, req);
  }
}

if (require.main === module) {
  // Core.schema.write('schema/step-6.gql');
  Core.init({ application: 'Debug', crudAllowed: true });
  CoreServer.start(5000);
} else {
  Core.init({ application: 'Debug', crudAllowed: true });
}

export const handler = Core.lambda();

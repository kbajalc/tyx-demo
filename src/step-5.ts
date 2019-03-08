import { Any, Body, Command, Core, Field, Get, Input, Post, Public, Query, Service, Type } from 'tyx';

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
export class DemoService {
  @Public()
  @Get('/hello')
  @Query([void 0], String)
  public hello(): string {
    return `[${new Date().toISOString()}] Hello world ...`;
  }

  @Public()
  @Get('/info')
  @Query([void 0], res => ProcessInfo)
  public info(): ProcessInfo {
    return {
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

  @Public()
  @Query([void 0], Any)
  public untypedInfo(): ProcessInfo {
    return this.info();
  }

  @Public()
  @Post('/bmi')
  @Command(req => BmiRequest, res => BmiRespose)
  public bmi(@Body() req: BmiRequest): BmiRespose {
    const res: BmiRespose = { ...req, bmi: req.weight / req.height ** 2, timestamp: new Date() };
    return res;
  }
}

if (require.main === module) {
  // Core.schema.write('schema/step-5.gql');
  Core.init('Debug', true);
  Core.start(5000);
} else {
  Core.init('AWS', true);
}

export const handler = Core.lambda();

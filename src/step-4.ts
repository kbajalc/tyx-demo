import { Context, Core, CoreServer, Field, Public, Query, Service, Type } from 'tyx';

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

@Service()
export class DemoService {
  @Public()
  @Query(String)
  public hello(): string {
    return `[${new Date().toISOString()}] Hello world ...`;
  }

  @Public()
  @Query(res => ProcessInfo)
  public info(ctx: Context): ProcessInfo {
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
}

if (require.main === module) {
  Core.init('Debug', true);
  CoreServer.start(5000);
} else {
  Core.init('AWS', true);
}

export const handler = Core.lambda();

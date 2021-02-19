import { Any, Context, Core, CoreServer, CtxObject, Public, Query, Service } from 'tyx';

process.env.LOG_LEVEL = 'DEBUG';

interface CpuUsageInfo {
  user: number;
  system: number;
}

interface MemoryUsageInfo {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
}

interface ProcessInfo {
  pid: number;
  title: string;
  cwd: string;
  argv: string[];
  arch: string;
  platform: string;
  uptime: number;
  cpuUsage: CpuUsageInfo;
  memoryUsage: MemoryUsageInfo;
  versions: any;
  config: any;
}

@Service()
export class DemoService {
  @Public()
  @Query(String)
  public hello(): string {
    return `[${new Date().toISOString()}] Hello world ...`;
  }

  @Public()
  @Query(Any)
  public info(@CtxObject() ctx: Context): ProcessInfo {
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
  Core.init({ application: 'Debug', crudAllowed: true });
  CoreServer.start(5000);
} else {
  Core.init({ application: 'AWS', crudAllowed: true });
}

export const handler = Core.lambda();

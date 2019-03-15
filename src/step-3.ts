import { Any, Context, Core, CoreServer, Public, Query, Service } from 'tyx';

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
  @Query([void 0], String)
  public hello(): string {
    return `[${new Date().toISOString()}] Hello world ...`;
  }

  @Public()
  @Query([void 0], Any)
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

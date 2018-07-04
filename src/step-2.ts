import { Any, Context, Core, Public, Query, Service } from 'tyx';

@Service()
export class DemoService {
  @Public()
  @Query([void 0], String)
  public hello(): string {
    return `[${new Date().toISOString()}] Hello world ...`;
  }

  @Public()
  @Query([void 0], Any)
  public info(ctx: Context): any {
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
  Core.start(5000);
} else {
  Core.init('AWS', true);
}

export const handler = Core.lambda();

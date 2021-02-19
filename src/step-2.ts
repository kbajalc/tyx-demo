import { Any, Context, Core, CoreServer, Public, Query, Service } from 'tyx';

process.env.LOG_LEVEL = 'DEBUG';

@Service()
export class DemoService {
  @Public()
  @Query(String)
  public hello(): string {
    return `[${new Date().toISOString()}] Hello world ...`;
  }

  @Public()
  @Query(Any)
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
  Core.init({ application: 'Debug', crudAllowed: true });
  CoreServer.start(5000);
} else {
  Core.init({ application: 'AWS', crudAllowed: true });
}

export const handler = Core.lambda();

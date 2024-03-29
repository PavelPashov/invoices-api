import { Options } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const MikroOrmConfig: Options = {
  entities: [`src/**/*.entity{.ts,.js}`],
  type: 'postgresql',
  dbName: configService.get('POSTGRES_DB'),
  user: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
};

export default MikroOrmConfig;

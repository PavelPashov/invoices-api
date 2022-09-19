import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgresql',
        dbName: configService.get('POSTGRES_DB'),
        user: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        entities: [`${__dirname}/**/*.entity{.ts,.js}`],
        synchronize: true,
        autoLoadEntities: true,
        migrations: {
          path: 'dist/migrations',
          pathTs: 'src/migrations',
        },
      }),
    }),
  ],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { TagModule } from './tag/tag.module';
import { LocationModule } from './location/location.module';
import { PhoneModule } from './phone/phone.module';
import { AuthModule } from './auth/auth.module';
import { HistoryRecordModule } from './history-record/history-record.module';
import { PdfModule } from './pdf/pdf.module';
import * as Joi from 'joi';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        SENDER: Joi.string().required(),
        MAIL_PASS: Joi.string().required(),
      }),
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mail.yahoo.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SENDER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: process.env.SENDER,
      },
      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    DatabaseModule,
    UserModule,
    TagModule,
    LocationModule,
    PhoneModule,
    AuthModule,
    HistoryRecordModule,
    PdfModule,
  ],
})
export class AppModule {}

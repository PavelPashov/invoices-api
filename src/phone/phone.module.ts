import { PdfModule } from './../pdf/pdf.module';
import { HistoryRecordModule } from './../history-record/history-record.module';
import { Module } from '@nestjs/common';
import { PhoneService } from './phone.service';
import { PhoneController } from './phone.controller';
import { Phone } from './phone.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MikroOrmModule.forFeature([Phone]),
    HistoryRecordModule,
    PdfModule,
    ConfigModule,
  ],
  providers: [PhoneService],
  controllers: [PhoneController],
})
export class PhoneModule {}

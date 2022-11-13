import { Module } from '@nestjs/common';
import { HistoryRecordService } from './history-record.service';
import { HistoryRecordController } from './history-record.controller';
import { HistoryRecord } from './history-record.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([HistoryRecord])],
  providers: [HistoryRecordService],
  controllers: [HistoryRecordController],
  exports: [HistoryRecordService],
})
export class HistoryRecordModule {}

import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Phone } from 'src/phone/phone.entity';
import { HistoryRecord } from './history-record.entity';

@Injectable()
export class HistoryRecordService {
  constructor(
    @InjectRepository(HistoryRecord)
    private readonly historyRecordRepository: EntityRepository<HistoryRecord>,
  ) {}

  async create(data: Partial<HistoryRecord>): Promise<HistoryRecord> {
    const newRecord = await this.historyRecordRepository.create(data);
    await this.historyRecordRepository.persistAndFlush(newRecord);
    return newRecord;
  }

  async createMany(calculatedPhones: Phone[]) {
    await Promise.all(
      calculatedPhones.map((phone) => {
        return this.create({
          phone,
          charge: Number(phone.price),
          date: new Date(),
        });
      }),
    );
  }

  async hasRecordedMonth(date: Date): Promise<boolean> {
    const lastRecord = await this.historyRecordRepository.findOne(
      { id: { $gt: -1 } },
      { orderBy: { date: QueryOrder.DESC } },
    );

    if (!lastRecord) {
      return false;
    }

    const lastDate = new Date(lastRecord.date);

    if (
      lastDate.getFullYear() === date.getFullYear() &&
      lastDate.getMonth() === date.getMonth()
    ) {
      return true;
    }
    return false;
  }
}

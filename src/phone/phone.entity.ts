import { HistoryRecord } from './../history-record/history-record.entity';
import {
  Entity,
  Property,
  PrimaryKey,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { Location } from '../location/location.entity';
import { Tag } from '../tag/tag.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class Phone {
  @ApiProperty()
  @PrimaryKey()
  id: number;

  @ApiProperty()
  @Property()
  number: string;

  @ApiProperty()
  @Property()
  name: string;

  @ApiPropertyOptional()
  @ManyToOne({ entity: () => Tag, nullable: true })
  tag?: Tag;

  @ApiPropertyOptional()
  @ManyToOne({ entity: () => Location, nullable: true })
  location?: Location;

  @ApiProperty()
  @OneToMany(
    () => HistoryRecord,
    (historyRecord: HistoryRecord) => historyRecord.phone,
  )
  numbers = new Collection<HistoryRecord>(this);

  price?: string;

  invoice?: string;
}

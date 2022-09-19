import { Tag } from './tag.entity';
import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}

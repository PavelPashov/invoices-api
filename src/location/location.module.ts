import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { Location } from './location.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Location])],
  providers: [LocationService],
  controllers: [LocationController],
})
export class LocationModule {}

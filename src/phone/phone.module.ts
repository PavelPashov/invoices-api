import { Module } from '@nestjs/common';
import { PhoneService } from './phone.service';
import { PhoneController } from './phone.controller';
import { Phone } from './phone.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Phone])],
  providers: [PhoneService],
  controllers: [PhoneController],
})
export class PhoneModule {}

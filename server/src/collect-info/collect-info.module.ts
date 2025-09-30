import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectInfoService } from './collect-info.service';
import { CollectInfoController } from './collect-info.controller';
import { CollectInfo, CollectInfoSchema } from './schemas/collect-info.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CollectInfo.name, schema: CollectInfoSchema },
    ]),
  ],
  controllers: [CollectInfoController],
  providers: [CollectInfoService],
  exports: [CollectInfoService],
})
export class CollectInfoModule {}

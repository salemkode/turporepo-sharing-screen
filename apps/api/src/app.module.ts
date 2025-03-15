import { Module } from '@nestjs/common';
import { SignalingModule } from './signaling/signaling.module';

@Module({
  imports: [SignalingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

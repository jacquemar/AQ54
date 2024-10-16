import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { StationController } from './station.controller'; 
import { AirQinoService } from './airqino.service';
import { DatabaseService } from './database.service';


@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [StationController],
  providers: [AirQinoService, DatabaseService], 
})
export class AirqinoModule {}

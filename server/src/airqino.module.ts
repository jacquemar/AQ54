import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { StationController } from './station.controller'; 
import { AirQinoService } from './airqino.service';
import { DatabaseService } from './database.service';
import { UsersModule } from './users/users.module';


@Module({
  imports: [HttpModule, ConfigModule, UsersModule],
  controllers: [StationController],
  providers: [AirQinoService, DatabaseService], 
})
export class AirqinoModule {}

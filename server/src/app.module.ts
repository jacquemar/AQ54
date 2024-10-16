import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AirqinoModule } from './airqino.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirQinoService } from './airqino.service';
import { DatabaseService } from './database.service';


@Module({
  imports: [AirqinoModule,
            ConfigModule.forRoot(),
            HttpModule,],
  controllers: [AppController],
  providers: [AppService, AirQinoService, DatabaseService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AirqinoModule } from './airqino.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirQinoService } from './airqino.service';
import { DatabaseService } from './database.service';
import { User } from './users/entities/user.entity';



@Module({
  imports: [AirqinoModule,
            ConfigModule.forRoot(),
            HttpModule,
            TypeOrmModule.forRootAsync({
              imports: [ConfigModule],
              useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.get('DATABASE_URL'),
                entities: [User],
                synchronize: configService.get('NODE_ENV') !== 'production', 
                ssl: {
                  rejectUnauthorized: false, 
                },
              }),
              inject: [ConfigService],
            }),
            UsersModule,],
  controllers: [AppController],
  providers: [AppService, AirQinoService, DatabaseService],
})
export class AppModule {}

import { Controller, Get, Query, Param, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AirQinoService } from './airqino.service'; 
import { DatabaseService } from './database.service';

@Controller('stations')
export class StationController {
  private readonly logger = new Logger(StationController.name);

  constructor(
    private readonly airQinoService: AirQinoService,
    private readonly databaseService: DatabaseService
  ) {}

  @Get(':stationName/current')
  async getCurrentValues(@Param('stationName') stationName: string) {
    try {
      const data = await this.airQinoService.getCurrentValues(stationName);
      return data;
    } catch (error) {
      this.logger.error(`Erreur de recuperation des donnes de ${stationName}: ${error.message}`);
      throw new HttpException('echec de recuperation des données', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':stationName/alldata')
  async getTemperature(
    @Param('stationName') stationName: string,
    @Query('aggregation') aggregation: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    try {
      if (aggregation === 'hour') {
        return await this.databaseService.getHourlyData(stationName, startDate, endDate);
      } else if (aggregation === 'day') {
        return await this.databaseService.getDailyData(stationName, startDate, endDate);
      } else {
        throw new HttpException('Type non valide', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      this.logger.error(`Erreur de recuperation de la station ${stationName}: ${error.message}`);
      throw new HttpException('echec de recuperation des données', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('monthly-averages')
  async getMonthlyAverages() {
    return await this.airQinoService.getAveragesForStations();
  }

  @Get('current-month')
async getCurrentMonthData(@Query('stations') stations: string) {
    if (!stations) {
        throw new Error("Aucune station spécifiée");
    }

    const stationArray = stations;
    return await this.airQinoService.getCurrentMonthData(stationArray);
}


}
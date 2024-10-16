import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { DatabaseService } from './database.service';
import * as cron from 'node-cron';
import { addDays, format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class AirQinoService {
  private readonly logger = new Logger(AirQinoService.name);
  private stationNames = ['SMART188', 'SMART189'];
  
  constructor(
    private readonly httpService: HttpService,
    private readonly databaseService: DatabaseService
  ) {}

  public async getCurrentValues(stationName: string): Promise<any> {
    try {
      const url = `https://airqino-api.magentalab.it/getCurrentValues/${stationName}`;
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des données pour ${stationName}: ${error.message}`);
      throw error;
    }
  }

  private async recordStationData(stationName: string): Promise<void> {
    try {
      const data = await this.getCurrentValues(stationName);
      await this.databaseService.insertSensorData(stationName, data.timestamp, data.values);
      this.logger.log(`Données enregistrées pour la station: ${stationName}`);
    } catch (error) {
      this.logger.error(`Échec de l'enregistrement des données pour ${stationName}: ${error.message}`);
    }
  }

  onModuleInit() {
    // Programmer l'enregistrement des données toutes les heures
    cron.schedule('0 * * * *', async () => {
      this.logger.log('Début de l\'enregistrement horaire des données');
      //exécuter les appels de manière parallèle
      await Promise.all(
        this.stationNames.map(stationName => this.recordStationData(stationName))
      );
  
      this.logger.log('Fin de l\'enregistrement horaire des données');
    });
  }
  

  async getAggregatedData(stationName: string, aggregation: string, startDate: string, endDate: string) {
    if (aggregation === 'day') {
      // Agrégation journalière
      return await this.databaseService.getDailyData(stationName, startDate, endDate);
    } else {
      // Agrégation horaire (par défaut)
      return await this.databaseService.getHourlyData(stationName, startDate, endDate);
    }
  }

  // Calcul des plages de dates pour le mois passé et le mois en cours
  private getDateRanges() {
    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = new Date(); // Aujourd'hui

    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    return {
      currentMonthStart: format(currentMonthStart, 'yyyy-MM-dd'),
      currentMonthEnd: format(currentMonthEnd, 'yyyy-MM-dd'),
      lastMonthStart: format(lastMonthStart, 'yyyy-MM-dd'),
      lastMonthEnd: format(lastMonthEnd, 'yyyy-MM-dd'),
    };
  }

  // Méthode pour obtenir les moyennes mensuelles
  async getMonthlyAverages(stationName: string) {
    const { currentMonthStart, currentMonthEnd, lastMonthStart, lastMonthEnd } = this.getDateRanges();

    // Moyenne du mois passé
    const lastMonthData = await this.databaseService.getMonthlyData(stationName, lastMonthStart, lastMonthEnd);

    // Moyenne du mois en cours
    const currentMonthData = await this.databaseService.getMonthlyData(stationName, currentMonthStart, currentMonthEnd);

    return {
      lastMonth: lastMonthData,
      currentMonth: currentMonthData,
    };
  }

  // Exemple d'utilisation pour récupérer les moyennes pour chaque station
  async getAveragesForStations() {
    const stations = ['SMART188', 'SMART189'];
    
    const stationAverages = await Promise.all(
      stations.map(async stationName => ({
        stationName,
        data: await this.getMonthlyAverages(stationName),
      }))
    );

    return stationAverages;
  }

  async getCurrentMonthData(stationNames: string) {
    return await this.databaseService.getCurrentMonthData(stationNames);
}



}
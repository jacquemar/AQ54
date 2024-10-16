"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AirQinoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirQinoService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const database_service_1 = require("./database.service");
const cron = require("node-cron");
const date_fns_1 = require("date-fns");
let AirQinoService = AirQinoService_1 = class AirQinoService {
    constructor(httpService, databaseService) {
        this.httpService = httpService;
        this.databaseService = databaseService;
        this.logger = new common_1.Logger(AirQinoService_1.name);
        this.stationNames = ['SMART188', 'SMART189'];
    }
    async getCurrentValues(stationName) {
        try {
            const url = `https://airqino-api.magentalab.it/getCurrentValues/${stationName}`;
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(url));
            return response.data;
        }
        catch (error) {
            this.logger.error(`Erreur lors de la récupération des données pour ${stationName}: ${error.message}`);
            throw error;
        }
    }
    async recordStationData(stationName) {
        try {
            const data = await this.getCurrentValues(stationName);
            await this.databaseService.insertSensorData(stationName, data.timestamp, data.values);
            this.logger.log(`Données enregistrées pour la station: ${stationName}`);
        }
        catch (error) {
            this.logger.error(`Échec de l'enregistrement des données pour ${stationName}: ${error.message}`);
        }
    }
    onModuleInit() {
        cron.schedule('0 * * * *', async () => {
            this.logger.log('Début de l\'enregistrement horaire des données');
            await Promise.all(this.stationNames.map(stationName => this.recordStationData(stationName)));
            this.logger.log('Fin de l\'enregistrement horaire des données');
        });
    }
    async getAggregatedData(stationName, aggregation, startDate, endDate) {
        if (aggregation === 'day') {
            return await this.databaseService.getDailyData(stationName, startDate, endDate);
        }
        else {
            return await this.databaseService.getHourlyData(stationName, startDate, endDate);
        }
    }
    getDateRanges() {
        const currentMonthStart = (0, date_fns_1.startOfMonth)(new Date());
        const currentMonthEnd = new Date();
        const lastMonthStart = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(new Date(), 1));
        const lastMonthEnd = (0, date_fns_1.endOfMonth)((0, date_fns_1.subMonths)(new Date(), 1));
        return {
            currentMonthStart: (0, date_fns_1.format)(currentMonthStart, 'yyyy-MM-dd'),
            currentMonthEnd: (0, date_fns_1.format)(currentMonthEnd, 'yyyy-MM-dd'),
            lastMonthStart: (0, date_fns_1.format)(lastMonthStart, 'yyyy-MM-dd'),
            lastMonthEnd: (0, date_fns_1.format)(lastMonthEnd, 'yyyy-MM-dd'),
        };
    }
    async getMonthlyAverages(stationName) {
        const { currentMonthStart, currentMonthEnd, lastMonthStart, lastMonthEnd } = this.getDateRanges();
        const lastMonthData = await this.databaseService.getMonthlyData(stationName, lastMonthStart, lastMonthEnd);
        const currentMonthData = await this.databaseService.getMonthlyData(stationName, currentMonthStart, currentMonthEnd);
        return {
            lastMonth: lastMonthData,
            currentMonth: currentMonthData,
        };
    }
    async getAveragesForStations() {
        const stations = ['SMART188', 'SMART189'];
        const stationAverages = await Promise.all(stations.map(async (stationName) => ({
            stationName,
            data: await this.getMonthlyAverages(stationName),
        })));
        return stationAverages;
    }
    async getCurrentMonthData(stationNames) {
        return await this.databaseService.getCurrentMonthData(stationNames);
    }
};
exports.AirQinoService = AirQinoService;
exports.AirQinoService = AirQinoService = AirQinoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        database_service_1.DatabaseService])
], AirQinoService);
//# sourceMappingURL=airqino.service.js.map
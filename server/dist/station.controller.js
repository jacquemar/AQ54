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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var StationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StationController = void 0;
const common_1 = require("@nestjs/common");
const airqino_service_1 = require("./airqino.service");
const database_service_1 = require("./database.service");
let StationController = StationController_1 = class StationController {
    constructor(airQinoService, databaseService) {
        this.airQinoService = airQinoService;
        this.databaseService = databaseService;
        this.logger = new common_1.Logger(StationController_1.name);
    }
    async getCurrentValues(stationName) {
        try {
            const data = await this.airQinoService.getCurrentValues(stationName);
            return data;
        }
        catch (error) {
            this.logger.error(`Erreur de recuperation des donnes de ${stationName}: ${error.message}`);
            throw new common_1.HttpException('echec de recuperation des données', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getTemperature(stationName, aggregation, startDate, endDate) {
        try {
            if (aggregation === 'hour') {
                return await this.databaseService.getHourlyData(stationName, startDate, endDate);
            }
            else if (aggregation === 'day') {
                return await this.databaseService.getDailyData(stationName, startDate, endDate);
            }
            else {
                throw new common_1.HttpException('Type non valide', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            this.logger.error(`Erreur de recuperation de la station ${stationName}: ${error.message}`);
            throw new common_1.HttpException('echec de recuperation des données', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getMonthlyAverages() {
        return await this.airQinoService.getAveragesForStations();
    }
    async getCurrentMonthData(stations) {
        if (!stations) {
            throw new Error("Aucune station spécifiée");
        }
        const stationArray = stations;
        return await this.airQinoService.getCurrentMonthData(stationArray);
    }
};
exports.StationController = StationController;
__decorate([
    (0, common_1.Get)(':stationName/current'),
    __param(0, (0, common_1.Param)('stationName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StationController.prototype, "getCurrentValues", null);
__decorate([
    (0, common_1.Get)(':stationName/alldata'),
    __param(0, (0, common_1.Param)('stationName')),
    __param(1, (0, common_1.Query)('aggregation')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], StationController.prototype, "getTemperature", null);
__decorate([
    (0, common_1.Get)('monthly-averages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StationController.prototype, "getMonthlyAverages", null);
__decorate([
    (0, common_1.Get)('current-month'),
    __param(0, (0, common_1.Query)('stations')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StationController.prototype, "getCurrentMonthData", null);
exports.StationController = StationController = StationController_1 = __decorate([
    (0, common_1.Controller)('stations'),
    __metadata("design:paramtypes", [airqino_service_1.AirQinoService,
        database_service_1.DatabaseService])
], StationController);
//# sourceMappingURL=station.controller.js.map
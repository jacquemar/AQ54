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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const serverless_1 = require("@neondatabase/serverless");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const date_fns_1 = require("date-fns");
let DatabaseService = class DatabaseService {
    constructor(configService) {
        this.configService = configService;
        const databaseUrl = this.configService.get('DATABASE_URL');
        this.sql = (0, serverless_1.neon)(databaseUrl);
    }
    truncateToMinute(timestamp) {
        const date = new Date(timestamp);
        return (0, date_fns_1.format)(date, 'yyyy-MM-dd HH:mm:00');
    }
    async dataExists(stationName, timestamp) {
        const result = await this.sql `
            SELECT COUNT(*) AS count
            FROM air_quality_data
            WHERE station_name = ${stationName} AND timestamp = ${timestamp}
        `;
        return result[0]?.count > 0;
    }
    async insertSensorData(stationName, timestamp, values) {
        const truncatedTimestamp = this.truncateToMinute(timestamp);
        const exists = await this.dataExists(stationName, truncatedTimestamp);
        if (!exists) {
            await this.sql `INSERT INTO air_quality_data (station_name, timestamp, extT, rh, o3, no2, co, pm25, pm10) VALUES (
                ${stationName}, 
                ${truncatedTimestamp}, 
                ${values.find(v => v.sensor === 'extT')?.value}, 
                ${values.find(v => v.sensor === 'rh')?.value}, 
                ${values.find(v => v.sensor === 'o3')?.value}, 
                ${values.find(v => v.sensor === 'no2')?.value}, 
                ${values.find(v => v.sensor === 'co')?.value}, 
                ${values.find(v => v.sensor === 'pm25')?.value}, 
                ${values.find(v => v.sensor === 'pm10')?.value}
            )`;
        }
        else {
            console.log(`Les données pour ${stationName} à ${truncatedTimestamp} existent déjà. Pas d'insertion.`);
        }
    }
    async getHourlyData(stationName, startDate, endDate) {
        return await this.sql `
        SELECT 
            date_trunc('hour', timestamp) AS hour, 
            AVG(extT) AS avg_temperature,
            AVG(rh) AS rh_pourcentage,
            AVG(o3) AS o3_niveau,
            AVG(no2) AS no2_niveau,
            AVG(pm25) AS pm25_niveau,
            AVG(pm10) AS pm10_niveau 
        FROM air_quality_data 
        WHERE station_name = ${stationName}
        AND timestamp >= ${startDate}::timestamp
        AND timestamp < ${endDate}::timestamp
        GROUP BY hour
        ORDER BY hour ASC
    `;
    }
    async getDailyData(stationName, startDate, endDate) {
        return await this.sql `
        SELECT 
            date_trunc('day', timestamp) AS day, 
            AVG(extT) AS avg_temperature,
            AVG(rh) AS rh_pourcentage,
            AVG(o3) AS o3_niveau,
            AVG(no2) AS no2_niveau,
            AVG(pm25) AS pm25_niveau,
            AVG(pm10) AS pm10_niveau   
        FROM air_quality_data 
        WHERE station_name = ${stationName}
        AND timestamp >= ${startDate}::timestamp
        AND timestamp < ${endDate}::timestamp
        GROUP BY day
        ORDER BY day ASC
    `;
    }
    async getMonthlyData(stationName, startDate, endDate) {
        return await this.sql `
        SELECT 
            AVG(extT) AS avg_temperature,
            AVG(rh) AS avg_rh,
            AVG(o3) AS avg_o3,
            AVG(no2) AS avg_no2,
            AVG(pm25) AS avg_pm25,
            AVG(pm10) AS avg_pm10   
        FROM air_quality_data 
        WHERE station_name = ${stationName}
        AND timestamp >= ${startDate}::timestamp
        AND timestamp < ${endDate}::timestamp
    `;
    }
    async getCurrentMonthData(stationNames) {
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString();
        const results = await this.sql `
        SELECT 
            station_name,
            timestamp,
            extT,
            rh,
            o3,
            no2,
            pm25,
            pm10
        FROM air_quality_data 
        WHERE station_name = ${stationNames}
        AND timestamp >= ${startDate}::timestamp
        AND timestamp < ${endDate}::timestamp
        ORDER BY timestamp DESC
    `;
        return results;
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseService);
//# sourceMappingURL=database.service.js.map
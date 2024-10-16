import { AirQinoService } from './airqino.service';
import { DatabaseService } from './database.service';
export declare class StationController {
    private readonly airQinoService;
    private readonly databaseService;
    private readonly logger;
    constructor(airQinoService: AirQinoService, databaseService: DatabaseService);
    getCurrentValues(stationName: string): Promise<any>;
    getTemperature(stationName: string, aggregation: string, startDate: string, endDate: string): Promise<any>;
    getMonthlyAverages(): Promise<{
        stationName: string;
        data: {
            lastMonth: any;
            currentMonth: any;
        };
    }[]>;
    getCurrentMonthData(stations: string): Promise<any>;
}

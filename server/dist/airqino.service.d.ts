import { HttpService } from '@nestjs/axios';
import { DatabaseService } from './database.service';
export declare class AirQinoService {
    private readonly httpService;
    private readonly databaseService;
    private readonly logger;
    private stationNames;
    constructor(httpService: HttpService, databaseService: DatabaseService);
    getCurrentValues(stationName: string): Promise<any>;
    private recordStationData;
    onModuleInit(): void;
    getAggregatedData(stationName: string, aggregation: string, startDate: string, endDate: string): Promise<any>;
    private getDateRanges;
    getMonthlyAverages(stationName: string): Promise<{
        lastMonth: any;
        currentMonth: any;
    }>;
    getAveragesForStations(): Promise<{
        stationName: string;
        data: {
            lastMonth: any;
            currentMonth: any;
        };
    }[]>;
    getCurrentMonthData(stationNames: string): Promise<any>;
}

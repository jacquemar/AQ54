import { ConfigService } from '@nestjs/config';
export declare class DatabaseService {
    private configService;
    private readonly sql;
    constructor(configService: ConfigService);
    private truncateToMinute;
    private dataExists;
    insertSensorData(stationName: string, timestamp: string, values: any[]): Promise<void>;
    getHourlyData(stationName: string, startDate: string, endDate: string): Promise<any>;
    getDailyData(stationName: string, startDate: string, endDate: string): Promise<any>;
    getMonthlyData(stationName: string, startDate: string, endDate: string): Promise<any>;
    getCurrentMonthData(stationNames: string): Promise<any>;
}

import { neon } from '@neondatabase/serverless';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';

@Injectable()
export class DatabaseService {
    private readonly sql;

    constructor(private configService: ConfigService) {
        const databaseUrl = this.configService.get('DATABASE_URL');
        this.sql = neon(databaseUrl);
    }

    // Fonction pour tronquer le timestamp à la minute
    private truncateToMinute(timestamp: string): string {
        const date = new Date(timestamp);
        return format(date, 'yyyy-MM-dd HH:mm:00'); 
    }

    // Méthode pour vérifier si les données existent déjà
    private async dataExists(stationName: string, timestamp: string): Promise<boolean> {
        const result = await this.sql`
            SELECT COUNT(*) AS count
            FROM air_quality_data
            WHERE station_name = ${stationName} AND timestamp = ${timestamp}
        `;
        return result[0]?.count > 0; // Renvoie true si des données existent
    }

    // Méthode pour enregistrer les données dans la base de données
    async insertSensorData(stationName: string, timestamp: string, values: any[]) {
        const truncatedTimestamp = this.truncateToMinute(timestamp); // Tronquer le timestamp
    
        const exists = await this.dataExists(stationName, truncatedTimestamp);
    
        if (!exists) {
            await this.sql`INSERT INTO air_quality_data (station_name, timestamp, extT, rh, o3, no2, co, pm25, pm10) VALUES (
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
        } else {
            console.log(`Les données pour ${stationName} à ${truncatedTimestamp} existent déjà. Pas d'insertion.`);
        }
    }

   // Agrégation des températures par heure
   async getHourlyData(stationName: string, startDate: string, endDate: string) {
    return await this.sql`
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

// Méthode d'agrégation journalière
async getDailyData(stationName: string, startDate: string, endDate: string) {
    return await this.sql`
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

// Méthode d'agrégation mensuelle
async getMonthlyData(stationName: string, startDate: string, endDate: string) {
    return await this.sql`
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

async getCurrentMonthData(stationNames: string) {
    const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(); // 1er jour du mois actuel
    const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(); // 1er jour du mois suivant

    const results = await this.sql`
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

    return results; // Renvoie les résultats directement
}

}

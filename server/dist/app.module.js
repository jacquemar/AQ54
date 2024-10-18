"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const airqino_module_1 = require("./airqino.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const airqino_service_1 = require("./airqino.service");
const database_service_1 = require("./database.service");
const user_entity_1 = require("./users/entities/user.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [airqino_module_1.AirqinoModule,
            config_1.ConfigModule.forRoot(),
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    url: configService.get('DATABASE_URL'),
                    entities: [user_entity_1.User],
                    synchronize: configService.get('NODE_ENV') !== 'production',
                    ssl: {
                        rejectUnauthorized: false,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, airqino_service_1.AirQinoService, database_service_1.DatabaseService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
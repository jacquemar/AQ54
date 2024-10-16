"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirqinoModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("@nestjs/axios");
const station_controller_1 = require("./station.controller");
const airqino_service_1 = require("./airqino.service");
const database_service_1 = require("./database.service");
let AirqinoModule = class AirqinoModule {
};
exports.AirqinoModule = AirqinoModule;
exports.AirqinoModule = AirqinoModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, config_1.ConfigModule],
        controllers: [station_controller_1.StationController],
        providers: [airqino_service_1.AirQinoService, database_service_1.DatabaseService],
    })
], AirqinoModule);
//# sourceMappingURL=airqino.module.js.map
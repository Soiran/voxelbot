/**
 * Объект конфигурации используется для глобальной настройки бота.
 */
import * as fs from "fs";


interface Config {
    token: string
};
export const config: Config = JSON.parse(fs.readFileSync('../config.json').toString());
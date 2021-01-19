import * as fs from 'fs';
import { Config } from './interfaces/config';
import { Data } from './utils/data';


export const config : Config = JSON.parse(fs.readFileSync('./config.json').toString());
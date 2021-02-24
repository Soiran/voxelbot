import * as fs from 'fs';
import { Config } from './types/config';
import { Data } from './utils/data';


export const config : Config = JSON.parse(fs.readFileSync('./config.json').toString());
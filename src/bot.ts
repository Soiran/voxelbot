import { Logger } from './util/cl';
import { client } from './discord';


const debug = new Logger('Bot');


client.on('ready', () => {
    debug.log('Ready', 'info');
})
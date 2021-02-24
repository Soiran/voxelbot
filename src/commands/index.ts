import chatCommands from './chat';
import permissionsCommands from './permissions';
import toolsCommands from './tools';


export const commands = [
    ...chatCommands,
    ...permissionsCommands,
    ...toolsCommands
]
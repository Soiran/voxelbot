import { tagsDatabase } from './../connections/tags';


export function setTag(name: string, channelId: string, messageId: string) {
    tagsDatabase.set(name, {
        channel_id: channelId,
        message_id: messageId
    });
}

export function tagExist(name: string) : boolean {
    return tagsDatabase.exists(name);
}

export function getTagInfo(name: string) {
    return tagsDatabase.get(name);
}

export function removeTag(name: string) {
    tagsDatabase.delete(name);
}
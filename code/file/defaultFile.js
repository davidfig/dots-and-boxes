import cuid from 'cuid'

import { settings } from '../settings'

export function defaultFile(save) {
    return {
        version: settings.storageVersion,
        sound: save ? save.sound : 1,
        user: cuid(),
        level: 0,
        items: [],
    }
}
import localforage from 'localforage'
import Encrypt from './encrypt'

import { defaultFile } from './defaultFile'
import { settings } from '../settings'

class File {
    init() {
        return new Promise(resolve => {
            localforage.config({ name: settings.name, storeName: settings.name })
            if (settings.clearStorage) {
                localforage.clear()
                this.erase()
                resolve()
            } else {
                localforage.getItem('data', (_, saved) => {
                    if (saved) {
                        try {
                            this.data = JSON.parse(Encrypt.decrypt(saved, settings.encrypt))
                            if (this.data.version !== settings.storageVersion) {
                                this.upgradeStorage()
                            }
                            resolve()
                        } catch (e) {
                            console.warn('erasing storage because of error in file...', e)
                            this.erase()
                            resolve()
                        }
                    } else {
                        this.erase()
                        resolve()
                    }
                })
            }
        })
    }

    get(name) {
        return this.data[name]
    }
    set(name, value) {
        this.data[name] = value
        this.save()
    }

    async erase() {
        this.data = defaultFile()
        await this.save()
    }

    async save() {
        return new Promise(resolve => {
            localforage.setItem('data', Encrypt.encrypt(JSON.stringify(this.data), settings.encrypt), resolve)
        })
    }

    upgradeStorage() {
        this.erase()
    }
}

export const file = new File()
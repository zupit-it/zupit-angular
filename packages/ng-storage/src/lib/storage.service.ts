import { Inject, Injectable, InjectionToken } from '@angular/core'

export const STORAGE = new InjectionToken<Storage>('Storage')

export class StorageService implements Storage {
  get length() {
    return this.storage.length
  }

  constructor(@Inject(STORAGE) private storage: Storage) {}

  clear() {
    this.storage.clear()
  }

  getItem(key: string) {
    return this.storage.getItem(key)
  }

  key(index: number) {
    return this.storage.key(index)
  }

  removeItem(key: string) {
    this.storage.removeItem(key)
  }

  setItem(key: string, value: string) {
    this.storage.setItem(key, value)
  }
}

export const LOCAL_STORAGE = new InjectionToken<Storage>('Local Storage', {
  providedIn: 'root',
  factory: () => localStorage
})

@Injectable({
  providedIn: 'root',
  deps: [LOCAL_STORAGE]
})
export class LocalStorageService extends StorageService {
  constructor(@Inject(LOCAL_STORAGE) storage: Storage) {
    super(storage)
  }
}

export const SESSION_STORAGE = new InjectionToken<Storage>('Session Storage', {
  providedIn: 'root',
  factory: () => sessionStorage
})

@Injectable({
  providedIn: 'root',
  deps: [SESSION_STORAGE]
})
export class SessionStorageService extends StorageService {
  constructor(@Inject(SESSION_STORAGE) storage: Storage) {
    super(storage)
  }
}

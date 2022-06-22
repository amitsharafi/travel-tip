import { storageService } from './storage-service.js'
import { utilService } from './util-service.js'

export const locService = {
  getLocs,
  createLocation,
  getLocations,
  locDelete,
}

const STORAGE_KEY = 'locations'
const locs = [
  {
    id: utilService.makeId(),
    name: 'Greatplace',
    lat: 32.047104,
    lng: 34.832384,
    createdAt: Date.now(),
  },
  {
    id: utilService.makeId(),
    name: 'Neveragain',
    lat: 32.047201,
    lng: 34.832581,
    createdAt: Date.now(),
  },
]

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs)
    }, 2000)
  })
}

function getLocations() {
  return locs
}

function createLocation(name, lat, lng) {
  const location = {
    id: utilService.makeId(),
    name,
    lat,
    lng,
    createdAt: Date.now(),
  }
  locs.push(location)
  storageService.saveToStorage(STORAGE_KEY, locs)
}

function locDelete(locIdx) {
  locs.splice(locIdx, 1)
  storageService.saveToStorage(STORAGE_KEY, locs)
}

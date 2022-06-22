import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
export const appController = {
  renderLocations,
}

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onLocDelete = onLocDelete
window.onLocationSearch = onLocationSearch

function onInit() {
  renderLocations()
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready')
    })
    .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos')
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker() {
  console.log('Adding a marker')
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs)
    document.querySelector('.locs').innerText = JSON.stringify(locs)
  })
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      mapService.panTo(pos.coords.latitude, pos.coords.longitude)
      console.log('User position is:', pos.coords)
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
    })
    .catch((err) => {
      console.log('err!!!', err)
    })
}
function onPanTo(lat, lng) {
  mapService.panTo(lat, lng)
}

function renderLocations() {
  const locs = locService.getLocations()
  const strHTML = locs.map((loc, idx) => {
    return `<div class="location">
    <p>${loc.name}</p>
    <p>coordinates: ${loc.lat}, ${loc.lng}</p>
    <p>createdAt: ${loc.createdAt}</p>
    <button onclick="onPanTo(${loc.lat}, ${loc.lng})">Go</button>
    <button onclick="onLocDelete(${idx})">Delete</button>
    </div>`
  })
  document.querySelector('.location-table').innerHTML = strHTML.join('')
}

function onLocDelete(locIdx) {
  locService.locDelete(locIdx)
  renderLocations()
}

function onLocationSearch(ev) {
  ev.preventDefault()
  const loc = document.querySelector('.location-search').value
  if (!value) return
  mapService.locationSearch(loc).then((locObj) => {
    const lat = locObj.results[0].geometry.location.lat
    const lng = locObj.results[0].geometry.location.lng
    locService.createLocation(loc, lat, lng)
    mapService.panTo(lat, lng)
    renderLocations()
  })
}

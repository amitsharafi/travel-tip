import { locService } from './loc.service.js'
import { appController } from '../app.controller.js'

export const mapService = {
  initMap,
  addMarker,
  panTo,
  locationSearch,
}

var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap')
  return _connectGoogleApi().then(() => {
    console.log('google available')
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    })
    console.log('Map!', gMap)
    addMapListeners()
  })
}

function addMapListeners() {
  gMap.addListener('click', (mapsMouseEvent) => onAddLocation(mapsMouseEvent))
}

function onAddLocation(mapsMouseEvent) {
  const lat = mapsMouseEvent.latLng.lat()
  const lng = mapsMouseEvent.latLng.lng()
  const pos = { lat, lng }
  const name = prompt('Enter location name')
  if (!name) return
  addMarker(pos)
  locService.createLocation(name, lat, lng)
  appController.renderLocations()
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  })
  return marker
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve()
  const API_KEY = 'AIzaSyB5FwdmnhjzNyrgGOUr-XzIhoUUnPKFX_U' //TODO: Enter your API Key
  var elGoogleApi = document.createElement('script')
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
  elGoogleApi.async = true
  document.body.append(elGoogleApi)

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve
    elGoogleApi.onerror = () => reject('Google script failed to load')
  })
}

function locationSearch(loc) {
  const API_KEY = 'AIzaSyB5FwdmnhjzNyrgGOUr-XzIhoUUnPKFX_U'
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${loc}&key=${API_KEY}`
  return axios.get(url).then((res) => res.data)
}

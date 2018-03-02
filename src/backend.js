import { request } from 'graphql-request'
import rename from './rename'
import { wgs84ToUtm33, createBboxFromPoint } from './projection'

class Backend {
  static async postFilterPromise(url, filter) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filter),
      })
        .then(result => result.json())
        .then(json => resolve(json))
    })
  }

  static async getPromise(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(result => {
          return result.json()
        })
        .then(json => resolve(json))
        .catch(err => {
          console.error(url, err)
          return {}
        })
    })
  }

  static async getTextPromise(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(result => {
          return result.text()
        })
        .then(text => resolve(text))
        .catch(err => {
          console.error(url, err)
          return {}
        })
    })
  }

  static async getToken() {
    return this.getPromise(`https://www.norgeskart.no/ws/gkt.py`)
  }

  static async loadTaxonTree(taxonId) {
    const taxonTreeQuery = `
        query treeNodes($ids: [Int]!) {
            taxonTreeNodes(taxonIds: $ids) {
            id
            #count
            popularName
            scientificName
            scientificNameAuthor
            parentId
            children {
              id
            #count
              aggreggatedCount
            #parentId
              scientificName
            #scientificNameAuthor
              popularName
            }
          }
        }`
    const variables = {
      ids: [taxonId],
    }

    return new Promise((resolve, reject) => {
      request(
        '//ogapi.artsdatabanken.no/graph',
        //"https://adb-og-api.azurewebsites.net/graph",
        taxonTreeQuery,
        variables
      )
        .then(json => resolve(json))
        .then(json => rename(json))
    })
  }

  static async searchTaxons(searchStr) {
    return new Promise((resolve, reject) => {
      fetch(
        `https://artskart.artsdatabanken.no/appapi/api/data/SearchTaxons?maxCount=15&name=${searchStr}`
      )
        .then(result => result.json())
        .then(json => resolve(json))
    })
  }

  static async søkKode(q) {
    return this.getPromise(
      `https://ninmemapi.artsdatabanken.no/v2/Koder?q=${q}`
    )
  }

  static async hentKode(kode, bounds) {
    let bbox = ''
    if (bounds) {
      var ll = wgs84ToUtm33(bounds._sw.lng, bounds._sw.lat)
      var ur = wgs84ToUtm33(bounds._ne.lng, bounds._ne.lat)
      bbox = `&bbox=${ll.x},${ll.y},${ur.x},${ur.y}`
    }
    const url = `https://ninmemapi.artsdatabanken.no/v1/StatKodetre?node=${kode ||
      ''}${bbox}`

    return this.getPromise(url)
  }

  static async hentKodeMeta(kode) {
    kode = kode || ''
    kode = kode.replace('_', '/')
    kode = kode.replace(/([A-Z])([0-9]+)/, '$1/$2')
    kode = kode.replace('-', '/')
    //return this.getPromise(`https://grunnkart.firebaseio.com/${kode}/@.json`)
    return this.getPromise(
      `https://adbkoder.firebaseio.com/data/${kode}/@.json`
    )
  }

  static async hentPunkt(lng, lat) {
    return this.getPromise(
      `https://adb-nin-raster.azurewebsites.net/v1/point/${lng}/${lat}`
    )
  }

  static async hentAdmEnhet(lng, lat) {
    var bbox = createBboxFromPoint(lng, lat, 0.000001)
    return this.getTextPromise(
      `https://openwms.statkart.no/skwms1/wms.adm_enheter?request=GetFeatureinfo&service=WMS&version=1.3.0&Layers=Kommuner&crs=epsg:4258&format=image/png&width=3&height=3&QUERY_LAYERS=kommuner&i=2&j=2
      &bbox=${bbox.minx},${bbox.miny},${bbox.maxx},${bbox.maxy}`
    )
  }

  static async hentStedsnavn(lng, lat) {
    return this.getPromise(
      `https://www.norgeskart.no/ws/elev.py?lat=${lat}&lon=${lng}&epsg=4258`
    )
  }

  static async getNatureAreaByLocalId(localId) {
    return this.getPromise(
      `https://test.artsdatabanken.no/nin_master/Api/data/GetNatureAreaByLocalId/${localId}`
    )
  }
  static async getMetadataByNatureAreaLocalId(localId) {
    return this.getPromise(
      `https://test.artsdatabanken.no/nin_master/Api/data/GetMetadataByNatureAreaLocalId/${localId}`
    )
  }

  static async natureAreaSummary(filter) {
    let url = `https://adb-nin-api.azurewebsites.net/api/NatureAreaSummary`
    return this.postFilterPromise(url, filter)
  }

  static async countsByRedlistTheme(filter) {
    let url = `https://adb-nin-api.azurewebsites.net/api/CountsByRedlistTheme`
    return this.postFilterPromise(url, filter)
  }

  static async countsByRedlistCategory(filter) {
    let url = `https://adb-nin-api.azurewebsites.net/api/CountsByRedlistCategory`
    return this.postFilterPromise(url, filter)
  }

  static async getAreaSummary(filter) {
    let url = `https://adb-nin-api.azurewebsites.net/api/AreaSummary`
    return this.postFilterPromise(url, filter)
  }

  static async getNatureAreaSummary(filter) {
    //let url = `http://it-webadbtest01.it.ntnu.no/nin_master/Api/data/GetNatureAreaSummary/`;
    let url = `https://adb-nin-api.azurewebsites.net/api/NatureAreaSummary`
    return this.postFilterPromise(url, filter)
  }

  static NatureLevelNames = Object.freeze({
    0: 'Udefinert',
    1: 'Landskapstype',
    2: 'Landskapsdel',
    3: 'Naturkompleks',
    4: 'Natursystem',
    5: 'Naturkomponent',
    6: 'Livsmedium',
    7: 'Egenskapsområde',
  })

  static getKodeFotoUrl(kode, small) {
    const smallFolder = '40'
    const largeFolder = '408'
    if (kode)
      return `https://firebasestorage.googleapis.com/v0/b/grunnkart.appspot.com/o/cover%2F${
        small ? smallFolder : largeFolder
      }%2F${kode}.jpg?alt=media`
  }

  static getKodeUtbredelse(kode) {
    if (kode) {
      return this.getPromise(
        `https://bboxcode.firebaseio.com/observations/${kode}.json`
      )
    }
  }
}

export default Backend

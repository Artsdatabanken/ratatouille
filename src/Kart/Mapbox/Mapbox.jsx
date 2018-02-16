import React, { Component } from 'react'
import ReactMapGL, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import Place from 'material-ui/svg-icons/maps/place'
import { withRouter } from 'react-router'
import { Route, Switch } from 'react-router-dom'
import muiThemeable from 'material-ui/styles/muiThemeable'
import hentLag from './style-lookup'
import backend from '../../backend'
import DeckGL, { GridLayer } from 'deck.gl'

import smallTaxons from './29850_4326.json'

const LIGHT_SETTINGS = {
  lightsPosition: [9.5, 56, 5000, -2, 57, 8000],
  ambientRatio: 0.2,
  diffuseRatio: 0.5,
  specularRatio: 0.3,
  lightsStrength: [1.0, 0.0, 2.0, 0.0],
  numberOfLights: 2,
}

class Mapbox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showTaxonGrid: false,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        latitude: props.latitude,
        longitude: props.longitude,
        zoom: props.zoom,
        pitch: props.pitch,
        bearing: props.bearing,
      },
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize)
    this._resize()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.opplystKode !== this.props.opplystKode) {
      this.updateOpplystKode(nextProps.opplystKode)
    }

    if (nextProps.aktivKode !== this.props.aktivKode) {
      this.updateAktivKode(nextProps.aktivKode)
    }
  }
  updateAktivKode(kode) {
    let map = this.map.getMap()
    if (!map || !map.isStyleLoaded()) {
      console.log(
        'kode: ' +
          kode +
          ' mapstyle loaded: ' +
          (map ? map.isStyleLoaded() : false)
      )
      return
    }

    map.removeLayer(this.props.aktivKode)
    if (kode) {
      let taxonMatch = kode.match(/TX_(.*)/)
      this.setState({ showTaxonGrid: taxonMatch })
      if (taxonMatch) {
        let url = backend.getKodeUtbredelseUrl(kode)
        let kilde = {
          type: 'image',
          url: url,
          coordinates: [
            [-2.12900722, 71.87414651],
            [32.7256258, 71.87414651],
            [32.7256258, 57.36940657],
            [-2.12900722, 57.36940657],
          ],
        }

        map.removeSource('tx_overlay') // remove if it exist
        map.addSource('tx_overlay', kilde)

        let lag = hentLag(map, kode)
        if (lag) map.addLayer(lag)
      }
    }
  }

  updateOpplystKode(opplystKode) {
    let map = this.map.getMap()
    if (!map || !map.isStyleLoaded()) return

    // Ikke nødvendig å fjerne det gamle, blir overskrevet
    if (opplystKode) {
      let opplystLag = hentLag(map, opplystKode)
      if (!opplystLag || !opplystLag.paint) return
      opplystLag.paint['fill-color'] = 'rgba(255,255,255,50%)'
      opplystLag.paint['fill-outline-color'] = 'rgba(255,255,255,80%)'
      opplystLag.id = 'opplyst'
      console.log('add', opplystKode)
      map.addLayer(opplystLag)
    }
    //    } catch (error) {
    //     console.log(error) // TODO: Make it not fail on Sør- og Nord-trøndelag
    //  }
  }

  handleStyleUpdate(kode, opplystKode) {
    this.updateAktivKode(kode)
    this.updateOpplystKode(opplystKode)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize)
  }
  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight,
      },
    })
  }

  handleViewportChange = viewport => {
    this.setState({ viewport })
    const bounds = this.map.getMap().getBounds()
    this.props.onMapBoundsChange(bounds)
  }

  onHover = e => {
    const pos = e.center
    const r = this.map.getMap().queryRenderedFeatures([pos.x, pos.y])
    if (r[0]) {
      //console.log(r[0].properties.localId);
      this.map
        .getMap()
        .setFilter('nin-hover', ['==', 'localId', r[0].properties.localId])
    }
  }

  // onClick = e => {
  //     const pos = e.center;
  //     const r = this.map.getMap().queryRenderedFeatures([pos.x, pos.y]);
  //     if (r[0] && r[0].properties && r[0].properties.localId) {
  //         this.props.onClick(r[0].properties.localId);
  //     }
  // };

  render() {
    const { viewport } = this.state

    const taxonLayer = new GridLayer({
      id: 'taxonLayer',
      data: smallTaxons.features,
      cellSize: 500000 * (1 / (viewport.zoom * viewport.zoom * viewport.zoom)),
      elevationScale: 20,
      extruded: true,
      lightSettings: LIGHT_SETTINGS,
      getPosition: function(e) {
        return e.geometry.coordinates
      },
      // getElevationValue : function(e) {
      //     return e.length
      // }
    })

    return (
      <ReactMapGL
        {...viewport}
        ref={map => {
          this.map = map
        }}
        style={{ cursor: 'default' }}
        onClick={this.props.onClick}
        onHover={this.onHover}
        onMouseMove={this.onMouseMove}
        onLoad={() =>
          this.handleStyleUpdate(this.props.aktivKode, this.props.opplystKode)
        }
        onViewportChange={viewport => this.handleViewportChange(viewport)}
        mapboxApiAccessToken="pk.eyJ1IjoiYXJ0c2RhdGFiYW5rZW4iLCJhIjoiY2pjNjg2MzVzMHhycjJ3bnM5MHc4MHVzOCJ9.fLnCRyg-hCuTClyim1r-JQ"
        //mapStyle="mapbox://styles/artsdatabanken/cjc68pztl4sud2sp0s4wyy58q"
        mapStyle={this.props.mapStyle}
        minZoom={4}
      >
        {this.state.showTaxonGrid && (
          <DeckGL {...viewport} layers={[taxonLayer]} />
        )}
        <Switch>
          <Route
            path="/punkt/:lng,:lat"
            render={({ match, history }) => (
              <Marker
                latitude={parseFloat(match.params.lat)}
                longitude={parseFloat(match.params.lng)}
                offsetLeft={-12}
                offsetTop={-24}
              >
                <Place style={{ color: '#fff' }} />
              </Marker>
            )}
          />
        </Switch>
      </ReactMapGL>
    )
  }
}

export default muiThemeable()(withRouter(Mapbox))

import React, { Component } from 'react'
import Kart from '../Kart/Kart'
import { fromJS } from 'immutable'
import MainDrawer from './MainDrawer'
import { FloatingActionButton } from 'material-ui'
import MapsLayers from 'material-ui/svg-icons/maps/layers'
import { Link } from 'react-router-dom'
import {
  defaultMapStyle,
  darkMapStyle,
  vintageMapStyle,
  satelliteStyle,
  Kalk,
  Ultramafisk,
  Seksjoner,
  Soner,
  NiN,
  Rodliste,
  NiNHover,
} from '../Kart/Mapbox/MapStyle'
import VenstreVinduContainerContainer from '../VenstreVinduContainerContainer'

// Layer color class by type
const colorClass = {
  line: 'line-color',
  fill: 'fill-color',
  background: 'background-color',
  symbol: 'text-color',
}

class Grunnkart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseMapStyle: defaultMapStyle,
      mapStyle: '',
      kode: '',
      showMainDrawer: false,
      categories: [
        'Alle naturområder',
        'Rødlistede',
        'Bioklimatiske soner',
        'Seksjoner',
        'Ultramafisk',
        'Kalk',
      ],
      visibility: {
        'Alle naturområder': false,
        Rødlistede: false,
        'Bioklimatiske soner': false,
        Seksjoner: false,
        Ultramafisk: false,
        Kalk: false,
      },
      color: {
        'Alle naturområder': undefined,
        Rødlistede: undefined,
        'Bioklimatiske soner': undefined,
        Seksjoner: undefined,
        Ultramafisk: undefined,
        Kalk: undefined,
      },
      // Layer id patterns by category
      layerSelector: {
        'Alle naturområder': /nin/,
        Rødlistede: /Rodlistede/,
        'Bioklimatiske soner': /soner/,
        Seksjoner: /seksjoner/,
        Ultramafisk: /ultramafisk/,
        Kalk: /kalk/,
      },
    }

    this.handleAddLayer = this.handleAddLayer.bind(this)
    this.handleColorChange = this.handleColorChange.bind(this)
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this)
    this.setBaseMap = this.handleChangeBaseMap.bind(this)
  }

  makeLayer(name, code, visible, source) {
    const color = { ...this.state.color, [name]: '#003399' }
    const visibility = { ...this.state.visibility, [name]: visible }
    const layerSelector = {
      ...this.state.layerSelector,
      [name]: new RegExp(code),
    }
    const categories = [...this.state.categories, ...[name]]
    this.setState({ categories, visibility, color, layerSelector })

    return fromJS({
      id: code,
      type: 'fill',
      source: 'composite',
      'source-layer': source,
      interactive: true,
      filter: ['has', code],
      layout: {},
      paint: {
        'fill-color': 'hsla(251, 59%, 28%, 0.8)',
        'fill-outline-color': 'hsla(251, 59%, 69%, 0.8)',
      },
    })
  }

  addLayer(name, code) {
    this.layers = this.layers.push(
      this.makeLayer(name, code, true, 'naturomrader6')
    )
    this.updateMapStyle({ ...this.state })
  }

  handleStyleChange = mapStyle => {
    this.setState({ mapStyle })
  }

  handleColorChange(name, event) {
    const color = { ...this.state.color, [name]: event.target.value }
    this.setState({ color })
    this.updateMapStyle({ ...this.state, color })
  }

  handleVisibilityChange(name, visible) {
    const visibility = {
      ...this.state.visibility,
      [name]: visible,
    }
    this.setState({ visibility })
    this.updateMapStyle({ ...this.state, visibility })
  }

  startUpdateMapStyle() {
    this.updateMapStyle({ ...this.state })
  }

  updateMapStyle({ visibility, color, layerSelector }) {
    const layers = this.layers

      .filter(layer => {
        const id = layer.get('id')
        return this.state.categories.every(
          name => visibility[name] || !layerSelector[name].test(id)
        )
      })
      .map(layer => {
        const id = layer.get('id')
        const type = layer.get('type')
        const category = this.state.categories.find(name =>
          layerSelector[name].test(id)
        )
        if (category && colorClass[type] && color[category]) {
          return layer.setIn(['paint', colorClass[type]], color[category])
        }
        return layer
      })

    this.handleStyleChange(this.state.baseMapStyle.set('layers', layers))
  }

  handleAddLayer(navn, kode) {
    this.setState({
      kode: kode,
    })
    this.addLayer(navn, kode)
  }

  handleChangeBaseMap(type) {
    let newStyle = defaultMapStyle
    switch (type) {
      case 'dark': {
        newStyle = darkMapStyle
        break
      }
      case 'vintage': {
        newStyle = vintageMapStyle
        break
      }
      case 'satellite': {
        newStyle = satelliteStyle
        break
      }
      default: {
        break
      }
    }
    this.setState(
      {
        baseMapStyle: newStyle,
      },
      () => {
        this.addCustomLayers()
      }
    )
  }

  addCustomLayers() {
    this.layers = this.state.baseMapStyle
      .get('layers')
      .push(Kalk)
      .push(Ultramafisk)
      .push(Seksjoner)
      .push(Soner)
      .push(NiN)
      .push(Rodliste)
      .push(NiNHover)
    this.updateMapStyle({ ...this.state })
  }

  componentDidMount() {
    this.addCustomLayers()
  }

  render() {
    return (
      <div>
        <Kart
          latitude={65.5}
          longitude={10}
          zoom={4.7}
          mapStyle={this.state.mapStyle}
          onMapBoundsChange={bounds => {
            this.setState({ mapbounds: bounds })
          }}
        />

        <MainDrawer
          onChangeBaseMap={this.handleChangeBaseMap}
          open={this.state.showMainDrawer}
          onToggleMainDrawer={() =>
            this.setState({ showMainDrawer: !this.state.showMainDrawer })
          }
        />
        <Link to="/kontrollpanel">
          <FloatingActionButton
            style={{ position: 'absolute', bottom: 48, right: 48 }}
          >
            <MapsLayers />
          </FloatingActionButton>
        </Link>
        {!this.state.showMainDrawer && (
          <div
            style={{
              backgroundColor: '#fff',
              position: 'absolute',
              left: 8,
              top: 10,
              width: 400,
              zIndex: 2,
            }}
          >
            <VenstreVinduContainerContainer
              onAddLayer={this.handleAddLayer}
              onToggleMainDrawer={() =>
                this.setState({ showMainDrawer: !this.state.showMainDrawer })
              }
              onVisibilityChange={this.handleVisibilityChange}
              onColorChange={this.handleColorChange}
              categories={this.state.categories}
              visibility={this.state.visibility}
              mapbounds={this.state.mapbounds}
              color={this.state.color}
            />
          </div>
        )}
      </div>
    )
  }
}

export default Grunnkart

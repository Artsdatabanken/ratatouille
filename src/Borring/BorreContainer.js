import { List, ListSubheader } from '@material-ui/core'
import React, { Component } from 'react'
import backend from '../backend'
import Kommune from './Kommune'
import Mockup from './Mockup'

class BorreContainer extends Component {
  state = {}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.lng !== this.props.lng || this.props.lat !== prevProps.lat)
      this.fetch(this.props.lng, this.props.lat, this.props.localId)
  }

  componentDidMount() {
    this.fetch(this.props.lng, this.props.lat)
  }

  fetch(lng, lat) {
    this.setState({
      borrehull: null,
      kommune: null,
      sted: null,
      vernxml: null,
    })
    backend.hentPunkt(lng, lat).then(data => {
      this.setState({
        borrehull: data,
      })
    })
    backend.hentAdmEnhet(lng, lat).then(data => {
      this.setState({
        kommune: this.mapKommune(data),
      })
    })
    backend.hentStedsnavn(lng, lat).then(data => {
      this.setState({
        sted: data,
      })
    })
    backend.hentVerneområde(lng, lat).then(data => {
      this.setState({
        vernxml: data,
      })
    })
  }

  mapKommune(data) {
    if (!data.match(/fylkesnavn = '(.*)'/)) return null
    const fylkesnavn = data.match(/fylkesnavn = '(.*)'/)[1]
    const fylkeskode = 'AO_' + data.match(/fylkesnummer = '(.*)'/)[1]
    const kommunenavn = data.match(/navn_norsk = '(.*)'/)[1]
    const kommunekode =
      fylkeskode + '-' + data.match(/kommunenummer = '[0-9]{2}(.*)'/)[1]
    return {
      kommune: kommunenavn,
      knr: kommunekode,
      fylkesnavn: fylkesnavn,
      fnr: fylkeskode,
    }
  }

  render() {
    if (!this.props.lat) return null
    return (
      <List>
        <ListSubheader>
          Punktet {parseFloat(this.props.lat).toFixed(4)}° N{' '}
          {parseFloat(this.props.lng).toFixed(4)}° Ø
        </ListSubheader>
        {this.state.kommune && (
          <Kommune {...this.state.kommune} {...this.state.sted} />
        )}
        <Mockup />
      </List>
    )
  }
}

export default BorreContainer

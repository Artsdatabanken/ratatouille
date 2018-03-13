import React, { Component } from 'react'
import { Paper, List, ListItem, Divider } from 'material-ui'
import Backend from '../../backend'

class ResultatListe extends Component {
  render() {
    const { onClick, query, searchResults } = this.props
    if (!searchResults) return null
    if (!searchResults.length > 0) return null
    return (
      <Paper zDepth={1}>
        <List
          style={{
            overflow: 'auto',
            maxHeight: 494,
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          {searchResults.map(item => {
            const kode = item.kode.toUpperCase()
            const prefix = kode.substring(0, 2)
            return (
              <React.Fragment key={item.kode}>
                <ListItem
                  style={{
                    width: 392,
                    height: 38,
                    pointer: 'hand',
                    paddingTop: 0,
                    paddingBottom: 1,
                  }}
                  innerDivStyle={{
                    paddingTop: 11,
                    paddingBottom: 11,
                    paddingLeft: 66,
                    fontSize: 13,
                    lineheight: 24,
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    onClick(item.kode)
                  }}
                  key={kode}
                  primaryText={ResultatListe.highlightMatch(item.navn, query)}
                  leftIcon={
                    <img
                      style={{ marginTop: 6, marginLeft: 16 }}
                      alt={prefix}
                      src={Backend.avatar24px(prefix)}
                    />
                  }
                >
                  <div style={{ float: 'right' }}>
                    {ResultatListe.highlightMatch(kode, query)}
                  </div>
                </ListItem>
                <Divider inset={true} />
              </React.Fragment>
            )
          })}
        </List>
      </Paper>
    )
  }

  static highlightMatch(navn, query) {
    if (!query) return navn
    const q = query.toLowerCase().split(' ')[0]
    const offset = navn.toLowerCase().indexOf(q)
    if (offset < 0) return navn

    const end = offset + q.length
    return (
      <React.Fragment>
        {navn.substring(0, offset)}
        <span style={{ color: 'black' }}>{navn.substring(offset, end)}</span>
        {navn.substring(end, navn.length)}
      </React.Fragment>
    )
  }
}

export default ResultatListe

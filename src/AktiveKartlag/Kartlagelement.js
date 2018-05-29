import { ListItem } from 'material-ui'
import Toggle from 'material-ui/Toggle'
import React from 'react'
import { withRouter } from 'react-router'
import Bildeavatar from '../Kodetre/Kodeliste/Bildeavatar'
import PaintSwatch from '../Kodetre/Kodeliste/PaintSwatch'

class Kartlagelement extends React.Component {
  render() {
    const item = this.props
    const {
      tittel,
      undertittel,
      kode,
      erEkspandert,
      farge,
      avatarUtenRamme,
    } = this.props
    return (
      <React.Fragment>
        <ListItem
          onClick={() => this.props.history.replace('/lag/' + kode)}
          key={item.kode}
          onMouseEnter={() =>
            this.props.onMouseEnter && this.props.onMouseEnter(kode)
          }
          onMouseLeave={() => {
            this.props.onMouseLeave && this.props.onMouseLeave(kode)
          }}
          leftAvatar={<Bildeavatar utenRamme={avatarUtenRamme} kode={kode} />}
          primaryText={tittel}
          secondaryText={undertittel}
          rightAvatar={
            this.props.showColor || this.props.onToggleVisible ? (
              <div>
                {this.props.onToggleVisible && (
                  <div
                    style={{
                      display: 'inline-flex',
                      position: 'absolute',
                      right: 40,
                      top: 8,
                    }}
                  >
                    <Toggle
                      toggled={this.props.vis}
                      onClick={e => {
                        e.stopPropagation()
                        this.props.onToggleVisible(item.kode)
                      }}
                    />
                  </div>
                )}
                {this.props.showColor && (
                  <div
                    style={{
                      display: 'inline-flex',
                      position: 'absolute',
                      right: 0,
                      top: 8,
                    }}
                  >
                    <PaintSwatch farge={farge} />
                  </div>
                )}
              </div>
            ) : (
              <div />
            )
          }
        />
        {erEkspandert && (
          <div style={{ marginLeft: 24, marginBottom: 24 }}>
            {this.props.children}
          </div>
        )}
      </React.Fragment>
    )
  }
}

export default withRouter(Kartlagelement)

import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import { getMuiTheme, MuiThemeProvider } from 'material-ui/styles'
//import Kode from './Kodetre/Kode'
//import Kart from './Kart/Kart'
import Grunnkart from './Grunnkart/Grunnkart'
import 'mapbox-gl/dist/mapbox-gl.css'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#795548',
    primary2Color: '#D7CCC8',
    primary3Color: '#5D4037',
    accent1Color: '#FF9800',
    textColor: '#212121',
    secondaryTextColor: '#757575',
    borderColor: '#BDBDBD',
  },
})

//console.log(JSON.stringify(muiTheme.palette))

class App extends Component {
  render() {
    return (
      <div className="App">
        <MuiThemeProvider muiTheme={muiTheme}>
          <BrowserRouter>
            <Switch>
              <Route path="/:kode?" exact component={Grunnkart} />
              <Route component={RedirectToDefault} />}
            </Switch>
          </BrowserRouter>
        </MuiThemeProvider>
      </div>
    )
  }
}

const RedirectToDefault = () => <Redirect from="/" to="/ROT" />

export default App

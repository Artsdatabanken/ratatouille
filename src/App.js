import React from "react";
import { withRouter } from "react-router";
import backend from "Funksjoner/backend";
import { SettingsContext } from "SettingsContext";
import InformasjonsVisning from "InformasjonsVisning/InformasjonsVisning";
import TopBar from "TopBar/TopBar";
import Kartlag from "Kartlag/Kartlag";
import Kartlaginnstillinger from "./Kartlag/Innstillinger/Kartlaginnstillinger";
import Kart from "Kart/LeafletTangram/Leaflet";
import metaSjekk from "AppSettings/AppFunksjoner/metaSjekk";
import fetchMeta from "AppSettings/AppFunksjoner/fetchMeta";
import aktiverFraHistorikk from "AppSettings/AppFunksjoner/aktiverFraHistorikk";
import aktiverValgtKartlag from "AppSettings/AppFunksjoner/aktiverValgtKartlag";
import oppdaterMetaProperties from "AppSettings/AppFunksjoner/oppdaterMetaProperties";
import oppdaterLagProperties from "AppSettings/AppFunksjoner/oppdaterLagProperties";
import bakgrunnskarttema from "AppSettings/bakgrunnskarttema";
import HamburgerMeny from "HamburgerMeny/HamburgerMeny";
import MobileNavigation from "MobileNavigation/MobileNavigation";
import ForsideInformasjon from "Forside/ForsideInformasjon";
import Meny from "Navigering/Meny";
import språk from "Funksjoner/språk";
import "style/Kart.scss";
import "style/App.scss";
import "style/Badges.scss";
import "style/Sidebar.scss";
import "style/InformasjonsSider.scss";
import "style/Art.scss";
import "style/Kartlag.scss";
import "style/FargeMenyer.scss";
import fixerUpHack from "./fixerUpHack";
import Punkt from "./InformasjonsVisning/Punkt";
import Hjelp from "InformasjonsVisning/Hjelp/Hjelp";
import NinBottomNavigation from "./NinBottomNavigation";
import Kartlegging from "./Kartlegging";

export let exportableSpraak;
export let exportableFullscreen;

function getPathNotTab(path) {
  const searchparams = path.search.split("?");
  for (let i in searchparams) {
    const item = searchparams[i];
    if (item.includes("lng") && item !== "undefined" && item !== "") {
      return "?" + item;
    }
  }
  return "";
}

class App extends React.Component {
  constructor() {
    super();
    let aktive = {
      bakgrunnskart: JSON.parse(JSON.stringify(bakgrunnskarttema)),
    };
    this.state = {
      aktivTab: "kartlag",
      aktiveLag: aktive,
      forvaltningsLag: aktive,
      opplystKode: "",
      opplyst: {},
      actualBounds: null,
      fitBounds: null,
      meta: null,
      lokalitetdata: null,
      visKoder: false,
      navigation_history: [],
      showCurrent: true,
      showFullscreen: false,
      spraak: "nb",
    };
    exportableSpraak = this;
    exportableFullscreen = this;
  }

  render() {
    let aktivTab = this.state.aktivTab; // getPathTab(this.props.location);
    const { history } = this.props;
    let erAktivert = false;
    if (this.state.meta)
      erAktivert = !!this.state.aktiveLag[this.state.meta.kode];
    const path = this.props.location.pathname;
    return (
      <SettingsContext.Consumer>
        {(context) => {
          return (
            <>
              <>
                <div
                  className={
                    this.state.showFullscreen && aktivTab === "kartlag"
                      ? "hidden_in_fullscreen"
                      : ""
                  }
                >
                  <TopBar
                    forside={context.visSplash}
                    searchFor={this.state.searchFor}
                    onSelectResult={(item) => {
                      let url = item.url;
                      if (item.url[0] !== "/") url = "/" + item.url;
                      history.push(url);
                    }}
                    history={history}
                  />
                </div>

                {context.visSplash && path === "/" && <ForsideInformasjon />}

                <>
                  {false && (
                    <MobileNavigation
                      onNavigateToTab={this.handleSetAktivTab}
                      aktivTab={aktivTab}
                      hidden_in_fullscreen={this.state.showFullscreen}
                    />
                  )}
                  {false && (
                    <NinBottomNavigation
                      aktivTab={aktivTab}
                      onNavigateToTab={this.handleSetAktivTab}
                    />
                  )}

                  {aktivTab === "kartlaginnstillinger" && (
                    <Kartlaginnstillinger
                      meta={this.state.meta}
                      onUpdateLayerProp={this.handleUpdateLayerProp}
                      onNavigateToTab={this.handleSetAktivTab}
                      onClose={this.handleClosePunkt}
                    />
                  )}
                  {aktivTab === "punkt" && (
                    <Punkt
                      punkt={this.state.punkt}
                      aktivTab={aktivTab}
                      onNavigateToTab={this.handleSetAktivTab}
                      onNavigate={this.handleNavigate}
                      onClose={this.handleClosePunkt}
                    />
                  )}
                  {aktivTab === "kartlegging" && (
                    <Kartlegging
                      punkt={this.state.punkt}
                      onNavigate={this.handleNavigate}
                      onNavigateToTab={this.handleSetAktivTab}
                      onClose={this.handleClosePunkt}
                    />
                  )}

                  {aktivTab === "hjelp" && <Hjelp aktivTab={aktivTab} />}

                  {aktivTab === "informasjon" && (
                    <InformasjonsVisning
                      onNavigate={this.handleNavigate}
                      path={path}
                      aktivTab={aktivTab}
                      show_current={this.state.showCurrent}
                      handleShowCurrent={this.handleShowCurrent}
                      aktiveLag={this.state.aktiveLag}
                      mapBounds={this.state.actualBounds}
                      onMouseEnter={this.handleMouseEnter}
                      onMouseLeave={this.handleMouseLeave}
                      onFitBounds={this.handleFitBounds}
                      erAktivert={erAktivert}
                      opplyst={this.state.opplyst}
                      onToggleLayer={() => {
                        this.handleToggleLayer();
                        if (!context.visAktiveLag) context.onToggleAktiveLag();
                      }}
                      meta={this.state.meta}
                      searchFor={this.state.searchFor}
                      onClearSearchFor={this.handleClearSearchFor}
                      onUpdateLayerProp={this.handleUpdateLayerProp}
                      onUpdateMetaProp={this.handleUpdateMetaProp}
                      visAktiveLag={context.visAktiveLag}
                      onToggleAktiveLag={context.onToggleAktiveLag}
                      onNavigateToTab={this.handleSetAktivTab}
                      onClose={this.handleClosePunkt}
                    />
                  )}

                  <Kartlag
                    lokalitetdata={this.state.lokalitetdata}
                    show_current={this.state.showCurrent}
                    handleShowCurrent={this.handleShowCurrent}
                    hidden={true /*aktivTab === "kartlag" && true*/}
                    aktiveLag={this.state.aktiveLag}
                    onUpdateLayerProp={this.handleUpdateLayerProp}
                    handleUpdateLokalitetLayerProp={
                      this.handleUpdateLokalitetLayerProp
                    }
                    onRemoveSelectedLayer={this.handleRemoveSelectedLayer}
                    navigation_history={this.state.navigation_history}
                    onFitBounds={this.handleFitBounds}
                    history={history}
                    currentKartlag={this.state.meta}
                    activateLayerFromHistory={this.activateLayerFromHistory}
                  >
                    <Meny
                      aktiveLag={this.state.aktiveLag}
                      lokalitetdata={this.state.lokalitetdata}
                      lokalitet={path}
                      meta={this.state.meta}
                      onNavigate={this.handleNavigate}
                      aktivTab={aktivTab}
                      onSetAktivTab={this.handleSetAktivTab}
                      onUpdateMetaProp={this.handleUpdateMetaProp}
                      onToggleLayer={() => {
                        this.handleToggleLayer();
                        if (!context.visAktiveLag) context.onToggleAktiveLag();
                      }}
                      opplyst={this.state.opplyst}
                      onMouseEnter={this.handleMouseEnter}
                      onMouseLeave={this.handleMouseLeave}
                    />
                  </Kartlag>

                  <Kart
                    markerCoordinates={this.state.markerCoordinates}
                    onMarkerClick={this.handleMarkerClick}
                    lokalitetdata={this.state.lokalitetdata}
                    path={this.props.location.search}
                    aktivTab={aktivTab}
                    show_current={this.state.showCurrent}
                    bounds={this.state.fitBounds}
                    latitude={65.4}
                    longitude={10.77}
                    zoom={3}
                    aktiveLag={this.state.aktiveLag}
                    opplyst={this.state.opplystKode}
                    meta={this.state.meta}
                    onMapMove={context.onMapMove}
                    history={history}
                    onRemoveSelectedLayer={this.handleRemoveSelectedLayer}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    showFullscreen={
                      this.state.showFullscreen && aktivTab === "kartlag"
                    }
                    handleFullscreen={this.handleFullscreen}
                  />
                </>

                {true && (
                  <HamburgerMeny
                    spraak={this.state.spraak}
                    handleSpraak={this.handleSpraak}
                  />
                )}
              </>
            </>
          );
        }}
      </SettingsContext.Consumer>
    );
  }

  handleMarkerClick = (coords) => {
    this.setState({ markerCoordinates: coords }, () => this.fetchPunktdata());
  };

  handleClosePunkt = () => {
    this.setState({ markerCoordinates: null });
    this.setState({ punkt: null });
    this.handleSetAktivTab("kartlag");
  };

  handleNavigate = (url) => {
    let new_url = url;
    if (!url) {
      return;
    }
    this.props.history.push(new_url);
  };

  onNavigateToTab = (tab) => {
    this.props.history.push(getPathNotTab(this.props.location) + "?" + tab);
  };

  handleFitBounds = (bbox) => {
    this.setState({ fitBounds: bbox });
  };
  handleShowCurrent = (show_current) => {
    this.setState({ showCurrent: show_current });
  };
  handleBoundsChange = (bbox) => {
    this.setState({ actualBounds: bbox });
  };
  handleSpraak = (spraak) => {
    this.setState({ spraak: spraak });
  };

  handleFullscreen = (showFullscreen) => {
    this.setState({ showFullscreen: showFullscreen });
  };

  handleClearSearchFor = () => this.setState({ searchFor: null });

  handleToggleLayer = () => {
    console.log("xxx", !!this.state.aktiveLag[this.state.meta.kode]);
    if (this.state.aktiveLag[this.state.meta.kode])
      this.handleRemoveSelectedLayer(this.state.meta.kode);
    else this.addSelected(this.state.meta);
  };

  componentDidMount() {
    const search = new URLSearchParams(this.props.location.search);
    const lng = search.get("lng");
    const lat = search.get("lat");
    if (lng && lat) this.handleMarkerClick({ lng, lat });
    fetchMeta(this.props.location.pathname, this);
  }

  addSelected = (props) => {
    this.setState({
      aktiveLag: Object.assign(
        {},
        aktiverValgtKartlag(props, this.state.aktiveLag)
      ),
    });
  };

  activateLayerFromHistory = (node) => {
    const aktive = this.state.aktiveLag;
    this.setState({
      aktiveLag: Object.assign({}, aktiverFraHistorikk(aktive, node)),
    });
  };

  componentDidUpdate(prevProps) {
    const path = this.props.location.pathname;
    if (path !== prevProps.location.pathname) {
      fetchMeta(path, this);
    }
    let tittel = "Natur i Norge";
    if (this.state.meta && språk(this.state.meta.tittel) !== "undefined") {
      tittel = språk(this.state.meta.tittel) + " | " + tittel;
    } else if (
      this.state.meta &&
      this.state.meta.tittel.sn &&
      this.state.meta.tittel.sn !== "undefined"
    ) {
      tittel = this.state.meta.tittel.sn + " | " + tittel;
    }
    document.title = tittel;
  }

  handleSetAktivTab = (aktivTab) => {
    this.setState({ aktivTab });
  };

  async downloadMeta(url) {
    const meta = await backend.hentKodeMeta(url);
    metaSjekk(meta, this);
    return meta;
  }

  handleRemoveSelectedLayer = (kode) => {
    let aktive = this.state.aktiveLag;
    delete aktive[kode];
    this.setState({ aktiveLag: aktive });
  };

  handleUpdateLayerProp = (layer, key, value, elementType) => {
    this.setState({
      aktiveLag: Object.assign(
        {},
        oppdaterLagProperties(layer, key, value, this, elementType)
      ),
    });
  };

  handleUpdateLokalitetLayerProp = (layer, key, value) => {
    this.setState({
      lokalitetdata: Object.assign(
        {},
        oppdaterLagProperties(layer, key, value, this, "lokalitetdata")
      ),
    });
  };

  handleForvaltningsLayerProp = (layer, key, value) => {
    let nye_lag = this.state.forvaltningsLag;
    for (let item in this.state.forvaltningsLag) {
      if (this.state.forvaltningsLag[item].kode === layer) {
        nye_lag[item][key] = value;
      }
    }
    this.setState({
      forvaltningsLag: Object.assign({}, nye_lag),
    });
  };

  handleUpdateMetaProp = (kode, key, value) => {
    this.setState({
      meta: Object.assign({}, oppdaterMetaProperties(kode, key, value, this)),
    });
  };

  handleMouseEnter = ({ kode, url }) => {
    // console.log("mouseenter", kode, url);
    this.setState({ opplystKode: kode, opplyst: { kode, url } });
  };

  handleMouseLeave = () => {
    // console.log("mouseleave");
    this.setState({ opplystKode: "", opplyst: {} });
  };

  fetchPunktdata = () => {
    const { lng, lat } = this.state.markerCoordinates;
    this.setState({ punkt: { lng, lat } });
    this.handleSetAktivTab("punkt");

    backend.hentStedsnavn(lng, lat).then((sted) => {
      this.setState((prevState) => Object.assign(prevState.punkt, { sted }));
    });

    backend.hentPunktVektor(lng, lat).then((data) => {
      delete data.KOM;
      delete data.FYL;
      if (data.error) {
        console.error("hentPunktVektor", data.error);
        data = null;
      }
      this.setState((prevState) =>
        Object.assign(prevState.punkt, { vektor: data })
      );
    });

    backend.hentPunkt(lng, lat).then((data) => {
      data = fixerUpHack(data);
      this.setState((prevState) => Object.assign(prevState.punkt, data));
    });
  };

  static contextType = SettingsContext;
}

export default withRouter(App);

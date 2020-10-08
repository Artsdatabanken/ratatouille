import L from "leaflet";
// -- WEBPACK: Load styles --
import "leaflet/dist/leaflet.css";
import React from "react";
import Tangram from "tangram";
import { createScene, updateScene } from "./scene/scene";
import {
  Fullscreen,
  FullscreenExit,
  LocationSearching,
} from "@material-ui/icons";
import "style/Kart.scss";

// -- LEAFLET: Fix Leaflet's icon paths for Webpack --
// See here: https://github.com/PaulLeCam/react-leaflet/issues/255
// Used in conjunction with url-loader.

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

let header_shift = 56;

class LeafletTangram extends React.Component {
  state = {
    windowXpos: 0,
    windowYpos: 0,
    buttonUrl: null,
    sted: null,
    data: null,
    koordinat: null,
  };
  componentDidMount() {
    const options = {
      zoomControl: false,
      inertia: true,
      minZoom: 3,
    };

    let map = L.map(this.mapEl, options);

    map.setView(
      [this.props.latitude, this.props.longitude],
      this.props.zoom * 1.8
    );
    L.control.zoom({ position: "topright" }).addTo(map);
    L.DomUtil.addClass(map._container, "crosshair-cursor-enabled");
    this.map = map;
    let def = {
      //      logLevel: 'debug',
      scene: createScene(this.props),
      events: {
        hover: function (selection) {},
        click: this.handleClick,
        drag: this.handleDrag,
      },
      attribution: '<a href="https://artsdatabanken.no">Artsdatabanken</a>',
    };

    this.layer = Tangram.leafletLayer(def);
    this.map.addLayer(this.layer);
    // this.layer.loadScene(this.layer.scene)
    this.icon = L.icon({
      iconUrl: "/marker/baseline_place_black_18dp.png",
      iconSize: [36, 36],
      iconAnchor: [17, 35],
    });

    map.on("locationfound", (e) => this.onLocationFound(e));
    map.on("locationerror", (e) => this.onLocationError(e));

    if (this.props.markerCoordinates) {
      this.marker = L.marker(
        [this.props.markerCoordinates.lng, this.props.markerCoordinates.lat],
        { icon: this.icon }
      ).addTo(this.map);
    }
  }

  onLocationFound(e) {
    var radius = e.accuracy / 2;
    radius = L.circle(e.latlng, radius).addTo(this.map);
    var gpsmarker = L.marker(e.latlng)
      .addTo(this.map)
      .on("click", (e) => {
        if (this.map) {
          this.map.removeLayer(gpsmarker);
          this.map.removeLayer(radius);
        }
      });
  }
  onLocationError(e) {
    alert(e.message);
  }

  erEndret(prevProps) {
    if (this.props.aktiveLag !== prevProps.aktiveLag) return true;
    if (this.props.lokalitetdata !== prevProps.lokalitetdata) return true;
    if (this.props.meta !== prevProps.meta) return true;
    if (this.props.opplyst !== prevProps.opplyst) return true;
    if (this.props.show_current !== prevProps.show_current) return true;
  }

  componentDidUpdate(prevProps) {
    if (this.props.bounds !== prevProps.bounds) {
      const bounds = this.props.bounds;
      if (bounds) {
        this.map.flyToBounds(bounds);
      }
    }
    if (this.erEndret(prevProps)) {
      this.updateMap(this.props);
      return;
    }
  }

  removeMarker() {
    this.setState({
      sted: null,
      data: null,
    });
    if (!this.marker) return;
    this.map.removeLayer(this.marker);
  }

  handleClick = (e) => {
    const latlng = e.leaflet_event.latlng;
    this.removeMarker();
    this.marker = L.marker([latlng.lat, latlng.lng], { icon: this.icon }).addTo(
      this.map
    );
    let offset = this.marker._mapToAdd._mapPane._leaflet_pos;
    const coords = {
      lat: latlng.lat,
      lng: latlng.lng,
      windowXpos: e.x + offset.x,
      windowYpos: e.y - header_shift + offset.y,
    };
    this.props.onMarkerClick(coords);

    let urlparams = (this.props.path || "").split("?");
    let newurlstring = "";
    for (let i in urlparams) {
      if (!urlparams[i].includes("lng") && urlparams[i] !== "") {
        newurlstring += "?" + urlparams[i];
      }
    }
    this.props.history.push(
      "?lng=" + latlng.lng + "&lat=" + latlng.lat + newurlstring
    );
  };

  updateMap(props) {
    //    console.log(this.layer.scene);
    updateScene(this.layer.scene.config, props);
    this.layer.scene.updateConfig({ rebuild: true });
  }

  render() {
    return (
      <>
        {this.props.aktivTab === "kartlag" && (
          <button
            className="fullscreen map_button"
            title="Fullskjermsvisning"
            alt="Fullskjermsvisning"
            onClick={(e) => {
              this.props.handleFullscreen(!this.props.showFullscreen);
            }}
          >
            {this.props.showFullscreen === true ? (
              <FullscreenExit />
            ) : (
              <Fullscreen />
            )}
          </button>
        )}

        <div
          style={{ zIndex: -100, cursor: "default" }}
          ref={(ref) => {
            this.mapEl = ref;
          }}
        />
        {this.props.aktivTab === "kartlag" && (
          <button
            className="geolocate map_button"
            alt="Geolokalisering"
            title="Geolokalisering"
            onClick={() => {
              this.props.handleFullscreen(false);
              this.handleLocate();
            }}
          >
            <LocationSearching />
          </button>
        )}
      </>
    );
  }

  handleLocate() {
    this.map.locate({ setView: true });
  }
}

export default LeafletTangram;

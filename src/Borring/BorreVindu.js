import { withStyles } from "@material-ui/core/styles";
import {
  Card,
  FormControlLabel,
  CardActions,
  Typography,
  CardActionArea,
  CardContent,
  Switch,
  Button,
  CardMedia,
  withTheme
} from "@material-ui/core";
import React, { Component } from "react";
import { withRouter } from "react-router";
import Borring from "./Borring";
import FlatUt from "./FlatUt";
import Sted from "./Sted";
import Kilde from "../Kilde";
import config from "../config";

const styles = {
  card: {
    maxWidth: 408,
    minHeight: "100%",
    backgroundColor: "#eee"
  },
  media: {
    width: 408,
    height: 280,
    objectFit: "cover"
  },
  bareAktive: { position: "absolute", right: 0 }
};

class BorreVindu extends Component {
  state = { bareAktive: false };
  render() {
    const { lat, lng, barn, view, classes } = this.props;
    if (!barn) return null;
    const { AO, prefix, ...andreBarn } = barn;
    const color = "rgba(240,240,240,1.0)";
    const bgColor = "hsla(0, 0%, 30%, 0.65)";
    const dominant = this.finnButikkKode();
    return (
      <Card square={true} className={classes.card}>
        <CardMedia
          className={classes.media}
          image={config.getFotoOmslag(dominant.kode)}
          title={dominant.tittel}
        >
          <div
            style={{
              position: "relative",
              top: 191,
              left: 0,
              height: 74,
              right: 0,
              backgroundColor: bgColor,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 16,
              paddingRight: 16
            }}
          >
            {AO && (
              <FlatUt node={AO}>
                <Sted />
              </FlatUt>
            )}
            <Typography style={{ color: color }} variant="body1">
              {parseFloat(lat).toFixed(5)}° N {parseFloat(lng).toFixed(5)}° Ø
            </Typography>
          </div>
        </CardMedia>
        <CardActionArea style={{ backgroundColor: "#ccc" }} />
        <CardActions>
          {view ? (
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={this.handleClickKunnskap}
            >
              Kunnskap
            </Button>
          ) : (
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={this.handleClickKilder}
            >
              Kilder
            </Button>
          )}
          <FormControlLabel
            className={classes.bareAktive}
            control={
              <Switch
                checked={this.state.bareAktive}
                onClick={() => {
                  this.setState({ bareAktive: !this.state.bareAktive });
                }}
              />
            }
            label="Fra mine kartlag"
          />
        </CardActions>
        <CardContent style={{ padding: 0 }}>
          {view ? (
            <Kilde geom_id={this.finnGeomId()} prefiks="NA" />
          ) : (
            <Borring barn={this.state.bareAktive ? {} : andreBarn} />
          )}
        </CardContent>
      </Card>
    );
  }

  finnKodeHack(barn, subkey, tittel) {
    barn = barn.values[subkey];
    if (!barn || !barn.values) return null;
    for (let key of Object.keys(barn.values)) {
      if (key === "NA-KLG") continue;
      if (key === "NA-BS") continue;
      if (key === "NA-LKM") continue;
      if (key.indexOf("-E-") > 0) return;
      const kode = this.finnKodeHack(barn, key, barn.title);
      if (kode) return kode;
      return { kode: key, tittel: barn.title };
    }
  }

  finnButikkKode() {
    const { barn } = this.props;
    const fallback = { kode: "NA", tittel: "Natursystem" };
    let r = this.finnKodeHack({ values: barn }, "NA", "Natursystem");
    if (r) return r;
    r = this.finnKodeHack({ values: barn }, "LA", "Landskap");
    if (r) return r;
    return fallback;
  }

  finnGeomHack(barn) {
    if (barn.id) return barn.id;
    if (!barn.values) return null;
    for (let key of Object.keys(barn.values)) {
      const node = barn.values[key];
      const id = this.finnGeomHack(node);
      if (id) return id;
    }
  }

  finnGeomId() {
    const { barn } = this.props;
    if (!barn) return;
    if (!barn.NA) return;
    return this.finnGeomHack(barn.NA);
  }

  handleClickKunnskap = () => {
    const { lat, lng, history } = this.props;
    history.push(`?lng=${lng}&lat=${lat}`);
  };
  handleClickKilder = () => {
    const { lat, lng, history } = this.props;
    history.push(`?lng=${lng}&lat=${lat}&view=kilde`);
  };

  handleClickValg = () => {
    const { history } = this.props;
    history.push("/punkt/valg");
  };
}

export default withRouter(withTheme()(withStyles(styles)(BorreVindu)));

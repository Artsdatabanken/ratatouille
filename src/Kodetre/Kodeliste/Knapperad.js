import { Button, CardActions, withStyles } from "@material-ui/core";
import { LibraryAdd, ZoomOutMap, ColorLens } from "@material-ui/icons/";
import React from "react";
import { withRouter } from "react-router";

const styles = {
  iconSmall: {
    fontSize: 20,
    marginRight: 8
  },
  button: {
    color: "rgba(0,0,0,0.6)",
    marginRight: 8
  },
  cardActions: {
    paddingLeft: 24
  }
};

const Knapperad = ({
  classes,
  erAktivert,
  bbox,
  history,
  onToggleLayer,
  onFitBounds
}) => (
  <CardActions className={classes.cardActions}>
    <React.Fragment>
      <Button
        className={classes.button}
        onClick={onToggleLayer}
        disabled={erAktivert}
      >
        <LibraryAdd className={classes.iconSmall} />
        Aktivér
      </Button>
      <Button
        className={classes.button}
        onClick={() => history.push(history.location.pathname + "?vis")}
      >
        <ColorLens className={classes.iconSmall} />
        Vis
      </Button>
      {bbox && (
        <Button className={classes.button} onClick={onFitBounds}>
          <ZoomOutMap className={classes.iconSmall} />
          Zoom til
        </Button>
      )}
    </React.Fragment>
    )}
  </CardActions>
);

export default withRouter(withStyles(styles)(Knapperad));
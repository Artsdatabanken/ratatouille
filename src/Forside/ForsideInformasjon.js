﻿import React, { useState } from "react";
import { withRouter } from "react-router";
import "style/Forside.css";
import { Map } from "@material-ui/icons";
import Kilder from "./Kilder";

import Utforsk from "HamburgerMeny/Utforsk/Utforsk";

const ForsideInformasjon = props => {
  const [showInfo, setShowInfo] = useState(true);
  if (props.location.pathname !== "/") return null;
  if (props.location.pathname !== "/") return null;

  return (
    <React.Fragment>
      {showInfo !== "turn off" && (
        <div className="frontpage">
          <div className="frontpage_body">
            <div className="frontpage_header">
              <div
                className="frontpage_icon"
                onClick={e => {
                  e.stopPropagation();
                  props.history.push("/Natur_i_Norge/");
                  setShowInfo(false);
                }}
              >
                <Map />{" "}
              </div>
              <div>
                <h1>NiN-Kart</h1>
                <h2>Natur i Norge</h2>
              </div>
            </div>

            <div className="frontpage_feature_block">
              <div className="frontpage_feature_container">
                <img
                  src="https://www.artsdatabanken.no/Media/F28048?mode=1920x1920"
                  alt=""
                />
                <div>
                  <h2>Hva er Natur i Norge?</h2>
                  <p>
                    Natur i Norge (NiN) er et type- og beskrivelsessystem for
                    naturvariasjon.
                    <br />
                    Les mer om på Artsdatabankens{" "}
                    <a href="https://www.artsdatabanken.no/NiN">
                      nettsider om NiN.
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="frontpage_link_items">
              <h2>Utforsk NiN-kart via ikonene nedenfor</h2>
              <Utforsk parent={props} />
            </div>
          </div>
          <div className="frontpage_footer">
            <div className="frontpage_sources">
              <a href="https://www.artsdatabanken.no/">
                <img
                  src="https://data.artsdatabanken.no/Datakilde/Artsdatabanken/logo_med_navn_408.png"
                  alt="Artsdatabanken logo"
                />
              </a>
            </div>
            <Kilder />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default withRouter(ForsideInformasjon);
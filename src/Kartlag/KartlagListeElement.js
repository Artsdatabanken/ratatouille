import React, { useState } from "react";
import { VisibilityOutlined, VisibilityOffOutlined } from "@material-ui/icons";
import språk from "../språk";
import { withRouter } from "react-router";
import { SettingsContext } from "../SettingsContext";

import FargeMeny from "./../Innstillinger/Undermenyer/FargeMeny";

import {
  Close,
  KeyboardArrowDown,
  KeyboardArrowUp,
  OpenInNew,
  ColorLens
} from "@material-ui/icons";

const KartlagListeElement = ({
  kartlag,
  onUpdateLayerProp,
  onRemoveSelectedLayer,
  onFitBounds
}) => {
  const [expanded, setExpanded] = useState(false);
  const [settings, setSettings] = useState(false);
  const kode = kartlag.kode;
  let tittel = kartlag.tittel;
  let bbox = kartlag.bbox;
  const erSynlig = kartlag.erSynlig;
  return (
    <SettingsContext.Consumer>
      {context => (
        <li>
          <div
            className={
              (expanded && "kartlag_header kartlag_open_object") ||
              "kartlag_header"
            }
          >
            <span className="kartlag_list_title">
              {språk(tittel)}
              <br />
              {context.visKoder && kode}
            </span>

            <span className="kartlag_list_icon_set">
              <button
                className="invisible_icon_button"
                onClick={e => {
                  onUpdateLayerProp(kode, "erSynlig", !erSynlig);
                  e.stopPropagation();
                }}
              >
                {erSynlig ? (
                  <VisibilityOutlined />
                ) : (
                  <VisibilityOffOutlined style={{ color: "#aaa" }} />
                )}
              </button>

              <button
                className="invisible_icon_button"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}{" "}
              </button>
            </span>
          </div>
          {settings && (
            <FargeMeny
              kartlag={kartlag}
              onUpdateLayerProp={onUpdateLayerProp}
            />
          )}

          {expanded && (
            <div className="kartlag_submeny">
              <button
                className="invisible_icon_button"
                //onClick={() => {
                //history.push("/" + kode + "?vis");
                //}}
                onClick={() => setSettings(!settings)}
              >
                Farger <ColorLens />
              </button>
              {kode !== "bakgrunnskart" && (
                <>
                  <button
                    className="invisible_icon_button"
                    onClick={event => {
                      context.onNavigateToTab("kart");
                      console.log("running", context.onNavigateToTab);
                      onFitBounds(bbox);
                    }}
                  >
                    Zoom til <OpenInNew />
                  </button>

                  <button
                    className="invisible_icon_button remove_icon"
                    onClick={() => onRemoveSelectedLayer(kode)}
                  >
                    Fjern <Close />
                  </button>
                </>
              )}
            </div>
          )}
        </li>
      )}
    </SettingsContext.Consumer>
  );
};

export default withRouter(KartlagListeElement);

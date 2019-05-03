import React from "react";
import SettingsContainer from "../../SettingsContainer";
import { SettingsContext } from "../../SettingsContext";
import prettyKode from "./prettyKode";
import { OpenInNew } from "@material-ui/icons/";

const Tittelblokk = ({
  tittel,
  kode,
  nivå,
  overordnet,
  children,
  bbox,
  onFitBounds
}) => {
  const pkode = prettyKode(kode);
  return (
    <SettingsContainer>
      <SettingsContext.Consumer>
        {context => (
          <div className="sidebar_title_container sidebar_element">
            <h1 className="sidebar_title">{tittel}</h1>
            <h2>
              {nivå}
              {context.visKoder && (
                <span className="sidebar_code_field">
                  {pkode && <span className=""> - {pkode}</span>}
                </span>
              )}
            </h2>
            {children}
            {overordnet.length > 0 && (
              <button
                className="zoom_button"
                onClick={event => {
                  context.onNavigateToTab("kart");
                  onFitBounds(bbox);
                }}
              >
                <OpenInNew className="classes.iconSmall" />
                Zoom til
              </button>
            )}
          </div>
        )}
      </SettingsContext.Consumer>
    </SettingsContainer>
  );
};

export default Tittelblokk;

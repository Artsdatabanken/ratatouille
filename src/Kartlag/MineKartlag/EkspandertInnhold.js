import React from "react";
import TemaMeny from "../Bakgrunn/TemaMeny/TemaMeny";
import BakgrunnsElementer from "Innstillinger/Undermenyer/BakgrunnsMenyer/BakgrunnsElementer";
import Google from "Innstillinger/Undermenyer/BakgrunnsMenyer/Google";
import tinycolor from "tinycolor2";
import ColorPicker from "Innstillinger/FerdigeMiniElement/ColorPicker";
import LegendeElementer from "Innstillinger/Undermenyer/LegendeElementer";

const EkspandertInnhold = ({
  kode,
  theme,
  aktivtFormat,
  onUpdateLayerProp,
  kartlag,
  settings
}) => {
  return (
    <div>
      {kode === "bakgrunnskart" && theme && (
        <TemaMeny
          onUpdateLayerProp={onUpdateLayerProp}
          aktivtFormat={aktivtFormat}
        />
      )}

      {settings && (
        <>
          {kode === "bakgrunnskart" ? (
            <>
              {aktivtFormat.aktivtFormat === "google_hybrid" ||
              aktivtFormat.aktivtFormat === "google_satellite" ? (
                <div className="sidebar_element">
                  <h3>Fargefilter for Google-kartbladet</h3>
                  <Google
                    kartlag={kartlag}
                    aktivtFormat={aktivtFormat}
                    onUpdateLayerProp={onUpdateLayerProp}
                  />
                </div>
              ) : (
                <BakgrunnsElementer
                  onUpdateLayerProp={onUpdateLayerProp}
                  aktivtFormat={aktivtFormat}
                />
              )}
            </>
          ) : (
            <>
              {kartlag.barn.length === 0 ? (
                <ColorPicker
                  color={kartlag.farge}
                  onChange={farge => {
                    const rgbString = tinycolor(farge.rgb).toRgbString();
                    onUpdateLayerProp(kartlag.kode, "farge", rgbString);
                  }}
                />
              ) : (
                <LegendeElementer
                  kartlag={kartlag}
                  aktivtFormat={aktivtFormat}
                  onUpdateLayerProp={onUpdateLayerProp}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default EkspandertInnhold;

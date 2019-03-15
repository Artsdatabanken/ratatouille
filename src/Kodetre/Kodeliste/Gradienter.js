import React from "react";
import Gradient from "./LinearGauge";

const Gradienter = ({
  gradient,
  onNavigate,
  onMouseEnter,
  onMouseLeave,
  opplystKode,
  visKoder
}) => {
  return (
    <React.Fragment>
      {Object.entries(gradient).map(([kode, gr]) => {
        console.log(kode, gr);
        return (
          <Gradient
            key={kode}
            tittel={gr.tittel.nb}
            url={gr.url}
            kode={gr.kode}
            visKoder={visKoder}
            trinn={gr.trinn}
            onNavigate={onNavigate}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            opplystKode={opplystKode}
          />
        );
      })}
    </React.Fragment>
  );
};

export default Gradienter;

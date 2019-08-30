import React from "react";
import KatalogHeaderImage from "./KatalogHeaderImage";
import språk from "Funksjoner/språk";
import prettyKode from "Funksjoner/prettyKode";
import { SettingsContext } from "SettingsContext";
import KatalogInformasjon from "../KatalogInformasjon/KatalogInformasjon";
import NatursystemAdvarsel from "InformasjonsVisning/Katalog/NatursystemAdvarsel";

const KatalogHeader = ({ meta }) => {
  if (!meta) return null;
  const { kode, nivå, onUpdateLayerProp } = meta;
  const pkode = prettyKode(kode);
  const tittel = språk(meta.tittel);
  let natursystem = kode.substring(0, 5) === "NN-NA";
  if (
    kode.substring(0, 12) === "NN-NA-BS-6SO" ||
    kode.substring(0, 9) === "NA-BS-6SO" ||
    kode.substring(0, 12) === "NN-NA-BS-6SE" ||
    kode.substring(0, 9) === "NA-BS-6SE"
  ) {
    natursystem = false;
  }

  /*  
  Header for alle informasjonselement aka. Boksen med bilde og tekst for denne siden.
  Inneholder navn, kode, statistikk og bilde. 

  */

  return (
    <SettingsContext.Consumer>
      {context => (
        <div className="">
          <h1 className="sidebar_title">{tittel}</h1>
          {natursystem && <NatursystemAdvarsel />}

          <div className="katlog_header_images_container">
            <KatalogHeaderImage meta={meta} />
            <div className="katlog_header_text_container">
              <h2>
                {nivå}
                {context.visKoder && (
                  <span className="sidebar_code_field">
                    {pkode && <span className=""> - {pkode}</span>}
                  </span>
                )}
              </h2>
              <KatalogInformasjon
                meta={meta}
                onUpdateLayerProp={onUpdateLayerProp}
              />
            </div>
          </div>
        </div>
      )}
    </SettingsContext.Consumer>
  );
};
export default KatalogHeader;

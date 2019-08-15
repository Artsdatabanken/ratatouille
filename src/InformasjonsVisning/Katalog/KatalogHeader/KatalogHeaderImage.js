import React from "react";

const KatalogHeaderImage = ({ meta }) => {
  if (!meta) return null;
  const { bilde } = meta;
  /*
  Contains Header image only.
  */
  let new_url = "no_image";
  let new_flagg = "no_flagg";

  if (bilde.foto != null) {
    new_url = bilde.foto.url;
  }

  if (bilde.flagg != null) {
    new_flagg = bilde.logo.url;
  }

  let classes = "sidebar_top_image";
  let flagg_classes = "sidebar_top_image trasparent_image";

  return (
    <>
      <div
        className={classes}
        //onClick={this.handleOpen}
        style={
          (new_url !== "no_image" && {
            backgroundImage: "url(" + new_url + ")"
          }) || { height: 0 }
        }
        alt=""
      />

      {new_flagg !== "no_flagg" && (
        <div
          className={flagg_classes}
          style={{ backgroundImage: "url(" + new_flagg + ")" }}
          alt=""
        />
      )}
    </>
  );
};
export default KatalogHeaderImage;
"use client";
import { Fragment, useEffect, useState } from "react";
// import Image from "next/image";
import classes from "./ImageLoader.module.css";

type imageType = {
  image: string;
};

function ImageLoader({ image }: imageType) {
  const [loading, setLoading] = useState<boolean>(true);

  function imageLoad() {
    setLoading(false);
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Fragment>
      {loading && <div className={classes.loadingCirlce}></div>}

      {!loading && (
        <img
          src={image}
          alt="Loaded game image"
          onLoad={imageLoad}
          loading="lazy"
          // style={{ display: loading ? "none" : "block" }}
        />
      )}
    </Fragment>
  );
}

export default ImageLoader;

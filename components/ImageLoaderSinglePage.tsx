"use client";
import { Fragment, useEffect, useState } from "react";
import classes from "./ImageLoader.module.css";

type imageType = {
  image: string;
};

function ImageLoaderSinglePage({ image }: imageType) {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => setLoading(false);

    return () => {
      img.onload = null;
    };
  }, [image]);

  return (
    <Fragment>
      <div className={classes.loadingCirlceContainer}>
        {loading ? (
          <div className={classes.loadingCirlce}></div>
        ) : (
          <img src={image} alt="Loaded game image" loading="lazy" />
        )}
      </div>
    </Fragment>
  );
}

export default ImageLoaderSinglePage;

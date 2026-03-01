import React from "react";

function Loading({ size }) {
  return <span className={`loading loading-spinner loading-${size}`}></span>;
}

export default Loading;

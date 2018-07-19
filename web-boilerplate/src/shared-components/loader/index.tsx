import * as React from "react";
import * as classnames from "classnames";

import "./Loader.scss";

export const Loader = ({ size }: { size?: "large" | "huge" }) => {
  return (
    <div className={classnames("loader", size)}>
      <i className="fa fa-circle-o-notch fa-spin" />
    </div>
  );
};

export const loader = () => BaseComponent => {
  return props => {
    if (props.data && props.data.loading) return <Loader />;
    return <BaseComponent {...props} />;
  };
};

import * as React from "react";
import { Alert } from "antd";
import { FormattedMessage } from "react-intl";

export class Admin extends React.PureComponent {
  render() {
    return (
      <div className="container small" style={{ marginTop: "4rem" }}>
        <Alert message={<FormattedMessage id="admin.info" />} type="info" showIcon />
      </div>
    );
  }
}

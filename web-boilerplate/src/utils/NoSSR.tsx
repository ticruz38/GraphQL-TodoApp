import * as React from "react";

// this component is used to disable SSR in dev mode
export class NoSSR extends React.PureComponent {
  state = { canRender: !!PRODUCTION };

  componentDidMount() {
    this.setState({ canRender: true });
  }

  render() {
    const { children } = this.props;
    const { canRender } = this.state;

    return canRender ? children : null;
  }
}

export const noSSR = BaseComponent => {
  return props => (
    <NoSSR>
      <BaseComponent {...props} />
    </NoSSR>
  );
};

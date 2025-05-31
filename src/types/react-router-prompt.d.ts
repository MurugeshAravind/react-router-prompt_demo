declare module 'react-router-prompt' {
  import * as React from 'react';
  import { Location, Action } from 'history';
  export interface ReactRouterPromptProps {
    when: boolean;
    message:
      | string
      | ((location: Location, action: Action) => string | boolean);
    beforeConfirm?: () => void;
    afterConfirm?: () => void;
    beforeCancel?: () => void;
    afterCancel?: () => void;
    children: (args: {
      isActive: boolean;
      onConfirm: () => void;
      onCancel: () => void;
    }) => React.ReactNode;
  }
  export default class ReactRouterPrompt extends React.Component<ReactRouterPromptProps> {}
}

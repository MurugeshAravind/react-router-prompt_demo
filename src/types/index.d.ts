import '@testing-library/jest-dom';
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveTextContent: (text: string | RegExp) => R;
      toBeVisible: () => R;
      toBeInTheDocument: () => R;
      // Add other custom matchers if needed
    }
  }
}
declare module 'react-router-prompt' {
  import * as React from 'react';

  export interface PromptProps {
    when: boolean;
    children: (props: {
      isActive: boolean;
      onConfirm: () => void;
      onCancel: () => void;
    }) => React.ReactNode;
  }

  const Prompt: React.FC<PromptProps>;
  export default Prompt;
}

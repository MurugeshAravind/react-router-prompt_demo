import { useEffect, useState, useCallback } from 'react';
import * as ReactRouterPrompt from 'react-router-prompt';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

function Prompt({ inputText }: { readonly inputText: (text: string) => void }) {
  type PromptProps = {
    isActive: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  };

  const [isDirty, setIsDirty] = useState(false);
  const [initialValue, setInitialValue] = useState('');

  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.stopImmediatePropagation();
      }
    },
    [isDirty],
  );

  useEffect(() => {
    if (isDirty) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isDirty, handleBeforeUnload]);

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-4">
        <Input
          id="initialValue"
          inputProps={{
            'aria-label': 'Initial Value',
            'data-testid': 'initialValueInput',
          }}
          className="w-full max-w-md min-w-[200px] border-2 border-gray-200 p-4 rounded-lg mb-4"
          type="text"
          placeholder="Type something here and click on browser back button"
          onChange={(e) => {
            const currentValue = e.target.value;
            if (initialValue === '') {
              setInitialValue(currentValue);
            }
            setIsDirty(currentValue !== initialValue);
            inputText(currentValue);
          }}
        />
      </div>
      <ReactRouterPrompt.default when={isDirty}>
        {({ isActive, onConfirm, onCancel }: PromptProps) => (
          <Dialog open={isActive} onClose={onCancel}>
            <Box className="flex flex-col items-center justify-center bg-white p-4 rounded shadow-lg">
              <DialogTitle
                className="text-lg font-semibold text-gray-800"
                id="alert-dialog-title"
              >
                Are you sure you want to leave this page?
              </DialogTitle>
              <DialogActions>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => onConfirm()}
                >
                  Ok
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => onCancel()}
                >
                  Cancel
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        )}
      </ReactRouterPrompt.default>
    </>
  );
}

export default Prompt;

# React Router Prompt
A flexible component for handling navigation prompts in React applications using React Router v7 or v6. This package helps prevent users from accidentally navigating away from forms with unsaved changes.

# Installation
Prerequisites
This package requires React Router as a peer dependency. Choose the appropriate version based on your React Router version:

bash
# For React Router v7 (recommended)
npm install react-router-prompt

# For specific React Router versions
# React Router v7: npm install react-router-prompt@0.8.x
# React Router DOM v6.19.x - v6.28.1: npm install react-router-prompt@0.7.x
# React Router DOM v6.7.x - v6.18.x: npm install react-router-prompt@0.5.4
# React Router DOM v6 - v6.2.x: npm install react-router-prompt@0.3.0
Note: For optimal functionality, this package should be used with data routers when using React Router v7.

Features
Create custom navigation confirmation dialogs

Flexible API for handling navigation blocking

Support for async operations before confirming/canceling navigation

Compatible with React Router v7 and v6 (with version-specific packages)

Basic Usage
jsx
import { ReactRouterPrompt } from 'react-router-prompt';
import { useState } from 'react';

function MyForm() {
  const [isDirty, setIsDirty] = useState(false);
  
  return (
    <>
      <form>
        <input 
          type="text" 
          onChange={() => setIsDirty(true)} 
        />
        {/* Other form elements */}
      </form>
      
      <ReactRouterPrompt when={isDirty}>
        {({ isActive, onConfirm, onCancel }) => (
          <div className="lightbox" style={{ display: isActive ? 'flex' : 'none' }}>
            <div className="container">
              <h3>Unsaved Changes</h3>
              <p>You have unsaved changes. Are you sure you want to leave?</p>
              <div>
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onConfirm}>Confirm</button>
              </div>
            </div>
          </div>
        )}
      </ReactRouterPrompt>
    </>
  );
}
API Reference
Props
Prop	Type	Description
when	boolean or BlockerFunction	Controls when the navigation prompt should appear. Can be a simple boolean or a function that returns a boolean.
beforeConfirm	Promise<unknown>	(Optional) Async function to run before confirming navigation.
beforeCancel	Promise<unknown>	(Optional) Async function to run before canceling navigation.
BlockerFunction Signature
typescript
type BlockerFunction = (args: { 
  currentLocation: Location, 
  nextLocation: Location, 
  historyAction: HistoryAction 
}) => boolean
Render Props
The child function receives an object with the following properties:

Prop	Type	Description
isActive	boolean	Whether the prompt is currently active.
onConfirm	(nextLocation?: Location) => void	Function to confirm navigation.
onCancel	() => void	Function to cancel navigation.
nextLocation	Location | undefined	The location the user is attempting to navigate to.
Examples
With Custom Modal
jsx
import { ReactRouterPrompt } from 'react-router-prompt';
import Modal from './Modal'; // Your custom modal component

function FormWithPrompt() {
  const [formState, setFormState] = useState({});
  const isDirty = Object.keys(formState).length > 0;
  
  return (
    <div>
      <form>
        {/* Your form fields */}
      </form>
      
      <ReactRouterPrompt when={isDirty}>
        {({ isActive, onConfirm, onCancel }) => (
          <Modal show={isActive} onClose={onCancel}>
            <h2>Discard changes?</h2>
            <p>If you leave this page, any unsaved changes will be lost.</p>
            <button onClick={onCancel}>Stay on this page</button>
            <button onClick={onConfirm}>Leave page</button>
          </Modal>
        )}
      </ReactRouterPrompt>
    </div>
  );
}
With Async Operations
jsx
import { ReactRouterPrompt } from 'react-router-prompt';

function FormWithAsyncPrompt() {
  const [isDirty, setIsDirty] = useState(false);
  
  const saveDataBeforeLeaving = async () => {
    // Save data to server
    await api.saveFormData();
    return true;
  };
  
  return (
    <div>
      <form>{/* Form fields */}</form>
      
      <ReactRouterPrompt 
        when={isDirty}
        beforeConfirm={saveDataBeforeLeaving}
      >
        {({ isActive, onConfirm, onCancel }) => (
          <div className={isActive ? 'modal active' : 'modal'}>
            <p>Do you want to save your changes before leaving?</p>
            <button onClick={onConfirm}>Save and leave</button>
            <button onClick={onCancel}>Stay on page</button>
          </div>
        )}
      </ReactRouterPrompt>
    </div>
  );
}
Browser Support
This package works in all modern browsers that support React and React Router.

License
MIT

Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Acknowledgements
This package was created to fill the gap left by the removal of the built-in Prompt component in React Router v6+.

Related

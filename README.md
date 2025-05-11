# React Router Prompt
A flexible component for handling navigation prompts in React applications using React Router v7 or v6. This package helps prevent users from accidentally navigating away from forms with unsaved changes.

# Installation
- Prerequisites -> This package requires React Router as a peer dependency. Choose the appropriate version based on your React Router version:

# For React Router v7 (recommended)
- npm install react-router-prompt

# For specific React Router versions
- React Router v7: npm install react-router-prompt@0.8.x
- React Router DOM v6.19.x - v6.28.1: npm install react-router-prompt@0.7.x
- React Router DOM v6.7.x - v6.18.x: npm install react-router-prompt@0.5.4
- React Router DOM v6 - v6.2.x: npm install react-router-prompt@0.3.0
- Note: This package should be used with data routers when using React Router v7 for optimal functionality.

# Features
- Create custom navigation confirmation dialogs
- Flexible API for handling navigation blocking
- Support for async operations before confirming/canceling navigation
- Compatible with React Router v7 and v6 (with version-specific packages)

# Browser Support
- This package works in all modern browsers that support React and React Router.

# Acknowledgements
- This package was created to fill the gap left by removing the built-in Prompt component in React Router v6+.

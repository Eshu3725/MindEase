# MindEase React App

This is a React.js version of the MindEase application, converted from the original HTML/CSS/JavaScript implementation.

## Features

- User authentication (signup, login, password reset)
- User preferences selection
- Dashboard interface
- Responsive design with Tailwind CSS
- Firebase integration for authentication and data storage

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## Setup Instructions

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Copy the `Sticker.gif` file from the original project to the `src/assets` directory.

4. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Project Structure

- `src/components` - Reusable UI components
- `src/pages` - Page components for different routes
- `src/assets` - Static assets like images
- `src/firebase.js` - Firebase configuration and exports
- `src/index.css` - Global styles and Tailwind CSS utilities

## Firebase Configuration

The app uses Firebase for authentication and Firestore for data storage. The configuration is already set up in `src/firebase.js`.

## Deployment

To build the app for production:

```
npm run build
```
or
```
yarn build
```

This will create an optimized production build in the `build` folder that can be deployed to hosting services like Firebase Hosting, Vercel, or Netlify.

## Technologies Used

- React.js
- React Router
- Tailwind CSS
- Firebase (Authentication & Firestore)

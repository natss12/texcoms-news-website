# TEXCOMS News

A responsive news web app built with React, JavaScript (ES6+), and CSS3. Vite provides the development server and production build.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm (included with Node.js)

Check your installed versions:

```sh
node --version
npm --version
```

## Install and run locally

Open a terminal in the `frontend` directory, then install the dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Open the local URL printed in the terminal (typically `http://localhost:5173`). The development server supports hot module replacement as you edit the app. Press `Ctrl+C` in the terminal to stop it.

## Production build and preview

Create an optimized production build:

```sh
npm run build
```

Vite writes the generated site to `dist/`. To run that build locally:

```sh
npm run preview
```

Open the preview URL printed in the terminal (typically `http://localhost:4173`).

## Project structure

```text
src/
  components/       Reusable React UI components
  data/             Local JSON story data
  App.jsx           Application layout and shared state
  main.jsx          React entry point
  site.css          Global and component styles
```

Story and carousel content is currently loaded from `src/data/market-news.json` and `src/data/featured-stories.json`. These files are static frontend data; this app does not connect to a backend or database.

## Available npm scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Serve the production build locally |

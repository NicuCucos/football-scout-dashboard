# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# ⚽ Football Scout Dashboard (React + TypeScript + Vite)

A small single-page **Football Scout Dashboard** that lets a scout:
- search players with filters
- manage a personal watchlist (add/remove + notes)
- browse matches and update match status (admin simulation)

The app communicates with a provided **GraphQL API**.

---

## ✨ Features

### ✅ Player Search
- Search players by query (debounced)
- Filter by position (and team if enabled in UI)
- Responsive grid of player cards
- Watchlist integration (Add → opens notes modal)

### ✅ Watchlist
- Displays watchlist entries with player details + notes
- Remove players from watchlist
- Edit notes via modal (optimistic UI + rollback on error)

### ✅ Matches
- List matches filterable by status and team
- Update match status (SCHEDULED → LIVE → FINISHED etc.) via dropdown
- Optimistic UI update + background revalidation

---

## 🧱 Tech Stack

- **React 18** + **TypeScript**
- **Vite** (fast dev/build)
- **React Router** (routing)
- **@tanstack/react-query** (server-state, caching, optimistic updates)
- **graphql-request** (GraphQL client)
- **Tailwind CSS** (UI styling)
- **react-toastify** (toasts / notifications)

---

## 🚀 Getting Started
npm install
npm run dev
App runs at: http://localhost:5173
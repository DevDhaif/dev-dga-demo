import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@dev-dga/css';
import './tailwind.css'; // after @dev-dga/css so Tailwind's layers register last
import './styles.css'; // fonts + page-canvas theming (overrides base)
// import '../examples/brand.css'; // override css properties with your own brand specs
import { AppRoot } from './AppRoot';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>,
);

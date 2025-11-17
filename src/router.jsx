import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import ProjectDetail from './sections/ProjectDetail';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
    },
    {
      path: '/projects/:slug',
      element: <ProjectDetail />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);


import { RouterProvider } from 'react-router';
import { router } from './routes';
import './styles/globals.css';
import { CinematicBackground } from './components/ui/CinematicBackground';

export default function App() {
  return (
    <>
      <CinematicBackground />
      <RouterProvider router={router} />
    </>
  );
}

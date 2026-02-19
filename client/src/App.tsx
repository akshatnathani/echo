import { RouterProvider } from 'react-router-dom';
import { Providers } from './app/provider';
import { router } from './app/router';
import './styles/index.css';

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;

import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './authProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>,
) 

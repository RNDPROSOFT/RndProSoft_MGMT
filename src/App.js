import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import { ToastProvider } from 'react-toast-notifications';
function App() {
  return (
    
    <>
       <div className='app'>
       <ToastProvider>
        <Navigation/>
        </ToastProvider>
       </div>
    
    </>
  );
}

export default App;

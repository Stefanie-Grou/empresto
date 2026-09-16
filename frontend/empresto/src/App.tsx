import './App.css'
import LoginForm from './login/LoginFormData'
import Welcome from './login/Welcome'

function App() {

  return (
    <div className='App grid grid-cols-2 w-full min-h-screen font-inter'>
      <Welcome />
      <LoginForm />
    </div>
  );
}

export default App

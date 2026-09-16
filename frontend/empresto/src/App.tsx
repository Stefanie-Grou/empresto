import './App.css'
import LoginForm from './login/LoginFormData'
import Welcome from './login/Welcome'

function App() {

  return (
    <div className='App flex font-inter'>
      <Welcome />
      <LoginForm />
    </div>
  );
}

export default App

import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import OtherPage from './OtherPage';
import fib from './fib'

function App() {
  return (
    <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <Link to="/" >Home</Link>
            <Link to="/Otherpage">Other page</Link>
          </header>
          <div>
            <Route exact path="/" component={fib}/>
            <Route path="/Otherpage" component={OtherPage} />
          </div>
        </div>
    </Router>
  );
}

export default App;

import React, { useEffect } from 'react';
import Nav from './features/Nav';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Home from './features/Home';
import Book from './features/Book';
import About from './features/About';
import Menu from './features/Menu';
import Locations from './features/Locations';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'LOG_IN',
      payload: 'Username'
    });
    dispatch({
      type: 'SET_NAME',
      payload: 'Krys'
    });
    dispatch({
      type: 'SET_PHONE_NUMBER',
      payload: '0717'
    })
  }, [])

  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/book' element={<Book />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/about' element={<About />} />
          <Route path='/locations' element={<Locations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

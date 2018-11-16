import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import Catalog from './components/Catalog';
import Comic from './components/Comic';

const Routes = () => (
  <Router>
    <div>
      <Header />
      <Route exact path="/" component={ Catalog } />
      <Route path="/comic" component={ Comic } />
      <Footer />
    </div>
  </Router>
);

export default Routes;
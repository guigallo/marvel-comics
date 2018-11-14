import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Catalog from './components/Catalog';
import Comic from './components/Comic';
import Footer from './components/Footer';

const Routes = () => (
  <Router>
    <div>
      <Route exact path="/" component={ Catalog } />
      <Route path="/comic" component={ Comic } />
      <Footer />
    </div>
  </Router>
);

export default Routes;
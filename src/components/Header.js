import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <AppBar position="static" className="header">
        <Toolbar>
          <Link to="/">
            <h1>Quadrinhos</h1>
          </Link>
        </Toolbar>
      </AppBar>
    );
  }
}

export default Header;
import React, { Component } from 'react';
import './App.css';
import Footer from './components/Footer';
import Marvel from './services/Marvel';

class App extends Component {
  _consulta() {
    const filters = [
      { format: 'comic' },
      { formatType: 'comic' },
      { noVariants: 'true' },
      { title: 'thor' }
    ]
    Marvel.comics(...filters)
      .then(comics => {
        console.log(comics);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    this._consulta();
    return (
      <div>
        <p>teste</p>
        <Footer/>
      </div>
    );
  }
}

export default App;

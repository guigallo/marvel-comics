import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Marvel from '../services/Marvel';
import ComicDetails from './ComicDetails';
import { comicSample } from '../data/comicSample';

class Comic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: 'Carregando quadrinho',
      match: props.match,
      comic: ''
    };
  }

  componentWillMount() {
    const comicId = this.state.match.params.comicId;

    const loadSample = false;
    if(loadSample) {
      this.setState({ comic: comicSample });
    } else {
      Marvel.comicById(comicId)
        .then(comic => this.setState({ comic }))
        .catch(err => err.message);
    }
  }

  render() {
    if(this.state.comic !== '') {
      return <ComicDetails comic={ this.state.comic } />;
    } else {
      return (
        <h3>{this.state.msg}</h3>
      );
    }
  }
}


function idNotGiven() {
  return (<h3>Informe o id do quadrinho.</h3>);
}

function ComicRouterChildern({match}) {
  return (
    <div>
      <Route path={`${match.path}/:comicId`} component={ Comic } />
      <Route exact path={match.path} component={ idNotGiven }/>
    </div>
  );
}

export default ComicRouterChildern;
import React, { Component } from 'react';
import '../css/catalog.css';
import Marvel from '../services/Marvel';
import ComicCard from './ComicCard';
import { catalogSample } from '../data/catalogSample';

function consulta() {
  return new Promise((resolve, reject) => {
    const filters = [
      { format: 'comic' },
      { formatType: 'comic' },
      { noVariants: 'true' },
      { title: 'strange' }
    ]
    Marvel.getComics(...filters)
      .then(comics => {
        console.log(comics);
        resolve(comics);
      })
      .catch(err => {
        reject(err);
      });
  })
}

class Catalog extends Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.state = {catalog: []};
  }
  
  componentWillMount() {
    const loadSample = true;

    if(loadSample) {
      this._jsonToState(catalogSample);
    } else {
      consulta()
        .then(catalog => this._jsonToState(catalog))
        .catch(err => console.log(err));
    }
  }

  _jsonToState(json) {
    let newComics = [];
    json.forEach(comic => {
      let cmc = {
        id: comic.id,
        title: comic.title,
      }
      cmc.creators = comic.creators.items;
      cmc.dates = comic.dates;
      cmc.image = comic.images[0];
      
      newComics.push(cmc);
    });
  
    let newCatalog = this.state.catalog.concat(newComics);
    this.setState({ catalog: newCatalog }, () => {
  
      console.log(this.state.catalog);
    });
  }

  render() {
    if(this.state.catalog.length > 0) {
      return (
        <div className="catalog">
          <div className="container">
            {this.state.catalog.map(comic => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <p>Carregando quadrinhos</p>
      );
    }
  }
}

export default Catalog;
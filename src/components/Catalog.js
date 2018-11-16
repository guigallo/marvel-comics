import React, { Component } from 'react';
import '../css/catalog.css';
import Marvel from '../services/Marvel';
import ComicCard from './ComicCard';
import { catalogSample } from '../data/catalogSample';
import { FILTERS, PAGINATION, PAGINATION_DATA } from '../event-types'
import PubSub from 'pubsub-js';
import Pagination from './Pagination';
import Filters from './Filters';

// 2121,125,22657,20912,20613,1140,20432,19242,164521900-01-01,2018-11-15
class Catalog extends Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.state = {
      msg: '',
      catalog: [],
      currentSearch: '',
      searchHash: '',
      items: 0,
      showingItems: 0,
      page: 0,
      itemsPerPage: 20
    };

    this._search = this._search.bind(this);
    this._pagination = this._pagination.bind(this);
  }
  
  componentWillMount() {
    PubSub.subscribe(FILTERS, this._search);
    PubSub.subscribe(PAGINATION, this._pagination);

    const loadSample = false;
    if(loadSample) {
      this._jsonToState(catalogSample);
    } else {
      this._updateCatalog();
    }
  }

  _pagination(msg, data) {
    let filters = [];
    if(this.state.currentSearch !== '') {
      filters = this.state.currentSearch;
    }
    this.setState({
      page: data.page,
      itemsPerPage: data.itemsPerPage
    }, () => {
      this._updateCatalog(filters);
    });

  }

  _search(msg, data) {
    let newSearchHash = this._getSearchHash(data);
    if(this.state.searchHash !== newSearchHash) {
      this.setState({
        currentSearch: data,
        searchHash: newSearchHash
      }, () => {
        let filters = [];
        this.state.currentSearch.forEach(filter => {
          if(Object.values(filter) !== '') {
            filters.push(filter);
          }
        });
        this._updateCatalog(filters)
      });
    }
  }

  _updateCatalog(filters = []) {
    this.setState({
      catalog: '',
      msg: 'Carregando quadrinhos. '
    }, () => {
      filters.push(
        { limit: this.state.itemsPerPage },
        { offset: this.state.page * this.state.itemsPerPage }
      );
      this._consulta(filters)
        .then(catalog => {
          if (catalog.length > 0) {
            this._jsonToState(catalog);
          } else {
            this.setState({
              msg: 'Nenhum quadrinho encontrado.',
              items: 0,
              showingItems: 0,
              page: 0
            });
          }
        })
        .catch(err => console.log(err))
        .finally(() => {
          PubSub.publish(PAGINATION_DATA, {
            items: this.state.items,
            showingItems: this.state.showingItems,
            page: this.state.page,
            itemsPerPage: this.state.itemsPerPage
          });
        });
    });
  }

  _consulta(filters = []) {
    return new Promise((resolve, reject) => {
      Marvel.getComics(...filters)
        .then(comics => {
          this.setState({
            items: comics.total,
            showingItems: comics.count,
            page: comics.offset / comics.limit
          });
          resolve(comics.results);
        })
        .catch(err => reject(err));
    })
  }

  _getSearchHash(search) {
    let hash = ''
    search.forEach(filter => {
      hash += Object.values(filter);
    });
    return hash;
  }

  _jsonToState(json) {
    let newCatalog = [];
    json.forEach(comic => {
      let cmc = {
        id: comic.id,
        title: comic.title,
      }
      cmc.creators = comic.creators.items;
      cmc.dates = comic.dates;
      cmc.image = comic.images[0];
      
      newCatalog.push(cmc);
    });
  
    this.setState({
      catalog: newCatalog,
      showingItems: newCatalog.length
    });
  }

  render() {
    return (
      <div>
        <Filters />
        <CatalogItems catalog={this.state.catalog} msg={this.state.msg} />
        <Pagination />
      </div>
    );
  }
}

function CatalogItems (props) {
  const catalog = props.catalog;
  const msg = props.msg
  if(catalog.length > 0 ) {
    return (
      <div className="catalog">
        <div className="container">
          {catalog.map(comic => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <p>{msg}</p>
    );
  }
}

export default Catalog;
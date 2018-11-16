import React, { Component } from 'react';
import '../css/catalog.css';
import Marvel from '../services/Marvel';
import ComicCard from './ComicCard';
//import { catalogSample } from '../data/catalogSample';
import { FILTERS, PAGINATION, PAGINATION_DATA } from '../event-types'
import PubSub from 'pubsub-js';
import Pagination from './Pagination';
import Filters from './Filters';

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

function getSearchHash(search) {
  let hash = ''
  search.forEach(filter => {
    hash += Object.values(filter);
  });
  return hash;
}

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

    this.subscribeFilters = this.subscribeFilters.bind(this);
    this.subscribePagination = this.subscribePagination.bind(this);
  }
  
  componentWillMount() {
    PubSub.subscribe(FILTERS, this.subscribeFilters);
    PubSub.subscribe(PAGINATION, this.subscribePagination);

    //this.jsonToState(catalogSample);
    this.updateCatalog();
  }

  subscribeFilters(msg, data) {
    let newSearchHash = getSearchHash(data);
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
        this.updateCatalog(filters)
      });
    }
  }

  subscribePagination(msg, data) {
    let filters = [];
    if(this.state.currentSearch !== '') {
      filters = this.state.currentSearch;
    }
    this.setState({
      page: data.page,
      itemsPerPage: data.itemsPerPage
    }, () => {
      this.updateCatalog(filters);
    });
  }

  updateCatalog(filters = []) {
    this.setState({
      catalog: '',
      msg: 'Carregando quadrinhos. '
    }, () => {
      filters.push(
        { limit: this.state.itemsPerPage },
        { offset: this.state.page * this.state.itemsPerPage }
      );
      this.consulta(filters)
        .then(catalog => {
          if (catalog.length > 0) {
            this.jsonToState(catalog);
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

  consulta(filters = []) {
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

  jsonToState(json) {
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

export default Catalog;
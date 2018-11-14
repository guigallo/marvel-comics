import React, { Component } from 'react';
import './App.css';
import Footer from './components/Footer';
import Marvel from './services/Marvel';
import ComicHelper from './helpers/ComicHelper';

import { dataSample } from './dataSample';

import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button } from '@material-ui/core';

class App extends Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.state = {catalog: []};
  }
  
  componentWillMount() {
    this._jsonToState(dataSample);
    
    /*
    this._consulta()
      .then(catalog => this._jsonToState(catalog))
      .catch(err => console.log(err));
    */
  }

  _consulta() {
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
    //this._consulta();
    if(this.state.catalog.length > 0) {
      return (
        <div>
          <div className="catalog">
            <div className="container">
              {this.state.catalog.map(comic => (
                <Card className="card" key={comic.id}>
                  <CardActionArea>
                    <CardMedia className="media" image={ComicHelper.urlImg(comic)} title={comic.title} />
    
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">{comic.title}</Typography>
                      <Typography component="p">
                        Autor: {ComicHelper.getWriter(comic)}
                      </Typography>
                      <Typography component="p">
                        Data Lançamento: {ComicHelper.onsaleDate(comic)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
    
                  <CardActions>
                    <Button size="small" color="primary">Share</Button>
                    <Button size="small" color="primary">Mais detalhes</Button>
                  </CardActions>
                </Card>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      );
    } else {
      return (
        <div>
          <p>Nenhum quadrinho para mostrar</p>
          <Footer />
        </div>
      );
    }
  }
}

export default App;
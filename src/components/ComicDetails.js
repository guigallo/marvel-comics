import React, { Component } from 'react';
import ComicHelper from '../helpers/ComicHelper';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

function canHide(classBase, value) {
  let classFull = classBase;
  if(value === null || value.length === 0)
    classFull += ' hide';
  return classFull;
}

class ComicDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { comic: props.comic }
  }

  render() {
    return (
      <div className="comic">
        <h2 className="hidebig">{ this.state.comic.title }</h2>

        <div className="bigscreen">
        <img src={ ComicHelper.urlImgFirst(this.state.comic)} alt={ this.state.title } />

        <div className="container">
          <h2 className="hidesmall">{ this.state.comic.title }</h2>
          <div className="paper lancamento">
              <p className="title">Data de lançamento:</p>
              <p className="desc">{ ComicHelper.onsaleDate(this.state.comic) }</p>
          </div>

          <div className={canHide('paper hidebig', this.state.comic.description)}>
              <p className="title">Descrição</p>
              <p className="desc">{ this.state.comic.description }</p>
          </div>

          <div className={canHide('paper', this.state.comic.creators.items)}>
            <h3>Criadores</h3>
            {this.state.comic.creators.items.reverse().map(creator => (
              <div className="section" key={creator.name + creator.role}>
                <p className="title">{ ComicHelper.firstLeterUpper(creator.role) }</p>
                <p className="desc">{ creator.name }</p>
              </div>
            ))}
          </div>

          <div className="paper oficial">
            <p className="title">Página oficial</p>
            <Button variant="contained"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={ ComicHelper.urlMarvel(this.state.comic) }>
              Marvel
            </Button>
          </div>
        </div>
        </div>

        <div className={canHide('paper hidesmall', this.state.comic.description)}>
            <p className="title">Descrição</p>
            <p className="desc">{ this.state.comic.description }</p>
        </div>

        <div className="navigation">
          <Button variant="contained"
                  color="primary"
                  component={ Link } to="/">
            Voltar
          </Button>
        </div>
      </div>
    );
  }
}

export default ComicDetails
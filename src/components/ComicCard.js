import React, { Component } from 'react';
import ComicHelper from '../helpers/ComicHelper';
import { Link } from 'react-router-dom';

import { Card, CardActionArea, CardMedia, CardContent, Typography, CardActions, Button } from '@material-ui/core';

export default class ComicCard extends Component {
  constructor(props) {
    super(props);
    this.state = { comic: this.props.comic };
  }

  render() {
    return (
      <Card className="card">
        <Link to={`/comic/${this.state.comic.id}`}>
          <CardActionArea>
            <CardMedia className="media" image={ComicHelper.urlImg(this.state.comic)} title={this.state.comic.title} />

            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">{this.state.comic.title}</Typography>
              <Typography component="p">
                Autor: {ComicHelper.getWriter(this.state.comic)}
              </Typography>
              <Typography component="p">
                Data Lançamento: {ComicHelper.onsaleDate(this.state.comic)}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Link>

        <CardActions>
          <Button size="small" color="primary">Share</Button>
          <Button size="small" color="primary">Mais detalhes</Button>
        </CardActions>
      </Card>
    );
  }
}
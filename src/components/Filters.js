import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { FILTERS } from '../event-types'
import PubSub from 'pubsub-js';

class Filters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      character: '',
      creator: '',
      dialogCharactersOpen: false
    };

    this.search = this.search.bind(this);
    this.openCharacters = this.openCharacters.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChange = name => event => {
    const newValue = event.target.value;
    this.setState({ [name]: newValue });
  };

  search(e) {
    e.preventDefault();
    let filters = [];

    if(this.state.title !== '')
      filters.push({title: this.state.title});
    if(this.state.character !== '')
      filters.push({character: this.state.character});
    if(this.state.creator !== '')
      filters.push({creator: this.state.creator});
    PubSub.publish(FILTERS, filters);
  }

  handleClose() {
    this.setState({ dialogCharactersOpen: false });
  }

  openCharacters() {
    this.setState({ dialogCharactersOpen: true });
  }

  render() {
    return (
      <div className="filters">
        <form className="container">
          <TextField id="title" name="title" label="Título"
            variant="outlined"
            value={this.state.name}
            onChange={this.handleChange('title')}
          />
          <Button className="personagens" onClick={this.openCharacters}>
            Personagens
          </Button>
          <Button variant="contained" color="primary" onClick={this.search} type="submit" >
            <Icon>send</Icon>
          </Button>
        </form>

        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.state.dialogCharactersOpen}
          onClose={this.handleClose}>
          <DialogTitle>Escolha os personagens</DialogTitle>

          <DialogContent>

          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Filters;
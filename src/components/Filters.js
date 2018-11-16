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
    this.clearFilter = this.clearFilter.bind(this);
  }

  componentDidMount() {
    this.search();
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  search(e) {
    if (e !== undefined) 
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

  clearFilter(e) {
    e.preventDefault();

    this.setState({ title: '' }, () => {
      this.search();
    })
  }

  render() {
    return (
      <div className="filters">
        <form className="container">
          <TextField id="title" name="title" label="Título"
            variant="outlined"
            value={this.state.title}
            onChange={this.handleChange('title')}
          />
          <Button className="personagens" onClick={this.openCharacters}>
            Personagens
          </Button>
          <Button variant="contained" color="default" onClick={this.clearFilter}>
            <Icon>
              <svg viewBox="0 0 24 24">
                <path fill="#000000" d="M14.76,20.83L17.6,18L14.76,15.17L16.17,13.76L19,16.57L21.83,13.76L23.24,15.17L20.43,18L23.24,20.83L21.83,22.24L19,19.4L16.17,22.24L14.76,20.83M12,12V19.88C12.04,20.18 11.94,20.5 11.71,20.71C11.32,21.1 10.69,21.1 10.3,20.71L8.29,18.7C8.06,18.47 7.96,18.16 8,17.87V12H7.97L2.21,4.62C1.87,4.19 1.95,3.56 2.38,3.22C2.57,3.08 2.78,3 3,3V3H17V3C17.22,3 17.43,3.08 17.62,3.22C18.05,3.56 18.13,4.19 17.79,4.62L12.03,12H12Z" />
              </svg>
            </Icon>
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
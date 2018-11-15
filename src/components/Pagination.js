import React from 'react';
import PropTypes from 'prop-types';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import PubSub from 'pubsub-js';
import { PAGINATION, PAGINATION_DATA } from '../event-types';

class PaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { count, page, rowsPerPage } = this.props;

    return (
      <div className="navigate">
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          <FirstPageIcon />
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          <LastPageIcon />
        </IconButton>
      </div>
    );
  }
}

PaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

class CustomPaginationActionsTable extends React.Component {
  state = {
    items: 0,
    page: 0,
    itemsPerPage: 20,
  };

  componentWillMount() {
    PubSub.subscribe(PAGINATION_DATA, (msg, data) => {
      this.setState({
        items: data.items,
        page: data.page,
        itemsPerPage: data.itemsPerPage
      });
    });
  }

  handleChangePage = (event, page) => {
    this.setState({ page }, this.pageChange);
  };

  handleChangeItemsPerPage = event => {
    this.setState({ itemsPerPage: event.target.value }, this.pageChange);
  };

  pageChange() {
    PubSub.publish(PAGINATION, {
      page: this.state.page,
      itemsPerPage: this.state.itemsPerPage
    });
  }

  render() {
    const { items, itemsPerPage, page } = this.state;

    return (
      <Paper className="pagination">
        <Table>
          <TableFooter>
            <TableRow>
              <TablePagination
                labelRowsPerPage="Quadrinhos por pagina:"
                rowsPerPageOptions={[12, 20, 32]}
                count={items}
                rowsPerPage={itemsPerPage}
                page={page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeItemsPerPage}
                ActionsComponent={PaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </Paper>
    );
  }
}

export default CustomPaginationActionsTable;
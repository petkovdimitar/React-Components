import React, {Component} from "react";
import {
    Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, TextField,
    withStyles
} from "material-ui";
import {AFHeading, FlexLayout} from "../../util/utils";
import Moment from 'react-moment';
import moment from "moment";
import * as co from "co";
import TransactionDetails from "./transaction-details";

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {orderBy: "date", order: "desc"};
        props.transactionsProvider.onLoad(() => {
            this.setState({});
        })
    }




    loadTransactions() {
        let self = this;

        if (this.state.order === 'desc') {
            this.setState({order:"asc"});
        } else {
            this.setState({order: "desc"});
        }

        co(function*() {
            yield self.props.transactionsProvider.loadTransactionData(self.state.startDate, self.state.endDate, self.state.currentPage, self.state.orderBy, self.state.order)
        })
    }


    render() {
        const {classes} = this.props;
        return <FlexLayout className={classes.body}>
            <FlexLayout row justifyContent={'space-between'}>
                <AFHeading>Transactions</AFHeading>
                <FlexLayout className={classes.dateContainer} row>
                    <TextField
                        className={classes.marginRight}
                        label="From Date"
                        type="date"
                        defaultValue={moment().subtract(7, 'd').format('YYYY-MM-DD')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => {
                            this.setState({startDate: e.target.value},
                                () => {
                                    this.loadTransactions();
                                });
                        }}
                    />
                    <TextField
                        label="To Date"
                        type="date"
                        defaultValue={moment().format('YYYY-MM-DD')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => {
                            this.setState({endDate: e.target.value},
                                () => {
                                    this.loadTransactions();
                                });
                        }}
                    />
                </FlexLayout>
            </FlexLayout>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell><TableSortLabel direction={this.state.order}
                                                   active={this.state.orderBy === "service_company_name"}
                                                   onClick={(e) => {
                                                       this.setState({orderBy: 'service_company_name'},
                                                           () => {
                                                               this.loadTransactions()
                                                           })
                                                   }}>
                            Affiliation
                        </TableSortLabel>
                        </TableCell>
                        <TableCell><TableSortLabel direction={this.state.order} active={this.state.orderBy === "price"}
                                                   onClick={(e) => {
                                                       this.setState({orderBy: 'price'},
                                                           () => {
                                                               this.loadTransactions()
                                                           })
                                                   }}>
                            Price
                        </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel direction={this.state.order} active={this.state.orderBy === "order_id"}
                                            onClick={(e) => {
                                                this.setState({orderBy: 'order_id'},
                                                    () => {
                                                        this.loadTransactions()
                                                    })
                                            }}>
                                Transaction ID
                            </TableSortLabel>
                        </TableCell>

                        <TableCell>
                            <TableSortLabel direction={this.state.order} active={this.state.orderBy === "date"}
                                            onClick={(e) => {
                                                this.setState({orderBy: 'date'},
                                                    () => {
                                                        this.loadTransactions()
                                                    })
                                            }}>
                                Date
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {

                        this.props.transactionsProvider.transactions &&
                        this.props.transactionsProvider.transactions.map((item, index) => {
                            return <TableRow className={classes.pointer} key={index} onClick={() => {
                                this.setState({openDetails: true, data: item});
                            }
                            }>
                                <TableCell>{item.service_company_name}</TableCell>
                                <TableCell>{item.price}</TableCell>
                                <TableCell>{item.order_id}</TableCell>
                                <TableCell><Moment format="DD MMM YYYY / hh:mm:ss a">{item.date}</Moment></TableCell>
                            </TableRow>
                        })
                    }
                    {

                        !this.props.transactionsProvider.transactions &&
                        <TableRow >
                            <TableCell>N/A</TableCell>
                            <TableCell>N/A</TableCell>
                            <TableCell>N/A</TableCell>
                            <TableCell>N/A</TableCell>
                        </TableRow>

                    }
                    <TransactionDetails data={this.state.data} open={this.state.openDetails} onClose={() => {
                        this.setState({openDetails: false});
                    }}/>
                </TableBody>
            </Table>
            {
                this.props.transactionsProvider.pages &&
                <FlexLayout row justifyContent={"space-between"} className={classes.paginationContainer}>
                    {
                        parseInt(this.props.transactionsProvider.pages.current_page, 10) > 1 &&
                        <span className={classes.pointer} onClick={() => {
                            let currentPage = parseInt(this.props.transactionsProvider.pages.current_page, 10);
                            if (currentPage > 1) {
                                this.setState({currentPage: (currentPage - 1)},
                                    () => {
                                        this.loadTransactions();
                                    });
                            }
                        }}>previous</span>

                    }
                    {
                        parseInt(this.props.transactionsProvider.pages.current_page, 10) === 1 && <span> </span>
                    }
                    <span>{this.props.transactionsProvider.pages.current_page}
                        of {this.props.transactionsProvider.pages.total_pages}</span>
                    {
                        parseInt(this.props.transactionsProvider.pages.current_page, 10) < this.props.transactionsProvider.pages.total_pages &&
                        <span className={classes.pointer} onClick={() => {
                            let currentPage = parseInt(this.props.transactionsProvider.pages.current_page, 10);
                            let totalPages = this.props.transactionsProvider.pages.total_pages;
                            if (currentPage <= totalPages) {
                                this.setState({currentPage: (currentPage + 1)},
                                    () => {
                                        this.loadTransactions();
                                    });
                            }
                        }}>next</span>
                    }
                    {
                        parseInt(this.props.transactionsProvider.pages.current_page, 10) === this.props.transactionsProvider.pages.total_pages &&
                        <span> </span>
                    }
                </FlexLayout>

            }

        </FlexLayout>
    }
}

Transactions = withStyles(() => {
    return {
        body: {
            padding: 30,
            paddingTop: 0
        },
        section: {
            paddingTop: 10,
            paddingBottom: 10
        },
        dateContainer: {
            paddingTop: 25,
            paddingBottom: 15
        },
        paginationContainer: {
            paddingTop: "2em"
        },
        marginRight: {
            marginRight: "1em"
        },
        pointer: {
            cursor: "pointer"
        }
    };
})(Transactions);

export default Transactions;
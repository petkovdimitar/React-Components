import React, {Component} from "react";
import {
    List,
    withStyles
} from "material-ui";
import {Flex, FlexLayout, HoverableNavIconItem} from "../../util/utils";
import SidebarStyle from "../../page-components/SidebarStyle";



class TransactionsSideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {affiliations:"one"};

    }



    render() {
        const {classes} = this.props;
        return <FlexLayout flex={1}>
            <Flex className={classes.scroll}>
                <List component="nav">
                    <HoverableNavIconItem label="Transactions" icon="icon-transaction"
                                          path={`/transactions`}
                                          active={window.location.pathname === `/transactions`}/>
                    <HoverableNavIconItem label="Manage Apps" icon="icon-manage-apps"
                                          path={`/apps`}
                                          active={window.location.pathname === `/apps`}/>
                </List>
            </Flex>

        </FlexLayout>
    }
}

TransactionsSideBar = withStyles(SidebarStyle)(TransactionsSideBar);

export default TransactionsSideBar;
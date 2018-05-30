import React, {Component} from "react";
import {withStyles} from "material-ui";

import SidebarStyle from "../../page-components/SidebarStyle";
import {Flex, FlexLayout} from "../../util/utils";

class WebWidgetSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    intents() {
        return ["Fetch City List", "Fetch Collections List", "Fetch Activity List", "Fetch Activity Details", "Search City", "Check Availability", "Create Itinerary", "Book Itinerary", "Retrieve Trip"]
    }

    render() {
        const {classes} = this.props;
        return <FlexLayout flex={1}>
            <Flex className={classes.scroll}>
            </Flex>
        </FlexLayout>

    }
}

WebWidgetSidebar = withStyles(SidebarStyle)(WebWidgetSidebar);

export default WebWidgetSidebar;

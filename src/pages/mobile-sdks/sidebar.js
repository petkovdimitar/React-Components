import React, {Component} from "react";
import {Collapse, Divider, Icon, List, ListItem, ListItemText, ListSubheader, withStyles} from "material-ui";
import {Link} from "react-router-dom";

import SidebarStyle from "../../page-components/SidebarStyle";

class MobileSDKsSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    intents() {
        return ["Fetch City List", "Fetch Collections List", "Fetch Activity List", "Fetch Activity Details", "Search City", "Check Availability", "Create Itinerary", "Book Itinerary", "Retrieve Trip"]
    }

    render() {
        const {classes} = this.props;
        return <List component={"nav"} style={{flex: 1, overflow: "scroll"}}>
            <ListSubheader className={classes.sidebarHeader} component={"div"}>Getting Started</ListSubheader>
            <Link to="/micro-services">
                <ListItem button>
                    <ListItemText primary={"Your Apps"}/>
                </ListItem>
            </Link>
            <ListItem button onClick={() => {
                this.setState({openSDKs: !this.state.openSDKs});
            }}>
                <ListItemText primary={"SDKs"}/>
                {this.state.openSDKs ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
            </ListItem>
            <Collapse in={this.state.openSDKs} unmountOnExit>
                <List component={"div"}>
                    {
                        ["NodeJS", "Java", "PHP", ".NET"].map(function (item, index) {
                            return <Link key={index} to={`/micro-services/sdk/${item.toLocaleLowerCase()}`}>
                                <ListItem button className={classes.nested}>
                                    <ListItemText primary={item}/>
                                </ListItem>
                            </Link>
                        })
                    }
                </List>
            </Collapse>
            <ListItem button onClick={() => {
                this.setState({openPlaneIntegration: !this.state.openPlaneIntegration});
            }}>
                <ListItemText primary={"Plain API Integration"}/>
                {this.state.openPlaneIntegration ? <Icon>expand_less</Icon> : <Icon>expand_more</Icon>}
            </ListItem>
            <Collapse in={this.state.openPlaneIntegration} unmountOnExit>
                <List component={"div"}>
                    <ListItem button className={classes.nested}>
                        <ListItemText primary={"Authorization"}/>
                    </ListItem>
                    <ListItem button className={classes.nested}>
                        <ListItemText primary={"Sample"}/>
                    </ListItem>
                </List>
            </Collapse>
            <Divider />
            <ListItem button>
                <ListItemText primary={"Micro Services Flow"}/>
            </ListItem>
            <Divider />
            <ListSubheader className={classes.sidebarHeader}
                           component={"div"}>Intent Documentation</ListSubheader>
            {
                this.intents().map(function (item, index) {
                    return <ListItem key={index} button>
                        <ListItemText primary={item}/>
                    </ListItem>
                })
            }
        </List>

    }
}

MobileSDKsSidebar = withStyles(SidebarStyle)(MobileSDKsSidebar);

export default MobileSDKsSidebar;

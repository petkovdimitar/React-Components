import React, {Component} from "react";
import {withStyles} from "material-ui";
import {Route} from "react-router-dom";
import SidebarStyle from "./SidebarStyle";
import {Divider, Flex, FlexLayout} from "../util/utils";
import MobileSDKsSidebar from "../pages/mobile-sdks/sidebar";
import MicroServiceSideBar from "../pages/microservices/sidebar";
import MicroAppSideBar from "../pages/micro-apps/sidebar";
import IntentGeneratorSidebar from "../pages/intent-generator/sidebar";
import WebWidgetSidebar from "../pages/web-widgets/siderbar";
import TransactionsSideBar from "../pages/transactions/sidebar";


class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {};
	    this.props.microServiceProvider.onLoad(()=>{
	    	this.setState({});
	    });
	    this.props.microAppProvider.onLoad(()=>{
		    this.setState({});
	    })
    }

    render() {
        const {classes} = this.props;
        return <Flex>
	        <Route path="/micro-services" render={()=>{
	        	return <MicroServiceSideBar microServiceProvider={this.props.microServiceProvider}/>
	        }}/>
	        <Route path="/micro-apps" render={()=>{
		        return <MicroAppSideBar microAppProvider={this.props.microAppProvider}/>
	        }}/>
	        <Route path="/intent-generator" render={()=>{
		        return <IntentGeneratorSidebar />
	        }}/>
			<Route path="/web-widgets" render={() => {
				return <WebWidgetSidebar />
            }}/>
			<Route path="/transactions" render={() => {
				return <TransactionsSideBar/>
            }}/>
			<Route path="/apps" render={() => {
                return <TransactionsSideBar />
            }}/>
	        <Route path="/mobile-sdks" render={(props)=>{
		        return <FlexLayout row className={classes.sideBar}>
			        <MobileSDKsSidebar location={props.location} />
			        <Divider vertical/>
		        </FlexLayout>
	        }}/>
        </Flex>
    }
}

SideBar = withStyles(SidebarStyle)(SideBar);

export default SideBar;
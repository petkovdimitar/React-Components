import React, {Component} from "react";
import {FlexLayout} from "../../util/utils";
import SidebarStyle from "../../page-components/SidebarStyle";
import {withStyles} from "material-ui";

class IntentGeneratorSidebar extends  Component{

	constructor(props){
		super(props);
		this.state = {};
	}

	modules(){
		return [
			{name:"Micro Services"},
			{name:"Micro Apps"},
			{name:"Web Widgets"}
		]
	}

	render(){
		// const {classes} = this.props;
		return <FlexLayout flex={1} style={{padding:20}}></FlexLayout>
	}
}

IntentGeneratorSidebar = withStyles(SidebarStyle)(IntentGeneratorSidebar)

export default IntentGeneratorSidebar
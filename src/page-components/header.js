import React, {Component} from "react";
import {
    Toolbar,
    withStyles
} from "material-ui";
import {Flex, HoverableNavIconItem} from "../util/utils";

export class Header extends Component{

	constructor(props){
		super(props);
		this.state = {};
	}

	navLinks() {
		return [
			{label: "APIs", url: "/micro-services", icon:"icon-cloud"},
			// {label: "Deep Links", url: "/deep-links",icon:"icon-link"},
			{label: "Mobile SDKs", url: "/micro-apps",icon:"icon-mobile"},
			{label: "Web Widgets", url: "/web-widgets",icon:"icon-grid"},
			// {label: "Search Intents", url: "/intent-generator",icon:"icon-grid"}
		]
	}

	render(){
		const {classes} = this.props;
		return <div className={classes.appBar}>
			<Toolbar>
				<Flex/>
				<div className={classes.flex}/>
				{
					this.navLinks().map(function (item) {
						return <HoverableNavIconItem key={item.url} path={item.url} icon={item.icon} label={item.label} active={window.location.pathname.startsWith(item.url)}>
							</HoverableNavIconItem>
					})
				}
				<div>
				</div>
			</Toolbar>
		</div>
	}
}

Header = withStyles({
	appBar:{
		alignSelf:"start",
		width:784
	}
})(Header);
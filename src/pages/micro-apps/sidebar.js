import React, {Component} from "react";
import {
	Collapse,
	Icon,
	List,
	ListItem, ListItemText, Menu, MenuItem, Paper,
	withStyles
} from "material-ui";
import _ from "underscore"

import SidebarStyle from "../../page-components/SidebarStyle";

import {Flex, FlexLayout, HoverableNavIconItem} from "../../util/utils";
import {NavLink, Route} from "react-router-dom";


class MicroAppSideBar extends Component {

	constructor(props) {
        super(props);
        this.state = {
            language:this.currentSDK()
        };
    }

	currentSDK(){
    	let current = _.find(this.sdks(), (item) => {
		    if(window.location.pathname.split("/")[2]===item.handle){
			    return item;
		    }
	    });
    	return current || this.sdks()[0];
	}

    sdks(){
    	return [
		    {handle:"android", name:"Android", icon:"android"},
            {handle: "ios", name: "iOS", icon: "ios"},
	    ]
    }

	intents(){
		var intents = this.props.microAppProvider.intents || [];
		return _.filter(intents, (item)=>{
			return item.private === "false";
		})
	}

	embedIntents(){
		return _.filter(this.intents(), (item)=>{return item.options?item.options.intentType==="embed":false});
	}

	flowIntents(){
		return _.filter(this.intents(), (item)=>{return item.options?item.options.intentType!=="embed":true});
	}

	render() {
        const {classes} = this.props;
        var self = this;
        return <FlexLayout flex={1}>
	        <Paper className={classes.selectionPadding} elevation={0}>
		        <ListItem button aria-haspopup="true"  onClick={(event) => {
			        this.setState({openLanguageMenu: event.currentTarget});
		        }} disableRipple>
			        <span className={`icon-${this.state.language.icon} ${classes.navIcon}`} style={{fontSize:20}}>
				        {
					        this.state.language.icon_paths &&
					        this.state.language.icon_paths.map((item)=>{
					            return <span key={item} className={item} />
				            })
				        }
			        </span>
			        <ListItemText style={{textTransform:"capitalize"}} primary={this.state.language.name} />
			        <Icon>arrow_drop_down</Icon>
		        </ListItem>
	        </Paper>
	        <Menu anchorPosition={{top:200}} anchorEl={this.state.openLanguageMenu} open={Boolean(this.state.openLanguageMenu)}
	              onClose={() => {
		              this.setState({openLanguageMenu: null});
	              }}>
		        {
		        	this.sdks().map((item, index)=>{
		        		return <Route key={index} render={({history})=>{
					        return <MenuItem disableRipple onClick={()=>{
						        self.setState({language: item, openLanguageMenu: null});
						        let page = window.location.pathname.split("/")[3];
						        let language = window.location.pathname.split("/")[2];
						        if(page==="auth" && language==="plain-api"){
							        history.push(window.location.pathname.replace(language, item.handle).replace("/auth", ""))
						        }
						        else{
							        history.push(window.location.pathname.replace(language, item.handle))
						        }
					        }} style={{width:200}}>
						        <span className={`icon-${item.icon} ${classes.navIcon}`} style={{fontSize:20}}>
							        {
								        item.icon_paths &&
								        item.icon_paths.map((item)=>{
									        return <span key={item} className={item} />
								        })
							        }
						        </span>
						        <ListItemText classes={{primary:classes.primary}}  inset primary={item.name}/>
					        </MenuItem>
				        }}/>
			        })
		        }
	        </Menu>
	        <Flex className={classes.scroll}>
		        <List component="nav">
			        <HoverableNavIconItem label="Getting Started" icon="icon-getting-started" path={`/micro-apps/${this.state.language.handle}`} active={window.location.pathname === `/micro-apps/${this.state.language.handle}`}/>
			        <Collapse in={window.location.pathname==="/micro-apps/java"}>
				        <List className={classes.subNav}>
					        <ListItem>
						        <NavLink as={"a"} to={"#setup"}>
							        <ListItemText primary={"Setup Integration Kit"}/>
						        </NavLink>
					        </ListItem>
					        <ListItem>
						        <NavLink as={"a"} to={"#access-endpoints"}>
							        <ListItemText primary={"Integration"}/>
						        </NavLink>
					        </ListItem>
				        </List>
			        </Collapse>
			        <HoverableNavIconItem label="Transaction Flows" icon="icon-flow" path={`/micro-apps/${this.state.language.handle}/flows`} active={window.location.pathname === `/micro-apps/${this.state.language.handle}/flows`}/>
			        <Collapse in={window.location.pathname===`/micro-apps/${this.state.language.handle}/flows`}>
				        <List component="nav"  className={classes.subNav}>
					        {
						        this.flowIntents().map(function(item, index){
							        return <Route key={index} render={({history})=>{
								        return <ListItem button onClick={()=>{
									        history.push(`${window.location.pathname}#${item.intent}`)
								        }}>
									        <ListItemText primary={item.label}/>
								        </ListItem>
							        }}></Route>
						        })
					        }
				        </List>
			        </Collapse>
			        <HoverableNavIconItem label="Embeds" icon="icon-embed" path={`/micro-apps/${this.state.language.handle}/embeds`} active={window.location.pathname === `/micro-apps/${this.state.language.handle}/embeds`}/>
			        <Collapse in={window.location.pathname===`/micro-apps/${this.state.language.handle}/embeds`}>
				        <List component="nav"  className={classes.subNav}>
					        {
						        this.embedIntents().map(function(item, index){
							        return <Route key={index} render={({history})=>{
								        return <ListItem button onClick={()=>{
									        history.push(`${window.location.pathname}#${item.intent}`)
								        }}>
									        <ListItemText primary={item.label} />
								        </ListItem>
							        }}></Route>
						        })
					        }
				        </List>
			        </Collapse>
		        </List>
	        </Flex>
        </FlexLayout>

    }
}

MicroAppSideBar = withStyles(SidebarStyle)(MicroAppSideBar);

export default MicroAppSideBar;

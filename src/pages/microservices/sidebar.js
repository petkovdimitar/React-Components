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
import {Route} from "react-router-dom";


class MicroServiceSideBar extends Component {

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
		    {handle:"node", name:"Node JS", icon:"node"},
		    {handle:"java", name:"Java", icon:"java", icon_paths:["path1", "path2"]},
		    {handle:"php", name:"PHP", icon:"php"},
		    {handle:"net", name:".Net", icon:"net"},
		    {handle:"plain-api", name:"Plain API", icon:"cloud"},
	    ]
    }

	intents(){
		return this.props.microServiceProvider.intents || [];
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
			        <HoverableNavIconItem label="Getting Started" icon="icon-getting-started" path={`/micro-services/${this.state.language.handle}`} active={window.location.pathname === `/micro-services/${this.state.language.handle}`}/>
			        {/*<Collapse in={window.location.pathname==="/micro-services/java"}>*/}
				        {/*<List className={classes.subNav}>*/}
					        {/*<ListItem>*/}
						        {/*<NavLink as={"a"} to={"#setup"}>*/}
							        {/*<ListItemText primary={"Setup Integration Kit"}/>*/}
						        {/*</NavLink>*/}
					        {/*</ListItem>*/}
					        {/*<ListItem>*/}
						        {/*<NavLink as={"a"} to={"#access-endpoints"}>*/}
							        {/*<ListItemText primary={"Integration"}/>*/}
						        {/*</NavLink>*/}
					        {/*</ListItem>*/}
				        {/*</List>*/}
			        {/*</Collapse>*/}
			        {/*<Route path={"/micro-services/plain-api"} render={()=>{*/}
				        {/*return <HoverableNavIconItem label="Checksum" icon="icon-auth" path={`/micro-services/plain-api/auth`} active={window.location.pathname === `/micro-services/plain-api/auth`}/>*/}
			        {/*}} />*/}
			        <HoverableNavIconItem label="Intent Documents" icon="icon-document" path={`/micro-services/${this.state.language.handle}/intents`} active={window.location.pathname === `/micro-services/${this.state.language.handle}/intents`}/>
			        <Collapse in={window.location.pathname===`/micro-services/${this.state.language.handle}/intents`}>
				        <List component="nav"  className={classes.subNav}>
					        {
						        this.intents().map(function(item, index){
							        return <Route key={index} render={({history})=>{
							        	let path = `${window.location.pathname}#${item.intent}`;
								        return <ListItem button component="a" href={path}>
									        <ListItemText primary={item.label}/>
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

MicroServiceSideBar = withStyles(SidebarStyle)(MicroServiceSideBar);

export default MicroServiceSideBar;
import {NavLink} from "react-router-dom";
import {Divider, FlexLayout} from "../util/utils";
import {
	Collapse, Icon, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Snackbar,
	withStyles
} from "material-ui";
import AuthView from "./auth-dialogue";
import React, {Component} from "react";

class AuthSection extends Component{

	constructor(props){
		super(props);
		this.state = {}
	}

	render(){
		const {classes} = this.props
		return <FlexLayout className={classes.body}>
			<Collapse in={!window.localStorage.getItem("af-token")}>
				<div>
					<ListItem button  onClick={() => {
						this.setState({openLogin: true});
					}}>
						Login
					</ListItem>
					<AuthView authService={this.props.authService} login onError={(msg)=>{this.setState({authErrorMsg:msg})}} openReset={()=>{this.setState({openLogin: false, openReset:true})}} openSignUp={()=>{this.setState({openLogin: false,openSignUp:true})}} open={this.state.openLogin} onClose={() => {
						this.setState({openLogin: false});
					}}/>
					<AuthView authService={this.props.authService} signup onSuccess={(msg)=>{this.setState({msg:msg})}} onError={(msg)=>{this.setState({authErrorMsg:msg})}} openLogin={()=>{this.setState({openSignUp: false,openLogin: true})}} open={this.state.openSignUp} onClose={() => {
						this.setState({openSignUp: false});
					}}/>
					<AuthView authService={this.props.authService} reset onSuccess={(msg)=>{this.setState({msg:msg})}} onError={(msg)=>{this.setState({authErrorMsg:msg})}}  open={this.state.openReset} onClose={() => {
						this.setState({openReset: false});
					}}/>
					<Snackbar
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						open={Boolean(this.state.authErrorMsg||this.state.msg)}
						autoHideDuration={6000}
						onClose={()=>{this.setState({authErrorMsg:null,msg:null})}}
						message={this.state.authErrorMsg||this.state.msg}
					/>
				</div>
			</Collapse>
			<Collapse in={Boolean(window.localStorage.getItem("af-token"))}>
				<div>
					<ListItem button aria-haspopup="true"  onClick={(event) => {
						this.setState({openLoginMenu: event.currentTarget});
					}}>
						<ListItemIcon className={classes.icon}>
							<Icon>account_circle</Icon>
						</ListItemIcon>
						<span style={{textTransform:"capitalize"}}>
							{window.localStorage.getItem("af-profile") && (JSON.parse(window.localStorage.getItem("af-profile")).name)}
						</span>
					</ListItem>
					<Menu anchorEl={this.state.openLoginMenu} open={Boolean(this.state.openLoginMenu)}
					      onClose={() => {
						      this.setState({openLoginMenu: null})
					      }}>
						<MenuItem to={`/apps`} component={NavLink} onClick={() => {
							this.setState({openLoginMenu: null});
						}}>
							<ListItemIcon className={classes.icon}>
								<Icon>apps</Icon>
							</ListItemIcon>
							<ListItemText classes={{primary:classes.primary}} inset primary={"Manage Apps"}/>
						</MenuItem>
						<MenuItem to={`/transactions`} component={NavLink} onClick={()=>{
							this.setState({openLoginMenu: null});
						}}>
							<ListItemIcon className={classes.icon}>
								<Icon>attach_money</Icon>
							</ListItemIcon>
							<ListItemText classes={{primary:classes.primary}} inset primary={"Transactions"}/>
						</MenuItem>
						<Divider/>
						<MenuItem onClick={()=>{
							this.props.authService.logoff();
							this.setState({openLoginMenu: null});
						}}>
							<ListItemIcon className={classes.icon}>
								<Icon>exit_to_app</Icon>
							</ListItemIcon>
							<ListItemText classes={{primary:classes.primary}} inset primary={"Logout"}/>
						</MenuItem>
					</Menu>
				</div>
			</Collapse>
		</FlexLayout>
	}
}


AuthSection = withStyles({
	body:{
		padding:10
	}
})(AuthSection)

export default AuthSection;
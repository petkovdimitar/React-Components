import React, {Component} from "react";
import {AFPrimaryButton, FlexLayout} from "./utils";
import {Dialog, Slide, TextField, Typography, withStyles} from "material-ui";
import co from "co";
import axios from "axios";
import {BASE_URL} from "../auth/config";

class AppCreate extends Component {

	constructor(props){
		super(props);
		this.state = {open:false};
	}

	transition(props) {
		return <Slide direction="up" {...props} />;
	}
	createApp(e){
		let self = this;
		co(function*(){
			let url = `${BASE_URL}/create-app`;
			yield axios.post(url, {name:self.state.appName, desc:self.state.desc, platform_type:self.props.appType}, {
				headers: {
					'Authorization': `Bearer ${window.localStorage.getItem('af-token')}`
				}
			});
			yield self.props.appManager.fetchApps();
			self.setState({open:false});
		});
		e.preventDefault();
	}
	render(){
		const {classes} = this.props;
		return <div>
			<AFPrimaryButton onClick={()=>{this.setState({open:true})}}>
				Create Application
			</AFPrimaryButton>
			<Dialog
				open={this.state.open || false}
				transition={this.transition}
				keepMounted
				onClose={()=>{this.setState({open:false})}}
			>
				<form onSubmit={this.createApp.bind(this)} className={classes.form}>
					<FlexLayout>
						<Typography variant="headline">Create App</Typography>
						<FlexLayout >
							<TextField label="Application Name" margin="dense" onChange={(e) => {
								this.setState({appName: e.target.value});
							}}/>
							<TextField multiline rowsMax="4" label="App Description" margin="dense" onChange={(e) => {
								this.setState({desc: e.target.value});
							}}/>
						</FlexLayout>
						<AFPrimaryButton disableRipple className={classes.submit} type={"submit"} variant="primary" color="primary" >Create</AFPrimaryButton>
					</FlexLayout>
				</form>
			</Dialog>
		</div>
	}
}

AppCreate = withStyles({
	form:{
		padding:30,
		width:300
	},
	submit:{
		marginTop:15
	},
	message:{
		marginTop:15
	}
})(AppCreate);

export default AppCreate
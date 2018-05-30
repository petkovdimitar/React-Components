import React, {Component} from "react";
import {
	ButtonBase, Dialog, Slide, TextField, Typography,
	withStyles
} from "material-ui";
import {AFPrimaryButton, FlexLayout} from "../util/utils";
import co from "co";



class AuthView extends Component{

	constructor(props){
		super(props);
		this.state = {value:0};
		this.authService = props.authService;
	}

	transition(props) {
		return <Slide direction="up" {...props} />;
	}

	login(e){
		const self = this;
		co(function*(){
			try{
				yield self.authService.login(self.state.email, self.state.password);
				self.props.onClose();
			}
			catch(err){
				console.log(err);
				self.props.onError(err.response.data.error_description);
			}
		});
		e.preventDefault();
	}

	reset(e){
		const self = this;
		co(function*(){
			try{
				yield self.authService.reset(self.state.email);
				self.props.onSuccess(`Instructions sent to ${self.state.email}. Thank you.`);
				self.props.onClose();
			}
			catch(err){
				self.props.onError(err.response.data.error_description);
			}
		});
		e.preventDefault();
	}

	signUp(e){
		const self = this;
		co(function*(){
			try{
				yield self.authService.register({
					email:self.state.email,
					password:self.state.password,
					name:self.state.name,
					company:self.state.company,
					role:self.state.role
				});
				if(self.props.onSuccess){
					self.props.onSuccess("Signed up");
				}
				self.props.onClose();
			}
			catch(err){
				self.props.onError(err.response.data.error.message);
			}
		});
		e.preventDefault();
	}

	resetForm(){
		const {classes} = this.props;
		return <form onSubmit={this.reset.bind(this)} className={classes.form}>
			<FlexLayout>
				<Typography variant="headline" gutterBottom>Forgot Password</Typography>
				<Typography variant="body2">
					<FlexLayout row alignItems="center">
						Fill in your registered email and we will send you instructions.
					</FlexLayout>
				</Typography>
				<FlexLayout >
					<TextField name="Email" label="Email" margin="normal" onChange={(e) => {
						this.setState({email: e.target.value});
					}}/>
				</FlexLayout>
				<AFPrimaryButton disableRipple className={classes.submit} type={"submit"} variant="primary" color="primary" >Request Reset</AFPrimaryButton>
			</FlexLayout>
		</form>

	}

	loginForm(){
		const {classes} = this.props;
		return <form onSubmit={this.login.bind(this)} className={classes.form}>
			<FlexLayout>
				<Typography variant="headline" gutterBottom>Sign In</Typography>
				<Typography variant="body2">
					<FlexLayout row alignItems="center">
						Enter your
						<img src="/af_logo.svg" style={{margin:3}} alt="appsfly.io" />
						credentials
					</FlexLayout>
				</Typography>
				<FlexLayout >
					<TextField name="Email" label="Email" margin="normal" type="email" onChange={(e) => {
						this.setState({email: e.target.value});
					}}/>
					<TextField name="Password" type="password" label="Password" margin="normal"
					           onChange={(e) => {
						           this.setState({password: e.target.value});
					           }}/>
					<Typography variant="body1" className={classes.message}>
						<ButtonBase onClick={()=>{this.props.openReset()}}>Forgot Password? </ButtonBase>
					</Typography>
				</FlexLayout>
				<AFPrimaryButton disableRipple className={classes.submit} type={"submit"} variant="primary" color="primary" >Sign In</AFPrimaryButton>
				<Typography variant="body1" className={classes.message}>
					<ButtonBase onClick={()=>{this.props.openSignUp()}}> Don't have account?  Sign up</ButtonBase>
				</Typography>
			</FlexLayout>
		</form>
	}

	signupForm(){
		const {classes} = this.props;
		return <form onSubmit={this.signUp.bind(this)} className={classes.form}>
			<FlexLayout>
				<Typography variant="headline">Sign Up</Typography>
				<FlexLayout >
					<TextField label="Full Name" margin="dense" onChange={(e) => {
						this.setState({name: e.target.value});
					}}/>
					<TextField label="Work Email" margin="dense" onChange={(e) => {
						this.setState({email: e.target.value});
					}}/>
					<TextField label="Company Name" margin="dense" onChange={(e) => {
						this.setState({company: e.target.value});
					}}/>
					<TextField label="Role" margin="dense" onChange={(e) => {
						this.setState({role: e.target.value});
					}}/>
					<TextField name="Password" type="password" label="Password" margin="dense"
					           onChange={(e) => {
						           this.setState({password: e.target.value});
					           }}/>
				</FlexLayout>
				<AFPrimaryButton disableRipple className={classes.submit} type={"submit"} variant="primary" color="primary" >Sign Up</AFPrimaryButton>
				<Typography variant="body1" className={classes.message}>
					<ButtonBase onClick={()=>{this.props.openLogin()}}> Already have an account? Sign In</ButtonBase>
				</Typography>
			</FlexLayout>
		</form>
	}

	render(){
		return (<Dialog
			open={this.props.open || false}
			transition={this.transition}
			keepMounted
			onClose={this.props.onClose}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
		>
			{this.props.login && this.loginForm()}
			{this.props.signup && this.signupForm()}
			{this.props.reset && this.resetForm()}
		</Dialog>)
	}
}

AuthView = withStyles({
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
})(AuthView);

export default AuthView;
import React, {Component} from "react";
import {Icon, ListItem, ListItemText, Menu, MenuItem, Paper, Typography, withStyles} from "material-ui";
import {
	AFEditor, AFHeading, Flex,
	FlexLayout, AFNote
} from "../../../util/utils";
import CreateAppSection from "../create-app-section";
import {MICROSERVICE_ID} from "../../../auth/config";
import _ from "underscore"
import AppCreate from "../../../util/create-app";

class GettingStartedJava extends Component{

	constructor(props){
		super(props);
		this.state = {};
		this.props.appsManager.onLoad(()=>{
			this.setState({});
		})
	}

	selectedMicroService(){
		if(this.props.appsManager.microModules("micro-service").length){
			return this.state.selectedMicroService || _.find(this.props.appsManager.microModules("micro-service"), (item)=>{return item.platform_type==="micro-service"});
		}
	}

	render(){
		const {classes} = this.props;
		return <FlexLayout className={classes.body}>
			<FlexLayout row className={classes.javaInfo} alignItems={"center"}>
				<img src="/logos/java.png" style={{marginLeft:20, marginRight:20, height:30}} alt="java"/>
				<FlexLayout>
					<Typography variant="headline" gutterBottom>
						Integration Kit : Java
					</Typography>
					<div className={classes.javaInfoDesc}>
						This library contains resources to help integrate our micro-services.
					</div>
				</FlexLayout>
			</FlexLayout>
			<CreateAppSection appsManager={this.props.appsManager} appType={"micro-service"}/>
			<AFHeading ref={"setup"}>Setup Integration Kit</AFHeading>
			<Typography variant={"title"} gutterBottom>
				Setup with Maven
			</Typography>
			<Typography variant={"body2"}>
				Repository
			</Typography>
			<AFEditor
				mode="xml"
				value={
					`<!-- Add repo to root pom.xml -->
					|<repositories>
					|    <repository>
					|        <id>jitpack.io</id>
					|        <url>https://jitpack.io</url>
					|    </repository>
					|</repositories>`.split("\n").map((item)=>{
						return item.trim().replace("|", "")
					}).join("\n")
				}
			/>
			<Typography variant={"body2"}>
				Dependency
			</Typography>
			<AFEditor
				mode="xml"
				value={
					`<!-- Add the dependency -->
					|<dependencies>
					|    <dependency>
					|        <groupId>com.github.appsflyio</groupId>
					|        <artifactId>java-integration-kit</artifactId>
					|        <version>0.0.11</version>
					|    </dependency>
					|</dependencies>`.split("\n").map((item)=>{
						return item.trim().replace("|", "")
					}).join("\n")
				}
			/>
			<Typography variant={"title"} gutterBottom>
				Setup with Gradle
			</Typography>
			<Typography variant={"body2"}>
				Repository
			</Typography>
			<AFEditor
				mode="groovy"
				value={
					`// Add the repo
					|allprojects {
					|    repositories {
					|        ...
					|        maven { url 'https://jitpack.io' }
					|    }
					|}`.split("\n").map((item)=>{
						return item.trim().replace("|", "")
					}).join("\n")
				}
			/>
			<Typography variant={"body2"}>
				Dependency
			</Typography>
			<AFEditor
				mode="groovy"
				value={
					`// Add Dependency
					|dependencies {
					|    compile 'com.github.appsflyio:java-integration-kit:0.0.11'
					|}`.split("\n").map((item)=>{
						return item.trim().replace("|", "")
					}).join("\n")
				}
			/>
			<FlexLayout row alignItems={"center"}>
				<AFHeading ref={"access-endpoints"}>Integrate & Create AppInstance</AFHeading>
				<Flex />
				{
					!this.selectedMicroService() &&
					<AppCreate appType={"micro-service"} appsManager={this.props.appsManager}/>
				}
				{
					this.selectedMicroService() &&
					<Paper className={classes.selectionPadding} elevation={0}>
						<ListItem button aria-haspopup="true" onClick={(event) => {
							this.setState({openMicroServiceMenu: event.currentTarget});
						}} disableRipple>
							<ListItemText style={{textTransform: "capitalize"}}
							              primary={this.selectedMicroService().name}/>
							<Icon>arrow_drop_down</Icon>
						</ListItem>
					</Paper>
				}
				{
					<Menu anchorEl={this.state.openMicroServiceMenu} open={Boolean(this.state.openMicroServiceMenu)}
					      onClose={() => {
						      this.setState({openMicroServiceMenu: null})
					      }}
					      PaperProps={{
						      style: {
							      maxHeight: 48 * 4.5
						      },
					      }}
					>
					{
						this.props.appsManager.microModules("micro-service") &&
						this.props.appsManager.microModules("micro-service").map((app, index) => {
							return <MenuItem key={index} onClick={() => {
								this.setState({selectedMicroService: app, openMicroServiceMenu: null});
							}}>
							{app.name}
							</MenuItem>
						})
					}
					</Menu>
				}
			</FlexLayout>
			<Typography variant={"body2"}>
				Create App Instance
			</Typography>
			<AFEditor
				mode="text/x-java"
				value={
					`// Integration Config
					|AppInstance.AFConfig config = new AppInstance.AFConfig(
					|    "${this.selectedMicroService() ? this.selectedMicroService().app_key : 'XXX-XXX-XXX'}",
					|    "${this.selectedMicroService() ? this.selectedMicroService().secret_key: 'XXXXXXXXXXXXXXXX'}"
					|);
                    |AppInstance instance = new AppInstance(config, "${MICROSERVICE_ID}");
					`.split("\n").map((item)=>{
						return item.trim().replace("|", "")
					}).join("\n")
				}
			/>
			<Typography variant={"body2"}>
				Execution
			</Typography>
			<AFEditor
				mode="text/x-java"
				value={
					`// AppInstance Execution Asynchronous
					|instance.exec(INTENT, PAYLOAD, UUID, new Callback() {
					|    @Override
					|    public void onResponse(JSONObject response) {
					|        // We have already verified the checksum from you
					|    }
					|
					|    @Override
					|    public void onError(JSONObject error) {
					|        // Handle error
					|    }
					|});
					`.split("\n").map((item)=>{
						return item.trim().replace("|", "")
					}).join("\n")
				}
			/>

			<AFEditor
				mode="text/x-java"
				value={
					`// AppInstance Execution synchronous
					|try {
					|    Object response = instance.execSync(INTENT, PAYLOAD, UUID);
					|} catch (AppsflyException e) {
					|    e.printStackTrace();
					|}`.split("\n").map((item)=>{
						return item.trim().replace("|", "")
					}).join("\n")
				}
			/>
            <Typography variant={"body2"}>
                Access Endpoint
            </Typography>
            <div style={{marginBottom:20}}> Go through our <a href="/micro-services/java/intents">Intent Documents</a> to access our micro-services.</div>
            <AFNote body={"Please provide module handle, intent & intent data. Also please provide unique user id (UUID) for whom you are accessing this service. UUID will help us in avoiding rate limit conflicts."}/>
		</FlexLayout>
	}
}


GettingStartedJava = withStyles((theme)=>{
	return {
		body:{
			padding:30
		},
		javaInfo:{
			padding:20,
			border:"1px solid #E6EAEF",
			borderRadius:3
		},
		javaInfoDesc:{
			color:theme.secondaryTextColor
		}
	}
})(GettingStartedJava);

export default GettingStartedJava;
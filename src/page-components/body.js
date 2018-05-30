import React, {Component} from "react";
import {withStyles} from "material-ui";
import {Route} from "react-router-dom";
import {Divider, FlexLayout} from "../util/utils";
import MobileSDKsSidebar from "../pages/mobile-sdks/sidebar";
import GettingStartedJava from "../pages/microservices/sdk-java/index";
import NodeJSSDK from "../pages/microservices/sdk-node-js/index";
import DotNETSDK from "../pages/microservices/sdk-.net/index";
import Intents from "../pages/microservices/intentdocs/intents";
import Deeplink from "../pages/deeplinks";
import PhpSDK from "../pages/microservices/sdk-php/index";
import ApiIntegration from "../pages/microservices/api-integration/index";
import Embeds from "../pages/micro-apps/embeds";
import MicroAppIntents from "../pages/micro-apps/intents";
import IntegrationDownshift from "../pages/intent-generator";
import WebWidgets from "../pages/web-widgets/index";
import GettingStartedAndroid from "../pages/micro-apps/getting-started-android";
import Transactions from "../pages/transactions/index";
import AppsComponent from "../pages/manage-apps";


class Body extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.props.microServiceProvider.onLoad(()=>{
			this.setState({});
		})
	}

    componentWillReceiveProps(nextProps) {
        if(nextProps.loginFlag!==undefined){
        	this.setState({loginFlag: nextProps.loginFlag});
        }
    }

	render() {
		const {classes} = this.props;
		return <div className={classes.body}>
			<div className={classes.bodyContent}>

				<Route path="/micro-services/plain-api"  exact render={(props) => {
                    return <ApiIntegration loginFlag={this.state.loginFlag} appsManager={this.props.appsManager}/>
                }}/>

				<Route path="/micro-services/java" exact render={(props)=>{
					return <GettingStartedJava  appsManager={this.props.appsManager} />
				}}/>

				<Route path="/deep-links" exact render={(props)=>{
					return <Deeplink />
				}}/>

				<Route path="/micro-services/*/intents" exact render={(props)=>{
					return <Intents microServiceProvider={this.props.microServiceProvider} />
				}}/>

				<Route path="/micro-apps/*/flows" exact render={(props)=>{
					return <MicroAppIntents microAppProvider={this.props.microAppProvider} />
				}}/>

				<Route path="/micro-apps/android" exact render={(props) => {
					return <GettingStartedAndroid>Test</GettingStartedAndroid>
                }}/>

				<Route path="/micro-apps/*/embeds" exact render={(props)=>{
					return <Embeds microAppProvider={this.props.microAppProvider} />
				}}/>

				<Route path="/micro-services/node" exact render={(props) => {
	                return <NodeJSSDK appsManager={this.props.appsManager}/>
	            }}/>
					<Route path="/micro-services/php" exact render={(props) => {
	                    return <PhpSDK appsManager={this.props.appsManager}/>
	                }}/>
				<Route path="/micro-services/net" exact render={(props) => {
	                return <DotNETSDK appsManager={this.props.appsManager} />
	            }}/>
				<Route path="/apps" exact render={(props) => {
					return <AppsComponent appsManager={this.props.appsManager} />
				}}/>
				<Route path="/transactions" exact render={(props) => {
					return <Transactions transactionsProvider={this.props.transactionsProvider}/>
                }}/>

				<Route path="/intent-generator" exact render={(props) => {
					return <IntegrationDownshift  />
				}}/>

				<Route path="/web-widgets" exact render={(props) => {
                    return <WebWidgets webWidgetProvider={this.props.webWidgetProvider} />
                }}/>
				<Route path="/mobile-sdks" render={(props)=>{
					return <FlexLayout row className={classes.sideBar}>
						<MobileSDKsSidebar location={props.location} />
						<Divider vertical/>
					</FlexLayout>
				}}/>
			</div>
		</div>
	}
}

Body = withStyles({
	body:{
		overflowY:"scroll",
		width:"100%"
	},
	bodyContent:{
		width:783
	}
})(Body);

export default Body;
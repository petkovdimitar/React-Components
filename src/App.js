import React, {Component} from "react";
import "./App.css";
import {
	MuiThemeProvider,
	Toolbar, withStyles
} from "material-ui";
import {Divider, FlexLayout} from "./util/utils";
import {Header} from "./page-components/header";
import {BrowserRouter as Router, Route} from "react-router-dom";
import AuthSection from "./auth/auth-section"
import SideBar from "./page-components/sidebar";
import axios from "axios";
import {BASE_URL, CLIENT_ID, CLIENT_SECRET, MICROAPP_ID, MICROSERVICE_ID, WEB_MICROAPP_ID} from "./auth/config";
import co from "co";
import Body from "./page-components/body";
import Theme from "./util/theme";
import _ from "underscore";
import moment from "moment";


class MicroAppProvider {

	constructor(authService){
		this.authService = authService;
	}

	*fetchMicroAppDetails() {
		let url = `${BASE_URL}/modules/${MICROAPP_ID}/fetch-intents`;
		let response = yield axios.get(url);
		this.intents = Object.keys(response.data).map((item)=>{
			response.data[item]["intent"] = item;
			return response.data[item];
		});
		if(this.callbacks){
			this.callbacks.forEach((func)=>{
				func.call()
			});
		}
	}
	onLoad(func){
		if(!this.callbacks){
			this.callbacks = [];
		}
		this.callbacks.push(func);
	}
}
class MicroSerivceProvider {

	constructor(authService){
		this.authService = authService;
	}

	*fetchMicroServiceDetails() {
		let url = `${BASE_URL}/modules/${MICROSERVICE_ID}/fetch-intents`;
		let response = yield axios.get(url);
        this.intents = _.sortBy(Object.keys(response.data).map((item)=>{
            response.data[item]["intent"] = item;
            return response.data[item];
        }), 'position');
		if(this.callbacks){
			this.callbacks.forEach((func)=>{
				func.call()
			});
		}
	}

	onLoad(func){
		if(!this.callbacks){
			this.callbacks = [];
		}
		this.callbacks.push(func);
	}
}
class WebWidgetProvider {

	constructor(authService){
		this.authService = authService;
		this.authService.onLogin(() => {
			let self = this;
			co(function*() {
				yield self.getWidgetDetail();
			})
		});
	}

	*getWidgetDetail() {
		let url = `${BASE_URL}/modules/${WEB_MICROAPP_ID}/fetch-intents`;
		let response = yield axios.get(url);
		this.intents = _.sortBy(Object.keys(response.data).map((item)=>{
			response.data[item]["intent"] = item;
			return response.data[item];
		}), 'position');
		if(this.callbacks){
			this.callbacks.forEach((func)=>{
				func.call()
			});
		}
	}

	onLoad(func){
		if(!this.callbacks){
			this.callbacks = [];
		}
		this.callbacks.push(func);
	}
}
class Auth {

	constructor(){
		this.loginCallbacks = [];
		this.logoffCallbacks = [];
		this.isLoggedIn = Boolean(window.localStorage.getItem('af-token'));
	}

	*register(details){
		let url = `${BASE_URL}/register`;
		let response = yield axios.post(url, details);
		return response;
	}

	onLogin(callback){
		if(this.isLoggedIn){
			callback.call();
		}
		this.loginCallbacks.push(callback);
	}

	onLogOff(callback){
		if(!this.isLoggedIn){
			callback.call();
		}
		this.logoffCallbacks.push(callback);
	}

	notifyLogin(){
		this.isLoggedIn = true;
		_.each(this.loginCallbacks, function(item){item.call()})
	}

	notifyLogOff(){
		this.isLoggedIn = false;
		_.each(this.logoffCallbacks, function(item){item.call()})
	}

	*reset(email){
		let url = `${BASE_URL}/request-reset`;
		let response = yield axios.post(url, {email:email});
		return response;
	}

	logoff(){
		window.localStorage.removeItem("af-token");
		window.localStorage.removeItem("af-profile");
		this.notifyLogOff();
	}

	*login(userName, password) {
		let url = `${BASE_URL}/oauth/access_token`;
		let profileUrl = `${BASE_URL}/user`;
		let data = `grant_type=password&username=${userName}&password=${password}&scope=profile&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
		let response = yield axios.post(url, data, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		});
		window.localStorage.setItem('af-token', response.data.access_token);
		this.notifyLogin();
		let userProfileResponse = yield axios.get(profileUrl, {
			headers: {
				'Authorization': `Bearer ${response.data.access_token}`
			}
		});
		window.localStorage.setItem('af-profile', JSON.stringify(userProfileResponse.data));
		return response;
	}
}
class TransactionsProvider {
    constructor(authService) {
        this.authService = authService;
        this.authService.onLogin(() => {
            let self = this;
            co(function*() {
	            yield self.loadTransactionData()
            })
        });
        this.authService.onLogOff(() => {
            this.transactions = undefined;
            this.notifyLoad();
        })
    }

    notifyLoad() {
        if (this.callbacks) {
            this.callbacks.forEach((func) => {
                func.call()
            });
        }

    }

    onLoad(func) {
        if (!this.callbacks) {
            this.callbacks = [];
        }
        this.callbacks.push(func);
    }

    *loadTransactionData(startDate,endDate,currentPage, field, order) {
        let sort={};

        startDate = !startDate ? moment(moment().subtract(7, 'd')).valueOf() : moment(startDate, "YYYY-MM-DD").valueOf();

        endDate = !endDate ? moment().valueOf() : moment(endDate, "YYYY-MM-DD").valueOf();

		if(!currentPage){
        	currentPage = 1
		}

		if(!field){
            field="date"
		};


		if(!order){
            order="desc"
		}

		sort[field]=order;

        let url = `${BASE_URL}/publisher-tracker/transactions?page=${currentPage}&count=10`;
        let token = window.localStorage.getItem("af-token");
        try{

	        let response = yield axios.post(url,
					{
					"filter": {"to": endDate, "from": startDate},
					sort
			        }, {headers: {Authorization: "Bearer " + token}});

	        this.pages = response.data.page
	        this.transactions = response.data.results;
	        this.notifyLoad();

        } catch(err){

        	if(err.response.status===401){
        		this.authService.logoff();
	        }

        }
    }

}
class AppsManager {

	constructor(authService){
		this.authService = authService;
		this.authService.onLogin(()=>{
			let self = this;
			co(function*(){
				yield self.fetchApps()
			})
		});
		this.authService.onLogOff(()=>{
			this.apps = undefined;
			this.notifyLoad();
		})
	}

	microModules(type){
		return  _.filter(this.apps, (item)=>{return item.platform_type===type})
	}

	*fetchApps(){
		let authToken = `Bearer ${window.localStorage.getItem("af-token")}`;
		let url = `${BASE_URL}/apps`;
		let response = yield axios.get(url, {'headers': {'Authorization': authToken}})
		this.apps = response.data.results;
		this.isReady = true;
		this.notifyLoad();
	}

    *changeAppStatus(id) {
        let authToken = `Bearer ${window.localStorage.getItem("af-token")}`;
        let url = `${BASE_URL}/apps/${id}/status`;
        let response = yield axios.get(url, {'headers': {'Authorization': authToken}});
       	return response;
    }

    *updateApp(id,name){
        let authToken = `Bearer ${window.localStorage.getItem("af-token")}`;
        let url = `${BASE_URL}/update-app/${id}`;
        let data = {name:name};
        let response = yield axios.put(url,data, {'headers': {'Authorization': authToken}});
        return response;
	}

	notifyLoad(){
		if(this.callbacks){
			this.callbacks.forEach((func)=>{
				func.call()
			});
		}
	}

	onLoad(func){
		if(!this.callbacks){
			this.callbacks = [];
		}
		this.callbacks.push(func);
	}

	getAppsOfType(type){
		if(!type){
			return this.apps;
		}else{
			return _.filter(this.apps, function(item){
				return item.platform_type === type;
			})
		}
	}
}




class App extends Component {

	constructor(props){
		super(props);
		this.state = {};
		this.setupAuth();
		this.setupMicroServiceProvider();
		this.setupMicroAppProvider();
		this.setupWebWidgetProvider();
		this.setupAppsManager();
		this.setupTransactionsService();
	}

	setupWebWidgetProvider(){
		this.webWidgetProvider = new WebWidgetProvider(this.authService);
		this.webWidgetProvider.onLoad(()=>{
			this.setState({});
		});
		let self = this;
		co(function *() {
			yield self.webWidgetProvider.getWidgetDetail();
		});
	}

	setupTransactionsService(){
		this.transactionsProvider = new TransactionsProvider(this.authService);
	}

	setupMicroServiceProvider(){
		this.microServiceProvider = new MicroSerivceProvider(this.authService);
		this.microServiceProvider.onLoad(()=>{
			this.setState({});
		});
		let self = this;
		co(function *() {
            yield self.microServiceProvider.fetchMicroServiceDetails();
		});
	}

	setupMicroAppProvider(){
		this.microAppProvider = new MicroAppProvider(this.authService);
		this.microAppProvider.onLoad(()=>{
			this.setState({});
		});
		let self = this;
		co(function *() {
			yield self.microAppProvider.fetchMicroAppDetails();
		});
	}

	setupAppsManager(){
		this.appsManager = new AppsManager(this.authService);
		this.appsManager.onLoad(()=>{
			this.setState({});
		});
	}

    setupTransactionsProvider() {
        this.transactionsProvider = new TransactionsProvider(this.authService);
        this.transactionsProvider.onLoad(() => {
            this.setState({});
        });
    }

	setupAuth() {
		this.authService = new Auth();
	}

	render(){
        const {classes} = this.props;
    	return(<MuiThemeProvider theme={Theme}>
	            <Router>
				    <div>
					    <FlexLayout className={classes.sidebar}>
						    <Toolbar className={classes.appLogo} disableGutters>
							    <FlexLayout alignItems="center" flex={1}>
								    <FlexLayout row alignItems="center" flex={1}>
									    <img alt="Cleartrip" src="/ct_icon.png" width="100"/>
									    <span className={classes.flex} style={{padding: 8}} color="inherit">Local</span>
								    </FlexLayout>
							    </FlexLayout>
						    </Toolbar>
						    <SideBar transactionsProvider={this.transactionsProvider} microServiceProvider={this.microServiceProvider} microAppProvider={this.microAppProvider} appsManager={this.appsManager} />
						    <Divider />
						    <AuthSection authService={this.authService} />
					    </FlexLayout>
					    <FlexLayout className={classes.body}>
						    <Header />
						    <Divider />
						    <Body loginFlag={this.state.loginFlag}
						          microServiceProvider={this.microServiceProvider}
						          microAppProvider={this.microAppProvider}
						          transactionsProvider={this.transactionsProvider}
						          webWidgetProvider={this.webWidgetProvider}
						          appsManager={this.appsManager} />
					    </FlexLayout>
					    <Route path="/micro-services" exact render={({history})=>{
						    history.push("/micro-services/node");
						    return <span></span>
					    }}/>
					    <Route path="/micro-apps" exact render={({history})=>{
						    history.push("/micro-apps/android");
						    return <span></span>
					    }}/>
					    <Route path="/transactions" exact render={({history})=>{
					    	if(!this.authService.isLoggedIn){
							    history.push("/");
						    }
						    return <span></span>
					    }}/>
				    </div>
		    </Router>
		    </MuiThemeProvider>)
	}
}

App = withStyles(()=>{
	return {
		logo:{
			padding:10
		},
		sidebar:{
			position:"absolute",
			bottom:0,
			top:0,
			width:300,
			paddingLeft:"calc((100% - 1024px)/2)"
		},
		body:{
			position:"absolute",
			borderLeft:"1px solid #E6EAEF",
			background:"#FFF",
			bottom:0,
			top:0,
			right:0,
			left:"calc(((100% - 1024px)/2) + 300px)"
		}
	}
})(App);


export default App;

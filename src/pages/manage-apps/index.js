import React, {Component} from "react";
import {AFHeading, FlexLayout} from "../../util/utils";
import {Tab, Table, TableBody, TableCell, TableHead, TableRow, Tabs, withStyles} from "material-ui";
import co from "co";
import AppCreate from "../../util/create-app";
import AppUpdateModal from "./update-apps";



class AppsList extends Component{

    constructor(props) {
        super(props);
        this.state = {};
    }

    refreshAppList(){
        let self = this;
        co(function*() {
            yield self.props.appsManager.fetchApps();
        })
    }

    render(){
        const {classes} = this.props;
        return <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>App name</TableCell>
                        <TableCell>App Key</TableCell>
                        <TableCell>Platform type</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        !this.props.appsManager.isReady && <div>Loading...</div>
                    }
                    {
                        this.props.appsManager.isReady &&
                        this.props.appsManager.getAppsOfType(this.props.appsType).map(app => {
                            return (
                                <TableRow key={app._id}>
                                    <TableCell>{app.name}</TableCell>
                                    <TableCell>{app.app_key}</TableCell>
                                    <TableCell>{app.platform_type}</TableCell>
                                    <TableCell>{app.desc}</TableCell>
                                    <TableCell  className={classes.pointer} onClick={() => {
                                        this.setState({openModal: true, appData:app});
                                    }
                                    }><span className="icon-edit"></span></TableCell>
                                </TableRow>

                            )
                        })
                    }
                    {
                        this.state.openModal &&
                        <AppUpdateModal appsManager={this.props.appsManager} open={this.state.openModal} data={this.state.appData} onClose={() => {
                            this.refreshAppList();this.setState({openModal: false});
                        }}/>
                    }
                </TableBody>
            </Table>
    }
}

AppsList = withStyles(() => {
    return {
        pointer: {
            cursor: "pointer"
        }
    }
})(AppsList);

class AppsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {};
	    this.appsManager = this.props.appsManager;
    }

	componentWillMount() {
        let self = this;
        co(function*(){
	        yield self.appsManager.fetchApps();
	        self.setState({currentTab:0});
        })
    }

    render() {
        const {classes} = this.props;
        return <FlexLayout className={classes.body}>
                    <FlexLayout row alignItems={"center"} justifyContent={"space-between"}>
                        <AFHeading>Manage Apps</AFHeading>
                        <AppCreate appType={this.props.appType} appsManager={this.appsManager}/>
                    </FlexLayout>
                    <FlexLayout>
                        {
                            this.appsManager.isReady &&
                            <div>
	                            <Tabs value={this.state.currentTab} onChange={(event, value)=>{this.setState({currentTab:value})}}>
		                            <Tab label="All" ></Tab>
		                            <Tab label="APIs" ></Tab>
		                            <Tab label="Web Widgets" ></Tab>
		                            <Tab label="Mobile Apps"></Tab>
	                            </Tabs>
                                { this.state.currentTab === 0 && <AppsList appsManager={this.appsManager}/>}
                                { this.state.currentTab === 1 &&
                                <AppsList appsManager={this.appsManager} appsType={"micro-service"}/>}
                                { this.state.currentTab === 2 &&
                                <AppsList appsManager={this.appsManager} appsType={"web-widget"}/>}
                                { this.state.currentTab === 3 &&
                                <AppsList appsManager={this.appsManager} appsType={"micro-app"}/>}
                            </div>
                        }
	                    {!this.appsManager.isReady && <div>Loading...</div>}
                    </FlexLayout>
        </FlexLayout>
    }
}

AppsComponent = withStyles(()=>{
    return{
        body: {
            padding: 30,
            paddingTop: 0
        },
        pointer: {
            cursor: "pointer"
        }
    }
})(AppsComponent);

export default AppsComponent;

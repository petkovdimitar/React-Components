import React, {Component} from "react";
import {Icon, ListItem, ListItemText, Menu, MenuItem, Paper, Typography, withStyles} from "material-ui";
import {AFEditor, AFHeading, AFNote, Flex, FlexLayout} from "../../../util/utils";
import CreateAppSection from "../create-app-section";
import {MICROSERVICE_ID} from "../../../auth/config";
import _ from "underscore"


class NodeJSSDK extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        props.appsManager.onLoad(()=>{
	        this.setState({});
        });

    }

    selectedMicroService() {
        if (this.props.appsManager.apps) {
            return this.state.selectedMicroService || _.find(this.props.appsManager.apps, (item) => {
                return item.platform_type === "micro-service"
            });
        }
    }

    render() {
        let {classes} = this.props;
        return <FlexLayout className={classes.body}>
            <FlexLayout row className={classes.nodeInfo} alignItems={"center"}>
                <img src="/logos/nodejs.png" style={{marginLeft: 20, marginRight: 20, height: 30}} alt="java"/>
                <FlexLayout>
                    <Typography variant="headline" gutterBottom>
                        Integration Kit : NodeJS
                    </Typography>
                    <div className={classes.nodeInfoDesc}>
                        This library contains resources to help communicate with our micro-services.
                    </div>
                </FlexLayout>
            </FlexLayout>

	        <CreateAppSection appsManager={this.props.appsManager} appType={"micro-service"}/>
            <AFHeading>Install Node modules</AFHeading>
            <AFEditor
                mode="javascript"
                value={`npm install node-integration-kit --save`}
            />
            <FlexLayout row alignItems={"center"}>
                <AFHeading id={"access-endpoints"}>Integration</AFHeading>
                <Flex />
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
			            {this.props.appsManager.apps &&
			            this.props.appsManager.apps.map((app, index) => {
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
                mode="javascript"
                lineFlag
                value={
                    `var nodeIntegrationKit = require("node-integration-kit");
                    |var instance = new nodeIntegrationKit.AppInstance({
                    |    secret:"${this.selectedMicroService() ? this.selectedMicroService().secret_key : 'XXXXXXXXXXXXXXXX'}",
                    |    appKey:"${this.selectedMicroService() ? this.selectedMicroService().app_key : 'XXX-XXX-XXX'}"
                    |});`.split("\n").map((item) => {
                        return item.trim().replace("|", "")
                    }).join("\n")
                }
            />
            <Typography variant={"body2"}>
                Execution
            </Typography>
            <AFEditor
                mode="javascript"
                lineFlag
                value={
					`instance.exec("${MICROSERVICE_ID}", INTENT, PAYLOAD, UUID)
					|.then(function(result){
                    |   //Handle Result
                    |}).else(function(error){
                    |   //Handle Error
                    |});`.split("\n").map((item) => {
                        return item.trim().replace("|", "")
                    }).join("\n")
                }
            />
            <Typography variant={"body2"}>
                Access Endpoint
            </Typography>
            <div style={{marginBottom:20}}> Go through our <a href="/micro-services/node/intents">Intent Documents</a> to access our micro-services.</div>
            <AFNote body={"Please provide module handle, intent & intent data. Also please provide unique user id (UUID) for whom you are accessing this service. UUID will help us in avoiding rate limit conflicts."}/>
        </FlexLayout>
    }
}

NodeJSSDK = withStyles((theme) => {
    return {
        body: {
            padding: 30
        },
        nodeInfo: {
            padding: 20,
            border: "1px solid #E6EAEF",
            borderRadius: 3
        },
        nodeInfoDesc: {
            color: theme.secondaryTextColor
        }
    }
})(NodeJSSDK);

export default NodeJSSDK;
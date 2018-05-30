import React, {Component} from "react";
import {Icon, ListItem, ListItemText, Menu, MenuItem, Paper, Typography, withStyles} from "material-ui";
import {AFEditor, AFHeading, AFPrimaryButton, Flex, FlexLayout, AFNote} from "../../../util/utils";
import CreateAppSection from "../create-app-section";
import {MICROSERVICE_ID} from "../../../auth/config";
import _ from "underscore"


class DotNETSDK extends Component {
    constructor(props) {
        super(props);
        this.state = {};
	    this.props.appsManager.onLoad(()=>{
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
            <FlexLayout row className={classes.dotNetInfo} alignItems={"center"}>
                <img src="/logos/dotnet.png" style={{marginLeft: 20, marginRight: 20, height: 30}} alt="dotnet"/>
                <FlexLayout>
                    <Typography variant="headline" gutterBottom>
                        Integration Kit : .NET
                    </Typography>
                    <div className={classes.dotNetInfoDesc}>
                        This library contains resources to help communicate with our micro-services.
                    </div>
                </FlexLayout>
            </FlexLayout>
	        <CreateAppSection appsManager={this.props.appsManager}/>
            <AFHeading>Setup DLL</AFHeading>
            <FlexLayout row alignItems={"center"}>
                Start by downloading the .dll file. Then add the namespace "dotnet_integration_kit".
                <Flex/>
                <form action="https://github.com/appsflyio/dotnet-integration-kit/raw/master/dotnet-integration-kit/bin/Release/netstandard2.0/dotnet-integration-kit.dll">
                    <AFPrimaryButton type="submit">
                        Download .dll
                    </AFPrimaryButton>
                </form>
            </FlexLayout>
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
                <Menu  anchorEl={this.state.openMicroServiceMenu} open={Boolean(this.state.openMicroServiceMenu)}
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
            </FlexLayout>
            <Typography variant={"body2"}>
                Create App Instance
            </Typography>
            <AFEditor
                mode="clike"
                value={
                    `|AppInstance.AFConfig config = new AppInstance.AFConfig("${this.selectedMicroService() ? this.selectedMicroService().app_key : 'XXX-XXX-XXX'}","${this.selectedMicroService() ? this.selectedMicroService().secret_key : 'XXXXXXXXXXXXXXXX'}");
                     |AppInstance instance = new AppInstance(config, "${MICROSERVICE_ID}");`.split("\n").map((item) => {
                        return item.trim().replace("|", "")
                    }).join("\n")
                }
            />
            <Typography variant={"body2"}>
                Execution
            </Typography>
            <AFEditor
                mode="clike"
                value={
                    `|instance.exec(INTENT, PAYLOAD, UUID, (error, result) => {
                     |    Console.WriteLine(result);
                     |});
                     |//OR
                     |var response = instance.execSync(INTENT, PAYLOAD, UUID);`.split("\n").map((item) => {
                        return item.trim().replace("|", "")
                    }).join("\n")
                }
            />
            <Typography variant={"body2"}>
                Access Endpoint
            </Typography>
            <div style={{marginBottom:20}}> Go through our <a href="/micro-services/net/intents">Intent Documents</a> to access our micro-services.</div>
            <AFNote body={"Please provide module handle, intent & intent data. Also please provide unique user id (UUID) for whom you are accessing this service. UUID will help us in avoiding rate limit conflicts."}/>
        </FlexLayout>
    }
}


DotNETSDK = withStyles((theme)=>{
    return {
        body:{
            padding:30
        },
        dotNetInfo:{
            padding:20,
            border:"1px solid #E6EAEF",
            borderRadius:3
        },
        dotNetInfoDesc:{
            color:theme.secondaryTextColor
        }
    }
})(DotNETSDK);

export default DotNETSDK;
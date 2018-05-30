import React, {Component} from "react";
import {AFEditor, AFHeading, Flex, FlexLayout, AFNote} from "../../../util/utils";
import CreateAppSection from "../create-app-section";
import {Icon, ListItem, ListItemText, Menu, MenuItem, Paper, Typography, withStyles} from "material-ui";
import {MICROSERVICE_ID} from "../../../auth/config";
import _ from "underscore"


class PhpSDK extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.props.appsManager.onLoad(() => {
            this.setState({});
        })
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
            <FlexLayout row className={classes.phpInfo} alignItems={"center"}>
                <img src="/logos/php.png" style={{marginLeft: 20, marginRight: 20, height: 30}} alt="java"/>
                <FlexLayout>
                    <Typography variant="headline" gutterBottom>
                        Integration Kit : PHP
                    </Typography>
                    <div className={classes.phpInfoDesc}>
                        This library contains resources to help communicate with our micro-services.
                    </div>
                </FlexLayout>
            </FlexLayout>

            <CreateAppSection appsManager={this.props.appsManager}/>
            <AFHeading>Install PHP dependencies</AFHeading>
            <AFEditor
                mode="php"
                value={`composer require appsfly/php-integration-kit`}
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
                mode="php"
                value={
                    `<?php
                    |    include 'app_instance.php';
                    |    $repo_url="https://hub.appsfly.io/executor";
                    |    $secret_key="${this.selectedMicroService() ? this.selectedMicroService().secret_key : 'XXXXXXXXXXXXXXXX'}";
                    |    $app_key="${this.selectedMicroService() ? this.selectedMicroService().app_key : 'XXX-XXX-XXX'}";
                    |    $config = new AFConfig($repo_url,$secret_key,$app_key);
                    |    $microModuleId="${MICROSERVICE_ID}";
                    |    $app_instance = new AFAppInstance($config,$microModuleId);
                    |    $intent = "fetch_cities";
                    |    $arr = new StdClass();
                    |    $intent_data=json_encode($arr);
                    |?>`.split("\n").map((item) => {
                        return item.trim().replace("|", "")
                    }).join("\n")
                }
            />
            <Typography variant={"body2"}>
                Execution
            </Typography>
            <AFEditor
                mode="php"
                value={
                    `<?php
                    |    echo $app_instance->exec($intent,$intent_data,$uuid");
                    |?>`.split("\n").map((item) => {
                        return item.trim().replace("|", "")
                    }).join("\n")
                }
            />
            <Typography variant={"body2"}>
                Access Endpoint
            </Typography>
            <div style={{marginBottom:20}}> Go through our <a href="/micro-services/php/intents">Intent Documents</a> to access our micro-services.</div>
            <AFNote body={"Please provide module handle, intent & intent data. Also please provide unique user id (UUID) for whom you are accessing this service. UUID will help us in avoiding rate limit conflicts."}/>
        </FlexLayout>
    }
}

PhpSDK = withStyles((theme) => {
    return {
        body: {
            padding: 30
        },
        phpInfo: {
            padding: 20,
            border: "1px solid #E6EAEF",
            borderRadius: 3
        },
        phpInfoDesc: {
            color: theme.secondaryTextColor
        }
    }
})(PhpSDK);

export default PhpSDK;
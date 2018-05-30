import React, {Component} from "react";
import {AFEditor, AFHeading, AFNote, Flex, FlexLayout} from "../../../util/utils";
import {
    Icon,
    ListItem, ListItemText, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography,
    withStyles
} from "material-ui";
import _ from "underscore"


class ApiIntegration extends Component {
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
        let headers = [
            {key: "X-UUID", description: "UniqueID to identify user session"},
            {key: "X-App-Key", description: `Application key to identify the publisher instance`},
            {
                key: "X-Module-Handle",
                description: "Each micromodule of a service provider is identified by MODULE_HANDLE"
            },
            {key: "X-Encrypted", description: "BOOLEAN"},
            {key: "Content-Type", description: "Must be 'text / plain'"}
        ];

        return <FlexLayout className={classes.body}>
            <FlexLayout row className={classes.apiInfo} alignItems={"center"}>
                <img src="/logos/api.png" style={{marginLeft: 20, marginRight: 20, height: 30}} alt="java"/>
                <FlexLayout>
                    <Typography variant="headline" gutterBottom>
                       Plain API
                    </Typography>
                    <div className={classes.apiInfoDesc}>
                        appsfly.io exposes a single API endpoint to access Microservices directly.
                    </div>
                </FlexLayout>
            </FlexLayout>

            <FlexLayout row alignItems={"center"}>
                <AFHeading>Endpoint</AFHeading>
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
            </FlexLayout>

            <Typography variant={"subheading"} gutterBottom>
                Method : <code>POST</code>
            </Typography>
            <AFEditor
                mode="curl"
                value={`https://hub.appsfly.io/executor/exec`}
            />

            <AFHeading id={"access-endpoints"}>Header</AFHeading>


            <Paper elevation={0} gutterBottom>
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>HEADER</TableCell>
                            <TableCell>DESCRIPTION</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            headers.map((item, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{item.key}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </Paper>

            <AFHeading>Body</AFHeading>
            <div>Body must have the encrypted checksum for the following JSON. Please use JWT to generate and verify checksum.</div>
            <AFEditor
                mode="javascript"
                value={`{
                        |    "intent":INTENT ('Intent is like an endpoint you are accessing to send messages'),
                        |    "data":PAYLOAD
                        }`.split("\n").map((item) => {
                    return item.trim().replace("|", "")
                }).join("\n")}
            />
            <div>Covert the above JSON to string and append it to key "af_claim" as follows:</div>
            <AFEditor
                mode="javascript"
                value={`{"af_claim": "{\\"intent\\":\\"INTENT\\", \\"data\\":\\"PAYLOAD\\"}"}`}
            />

            <FlexLayout row alignItems={"center"}>
                <AFHeading id={"jwt-io`"}>JWT.IO</AFHeading>
            </FlexLayout>

            <div>The body of the request has to be encrypted using JWT. </div>

            <div>JWT gives support for a wide range of languages. Pick the language of your choosing and encrypt the message. Use <a href="http://jwt.io">jwt.io</a> for reference.</div>

            <div>Algorithm: HS256</div>
            {/*<AFEditor
                mode="bash"
                value={`curl -X POST
                        |    https://hub.appsfly.io/executor/exec
                        |    -H 'X-App-Key: ${this.selectedMicroService() ? this.selectedMicroService().app_key : 'XXX-XXX-XXX'}'
                        |    -H 'Content-Type: text/plain'
                        |    -H 'X-Encrypted: true'
                        |    -H 'X-Module-Handle: ${MICROSERVICE_ID}'
                        |    -H 'X-UUID: test@appsfly.io'
                        |    -d eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhZl9jbGFpbSI6IntcImludGVudFwiOlwiSU5URU5UXCIsXCJkYXRhXCI6XCJQQVlMT0FEXCJ9In0.ZPUfElCCO2FiSQwtur6t80kHFTOzsvnJGQ-j_70WZ0k
                        `.split("\n").map((item) => {
                    return item.trim().replace("|", "")
                }).join("\n")}
            />*/}



            <Typography variant={"body2"}>
                Access Endpoint
            </Typography>
            <div style={{marginBottom:20}}> Go through our <a href="/micro-services/plain-api/intents">Intent Documents</a> to access our micro-services.</div>
            <AFNote body={"Please provide module handle, intent & intent data. Also please provide unique user id (UUID) for whom you are accessing this service. UUID will help us in avoiding rate limit conflicts."}/>


        </FlexLayout>
    }
}


ApiIntegration = withStyles((theme) => {
    return {
        body: {
            padding: 30
        },
        apiInfo: {
            padding: 20,
            border: "1px solid #E6EAEF",
            borderRadius: 3
        },
        apiInfoDesc: {
            color: theme.secondaryTextColor
        }
    }
})(ApiIntegration);

export default ApiIntegration;
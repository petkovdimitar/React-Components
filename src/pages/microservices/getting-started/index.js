import React, {Component} from "react";
import {FlexLayout} from "../../../util/utils";
import {Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, withStyles} from "material-ui";
import AppStyle from "../../../AppStyle";

class GettingStarted extends Component{
    constructor(props) {
        super(props);
        this.state = {};
    }

	render(){
        let {classes} = this.props;

        let applicationParams = [
            {
                key: "SECRET_KEY",
                description: "Secret Key is required for encryption. Secret Key should be generated on the Appsfly publisher dashboard"
            },
            {key: "APP_KEY", description: "Application key to identify the publisher instance"},
            {key: "EXECUTOR_URL", description: "Url to reach appsfly.io Microservices"}

        ];
        let microModuleParams = [
            {
                key: "MODULE_HANDLE",
                description: "Each micromodule of a service provider is identified by MODULE_HANDLE"
            },
            {key: "UUID", description: "UniqueID to identify user session"}
        ];
        let intentParams = [
            {key: "INTENT", description: "Intent is like an endpoint you are accessing to send messages"},
            {key: "PAYLOAD", description: "Data payload"}
        ]


        return <FlexLayout flex={1} className={classes.contentContainer}>
			<div style={{padding: "1em"}}>
				<Typography variant={'display1'} component={"h2"} gutterBottom>
					appsfly.io Dev Kit Utils
				</Typography>
				<Typography gutterBottom component={"p"} className={classes.paragraph}>
					These library contains resources to help communicate with appsfly.io execution server. For all
					communications with execution server, your application should be registered and a secret key
					needs
					to be generated.
				</Typography>
				<Typography gutterBottom component={"p"} className={classes.paragraph}>
					Please contact <a href="mailto:integrations@appsfly.io"
									  color={"primary"}>integrations@appsfly.io</a>
					for your credientials.
				</Typography>

                {/*<Divider/>*/}

				<FlexLayout className={classes.segment}>
					<Typography component={"h2"} variant={'title'} gutterBottom>
						Application Params
					</Typography>
					<Paper className={classes.paramContainer}>
						<Table >
							<TableHead>
								<TableRow>
									<TableCell>KEY</TableCell>
									<TableCell>DESCRIPTION</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
                                {
                                    applicationParams.map((item, index) => {
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
				</FlexLayout>


				<FlexLayout className={classes.segment}>
					<Typography component={"h2"} variant={'title'} gutterBottom>
						Micro Module Params
					</Typography>
					<Paper className={classes.paramContainer}>
						<Table >
							<TableHead>
								<TableRow>
									<TableCell>KEY</TableCell>
									<TableCell>DESCRIPTION</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
                                {
                                    microModuleParams.map((item, index) => {
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
				</FlexLayout>

				<FlexLayout className={classes.segment}>
					<Typography component={"h2"} variant={'title'} gutterBottom>
						Intent Params
					</Typography>
					<Paper className={classes.paramContainer}>
						<Table >
							<TableHead>
								<TableRow>
									<TableCell>KEY</TableCell>
									<TableCell>DESCRIPTION</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
                                {
                                    intentParams.map((item, index) => {
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
				</FlexLayout>
			</div>

		</FlexLayout>
    }
}

GettingStarted = withStyles(AppStyle)(GettingStarted);


export default GettingStarted;
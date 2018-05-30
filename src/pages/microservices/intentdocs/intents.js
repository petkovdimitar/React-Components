import React, {Component} from "react";
import {
    Typography,
    withStyles
} from "material-ui";
import {
    AFIntentCodeBlock, Divider,
    FlexLayout
} from "../../../util/utils";
import {Route} from "react-router-dom";

class Intents extends Component {

	constructor(props){
		super(props);
		this.state = {};
	}

	render(){
		const {classes} = this.props;
		return <FlexLayout className={classes.body}>
			<Typography variant={"display1"} gutterBottom>
				Intent Documentation
			</Typography>
			<p>
				All our endpoints are accessable with intents and intent data. This document is the API specification for Cleartrip API Platform, V1.0.
			</p>
			{ this.props.microServiceProvider.intents &&
				this.props.microServiceProvider.intents.map((intent, index)=>{
					return <FlexLayout key={index} className={classes.section}>
						<Typography id={intent.intent} variant={"title"} gutterBottom>{intent.label}</Typography>
						<Typography variant={"subheading"} gutterBottom>
							intent : <code>{intent.intent}</code>
						</Typography>
						<Typography variant={"body1"} gutterBottom>{intent.desc}</Typography>
                        <Route path="/micro-services/java/intents" exact render={() => {
                        	let requestCode =`String intentInputString = ${JSON.stringify(JSON.stringify(JSON.parse(intent.request), null, 2)).replace(/\\n/g, "\"+\n\"")};`;
                            let execCode = `JSONObject intentObj = new JSONObject(intentInputString);
									|AppInstance provider = new AppInstance(config, "MODULE_HANDLE");
									|try {
									|    Object object = provider.execSync("${intent.intent}", JSONObject("PAYLOAD"), "UUID");
									|} catch (AppsflyException e) {
									|    e.printStackTrace();
									|}`.split("\n").map((item) => {
                                return item.trim().replace("|", "")
                            }).join("\n");
	                        var responseCode = "";
	                        try{
                                responseCode = JSON.stringify(JSON.parse(intent.response), null, 2);
	                        }catch(err){

	                        }
                            return <AFIntentCodeBlock requestCode={requestCode} execCode={execCode} responseCode={responseCode} />
                        }}/>

						<Route path="/micro-services/php/intents" exact render={() => {
                            let requestCode = `<?php
                            					|    include '../app_instance.php';
                            					|    /*Check documentation for configuration details*/
                            					|    $app_instance = new AFAppInstance($config,$microModuleId);
                            					|    $intent = "${intent.intent}";
                            					|    $arr = '${intent.request}';
                            					|    $intent_data=json_encode($arr);
                            					`.split("\n").map((item) => {
                                return item.trim().replace("|", "")
                            }).join("\n");
                            let execCode = `echo $app_instance->exec("$intent",$intent_data,"generic");`.split("\n").map((item) => {
                                return item.trim().replace("|", "")
                            }).join("\n");
                            var responseCode = "";
                            try {
                                responseCode = JSON.stringify(JSON.parse(intent.response), null, 2);
                            } catch (err) {

                            }
                            return <AFIntentCodeBlock requestCode={requestCode} execCode={execCode}
													  responseCode={responseCode}/>
                        }}/>

						<Route path="/micro-services/net/intents" exact render={() => {
                            let requestCode = `/*Check documentation to download util DLL and configuration details*/
                            					|AppInstance activitiesProvider = new AppInstance(config, "MODULE_HANDLE");
                            					|string payload = ${JSON.stringify(JSON.stringify(JSON.parse(intent.request), null, 2)).replace(/\\n/g, "\"+\n\"")};`.split("\n").map((item) => {
                                return item.trim().replace("|", "")
                            }).join("\n");
                            let execCode = `activitiesProvider.exec('${intent.intent}', payload, "UUID", (error,result) => { Console.WriteLine(result) });`.split("\n").map((item) => {
                                return item.trim().replace("|", "")
                            }).join("\n");
                            var responseCode = "";
                            try {
                                responseCode = JSON.stringify(JSON.parse(intent.response), null, 2);
                            } catch (err) {

                            }
                            return <AFIntentCodeBlock requestCode={requestCode} execCode={execCode}
													  responseCode={responseCode}/>
                        }}/>

						<Route path="/micro-services/node/intents" exact render={() => {
                            let requestCode = `/*Check documentation to install node module and configuration details*/
                            					|var app = new nodeIntegrationKit.AppInstance({secret:"SECRET_KEY", appKey:"APP_KEY"});
                            					|var intent = '${intent.intent}'
                            					|var PAYLOAD = ${intent.request}`.split("\n").map((item) => {
                                return item.trim().replace("|", "")
                            }).join("\n");
                            let execCode = `app.exec("MODULE_HANDLE", intent, PAYLOAD, UUID).then(function(result){
                            			   |    //Handle Result
                            			   |}).else(function(error){
                            			   |    //Handle Error
                            			   |});`.split("\n").map((item) => {
                                return item.trim().replace("|", "")
                            }).join("\n");
                            var responseCode = "";
                            try {
                                responseCode = JSON.stringify(JSON.parse(intent.response), null, 2);
                            } catch (err) {

                            }
                            return <AFIntentCodeBlock requestCode={requestCode} execCode={execCode}
													  responseCode={responseCode}/>
                        }}/>

						<Route path="/micro-services/plain-api/intents" exact render={() => {
                            let requestCode = `body=$(cat  << EOF
                            					|{
  												|"af_claim": "{\\"intent\\":\\"${intent.intent}\\",
  												|\\"data\\":\\"${JSON.stringify(JSON.stringify(JSON.parse(intent.request), null, 2)).replace(/\\n/g, "\"+\n\"")};\\"}"
												|}
                            					|EOF
                            					|)
                            					|#Body must have the encrypted checksum for the following JSON. Please use JWT to generate and verify checksum.`.split("\n").map((item) => {
                                return item.trim().replace("|", "")
                            }).join("\n");
                            let execCode =`/*Check documentation for configuration details*/
                            			   |curl -H @{'X-UUID'='af-test'} -H @{'X-App-Key'='XXX-XXX-XXX'} -H @{'X-Module-Handle'='MODULE_HANDLE'} -H @{'X-Checksum'='checksum'} -H "Content-Type: 'text/plain'" -X POST -d "$body"  http://hub.appsfly.io/executor/executor/exec`.split("\n").map((item) => {
                                return item.trim().replace("|", "")
                            }).join("\n");
                            var responseCode = "";
                            try {
                                responseCode = `#Decrypt the response using JWT to get the following response:
                                			  |${JSON.stringify(JSON.parse(intent.response), null, 2)}`.split("\n").map((item) => {
                                    return item.trim().replace("|", "")
                                }).join("\n");
                            } catch (err) {

                            }
							return <AFIntentCodeBlock requestCode={requestCode} execCode={execCode}
													  responseCode={responseCode}/>
                        }}/>
						<Divider></Divider>
					</FlexLayout>
				})
			}
		</FlexLayout>
	}
}


Intents = withStyles(()=>{
	return {
		body:{
			padding:30
		},
		section:{
			paddingTop:10,
			paddingBottom:10
		}
	};
})(Intents);

export default Intents;
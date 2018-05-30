import React, {Component} from "react";
import {
	Typography,
	withStyles
} from "material-ui";
import {
	AFEditor,
	AFHeading, Divider,
	FlexLayout
} from "../../../util/utils";
import _ from "underscore";
import {MICROAPP_ID} from "../../../auth/config";

class MicroAppIntents extends Component{

	constructor(props){
		super(props);
		this.state = {};
	}

	intents(){
		var intents = this.props.microAppProvider.intents || [];
		return _.filter(intents, (item)=>{
			return item.private === "false";
		})
	}
	flowIntents(){
		return _.filter(this.intents(), (item)=>{return item.options?item.options.intentType!=="embed":true});
	}


	render(){
		const {classes} = this.props;
		return <FlexLayout className={classes.body}>
			<Typography variant={"display1"} gutterBottom>
				Transaction Flows
			</Typography>
			{
				this.flowIntents().map((intent)=>{
					return <div key={intent.label}>
						<FlexLayout row style={{padding:10}}>
							<FlexLayout>
								<AFHeading>{intent.label}</AFHeading>
								<div>Intent : <code>{intent.intent}</code></div>
								<div>{intent.desc}</div>
								<AFEditor
									mode="clike"
									value={
										`MicroAppLauncher.pushApp(
										|	"${MICROAPP_ID}",
										|	"${intent.intent}",
										|	intentData,
										|	activity
										|);`.split("\n").map((item)=>{
											return item.trim().replace("|", "")
										}).join("\n")
									}
								/>
							</FlexLayout>
							<FlexLayout style={{padding:10}}>
								<img alt="img" src={intent.demourl} className={classes.intent_img}/>
							</FlexLayout>
						</FlexLayout>
						<Divider/>
					</div>
				})
			}
		</FlexLayout>
	}
}


MicroAppIntents = withStyles(()=>{
	return {
		intent_img:{
			border:"1px solid #E6EAEF",
			width:200
		},
		body:{
			padding:30
		},
		section:{
			paddingTop:10,
			paddingBottom:10
		}
	};
})(MicroAppIntents);

export default MicroAppIntents;
import React, {Component} from "react";
import {AFEditor, AFHeading, Divider, FlexLayout} from "../../../util/utils";
import {Typography, withStyles} from "material-ui";
import _ from "underscore";
import {MICROAPP_ID} from "../../../auth/config";

class Embeds extends Component{

	intents(){
		var intents = this.props.microAppProvider.intents || [];
		return _.filter(intents, (item)=>{
			return item.private === "false";
		})
	}

	embedIntents(){
		return _.filter(this.intents(), (item)=>{return item.options?item.options.intentType==="embed":false});
	}

	render(){
		const {classes} = this.props;
		return <FlexLayout className={classes.body}>
			<Typography variant={"display1"} gutterBottom>
				Transaction Flows
			</Typography>
			{
				this.embedIntents().map((intent)=>{
					return <div key={intent.label}>
						<FlexLayout row style={{padding:10}}>
							<FlexLayout>
								<AFHeading>{intent.label}</AFHeading>
								<div>Intent : <code>{intent.intent}</code></div>
								<div>{intent.desc}</div>
								<AFEditor
									mode="clike"
									value={
										`MicroAppLauncher.addEmbedFragment(
										|	"${MICROAPP_ID}",
										|	"${intent.intent}",
										|	PAYLOAD,
										|	ACTIVITY,
										|	CONTAINER_VIEW);`
										.split("\n").map((item)=>{
											return item.trim().replace("|", "")
										}).join("\n")
									}
								/>
							</FlexLayout>
							<FlexLayout style={{padding:10}}>
								<img src={intent.demourl} className={classes.intent_img} alt="img"/>
							</FlexLayout>
						</FlexLayout>
						<Divider/>
					</div>
				})
			}
		</FlexLayout>
	}
}

Embeds = withStyles(()=>{
	return {
		body:{
			padding:30
		},
		section:{
			paddingTop:10,
			paddingBottom:10
		}
	};
})(Embeds);

export default Embeds;
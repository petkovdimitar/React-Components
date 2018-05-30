import React, {Component} from "react";
import _ from "underscore";
import AppCreate from "../../util/create-app";
import {AFHeading, Flex, FlexLayout} from "../../util/utils";

class CreateAppSection extends Component{
	render(){
		return <div>
			{ (_.find(this.props.appsManager.microModules(this.props.type), (item)=>{return item.type===this.props.type})) &&
			<div>
				<AFHeading>Register your application</AFHeading>
				<FlexLayout row alignItems={"center"}>
					To access our Micro Services you need to register your application with us.
					<Flex/>
					<AppCreate appType={this.props.appType} appsManager={this.props.appsManager}/>
				</FlexLayout>
			</div>
			}
		</div>
	}
}


export default CreateAppSection

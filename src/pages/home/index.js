import React, {Component} from "react";
import {withStyles} from "material-ui";
import {FlexLayout} from "../../util/utils";
import "../../content/content_style.css"

class Home extends Component{
	constructor(props){
		super(props);
		this.state = {};
	}
	componentWillMount() {
		const homePath = require("../../content/home.htmlx");
		fetch(homePath)
			.then(response => {
				return response.text()
			})
			.then(text => {
				this.setState({
					markdown: text
				})
		})
	}
	render(){
		const {classes} = this.props;
		return <FlexLayout flex={1} alignItems={"center"} className={classes.scroll}>
				<FlexLayout style={{width:"80%"}}>
					<div dangerouslySetInnerHTML={{__html: this.state.markdown}} className={`${classes.content} md-content`}></div>
				</FlexLayout>
			</FlexLayout>
	}
}

Home = withStyles({
	content:{
		display:"flex",
		flexDirection:"column",
		alignItems:"stretch"
	},
	scroll:{
		overflow:"scroll"
	}
})(Home);
export default Home;
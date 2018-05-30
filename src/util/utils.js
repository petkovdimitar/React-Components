import React, {Component} from "react";
import _ from "underscore";
import {
	ButtonBase,  ListItem, ListItemText,  Step,
	StepContent,
	StepLabel,
	Stepper,
	Typography,
	withStyles
} from "material-ui";
import {NavLink} from "react-router-dom";
import Highlight from "react-highlight";
import CodeBlock from 'react-copy-code';
import {REPO_URL, WIDGET_URL} from "../auth/config";

export class Flex extends Component{
	render(){
		return (<FlexLayout {...this.props} style={{flex:"1"}}>{this.props.children}</FlexLayout>)
	}
}

class _AFPrimaryButton extends Component{
	render(){
		const {classes} = this.props
		return <ButtonBase {...this.props} className={`${this.props.className} ${classes.primary}`}/>
	}
}

export const AFPrimaryButton = withStyles((theme)=>{return {
	root:{
		backgroundColor:theme.afPrimaryColor,
		borderRadius:3,
		color:"#FFF",
		textTransform:"uppercase",
		padding:10,
		textAlign:"center"
	}
}})(_AFPrimaryButton);

class _HoverableNavIconItem extends Component {
	constructor(props){
		super(props);
		this.state = {};
	}
	render() {
		const {classes} = this.props;
		let active = this.state.active || this.props.active;
		return <NavLink to={this.props.path} >
			<ListItem onMouseEnter={()=>{this.setState({active:true})}} onMouseLeave={()=>{this.setState({active:false})}}>
					<span className={`${classes.navIcon} ${this.props.icon} ${active?'active':''}`}></span>
					<ListItemText primary={this.props.label} />
			</ListItem>
		</NavLink>
	}
}

export const HoverableNavIconItem = withStyles((theme)=>{return {
	navIcon:{
		color:theme.afPrimaryColor
	}
}})(_HoverableNavIconItem);


export class Divider extends Component {
    render() {
        if (this.props.vertical) {
            return <div style={{backgroundColor: "#E6EAEF", minWidth: 1}}/>
        }
        else {
            return <div style={{backgroundColor: "#E6EAEF", minHeight: 1}}/>
        }
    }
}

export class FlexLayout extends Component{
	render(){
		var style = {};
		if(this.props.style){
			style = _.create(this.props.style.prototype,this.props.style);
		}
		style.display="flex";
		style.flexDirection=this.props.row ? 'row' : 'column';
		if(this.props.padding){
			console.log(this.props.padding);
			style.padding = this.props.padding;
		}
		if(this.props.alignItems){
			style.alignItems = this.props.alignItems;
		}
        if (this.props.justifyContent) {
            style.justifyContent = this.props.justifyContent;
        }
		if(this.props.flex){
			style.flex = this.props.flex;
		}
		return (<div style={style} className={this.props.className} onClick={this.props.onClick}>
			{this.props.children}
		</div>)
	}
}


class _AFHeading extends Component{
	render(){
		const {classes} = this.props;
		return <Typography variant={"headline"}>
			<FlexLayout row alignItems={"center"} className={classes.content}>
				<div className={classes.pointer} id={this.props.id||`${Math.random()}`}></div>
				{this.props.children}
			</FlexLayout>
		</Typography>;
	}
}

export const AFSecondaryHeading = withStyles((theme)=>{
	return {
		content:{
			paddingTop:25,
			paddingBottom:15
		},
		pointer:{
			width:9,
			height:1,
			backgroundColor:theme.palette.primary.main,
			marginRight:15
		}
	}
})(_AFHeading);


export const AFHeading = withStyles((theme)=>{
	return {
		content:{
			paddingTop:25,
			paddingBottom:15
		},
		pointer:{
			width:9,
			height:9,
			borderRadius:5,
			border:"1px solid",
			borderColor:theme.palette.primary.main,
			marginRight:15
		}
	}
})(_AFHeading);

window.hljs.initHighlightingOnLoad();

export class AFEditor extends Component{
    constructor(props) {
        super(props);
        this.state = {};
    }

    render(){
		// console.log("Rendering with value", this.props.value);
        return <CodeBlock>
            <Highlight className={this.props.mode} element={'pre'}>
                <code style={{maxHeight:300,padding:"1em"}}>
                    {this.props.value}
                </code>
            </Highlight>
        </CodeBlock>
	}
}


class _AppsFlyWebComponent extends Component {

    render() {
        var frameStyles = this.props.afStyle;
        var width;
        var height;
        if (frameStyles) {
            if (frameStyles.width) {
                width = frameStyles.width;
            }
            if (frameStyles.height) {
                height = frameStyles.height;
            }
        }
        if(this.props.jsIncludes){
            return <iframe width={width} height={height} name={Math.random()*1000+"_af"} src={`${WIDGET_URL}/index.html?module_handle=${this.props.handle}&app_key=${this.props.appKey}&repo_url=${REPO_URL}&intent=${this.props.intent}&intent_data=${encodeURIComponent(this.props.intentData)}&jsincludes=${encodeURIComponent(this.props.jsIncludes.join(","))}&embed=true`} scrolling="no" frameBorder="0" style={"width: auto; height: auto; border:none;"} />
        }
        else{
            return <iframe width={width} height={height} name={Math.random()*1000+"_af"} src={`${WIDGET_URL}/index.html?module_handle=${this.props.handle}&app_key=${this.props.appKey}&repo_url=${REPO_URL}&intent=${this.props.intent}&intent_data=${encodeURIComponent(this.props.intentData)}&embed=true`} scrolling="no" frameBorder="0"  />
        }

    }
}

export const AppsFlyWebComponent = _AppsFlyWebComponent;



class _AFIntentCodeBlock extends Component{
    constructor(props) {
        super(props);
        this.state = {};
    }

	render() {
    	// let {classes} = this.props;
		return <FlexLayout>
			<Stepper activeStep={this.state.selectedStep}  orientation="vertical">
				<Step key={"Request"} onClick={()=>{this.setState({selectedStep:0})}}>
					<StepLabel>Generate Request</StepLabel>
					<StepContent>
						<AFEditor value={this.props.requestCode}/>
					</StepContent>
				</Step>
				<Step key={"Execute"} onClick={()=>{this.setState({selectedStep:1})}}>
					<StepLabel>Execute Intent</StepLabel>
					<StepContent>
						<AFEditor value={this.props.execCode}/>
					</StepContent>
				</Step>
				<Step key={"Intent Response"} onClick={()=>{this.setState({selectedStep:2})}}>
					<StepLabel>Intent Response</StepLabel>
					<StepContent>
						<AFEditor value={this.props.responseCode}/>
					</StepContent>
				</Step>
			</Stepper>
		</FlexLayout>
    }
}

export const AFIntentCodeBlock = withStyles((theme) => {
    return {}
})(_AFIntentCodeBlock);


class _AFNote extends Component{
	render(){
		const {classes} = this.props;
		return <div className={`${classes[this.props.level||"note"]} ${classes.container}`}>
			{this.props.title &&
				<Typography variant={"headline"} gutterBottom={true}>
					<span className={classes[this.props.level||"note"]}>
						{this.props.title || "Notes"}
					</span>
				</Typography>
			}

			<Typography variant={"body1"}>
				<span className={classes[this.props.level||"note"]}>
					{this.props.body || "Notes"}
				</span>
			</Typography>
		</div>
	}
}

export const AFNote = withStyles((theme) => {
	return {
		note:{
			background:"#FFF8DC",
			color:"#85701D",
			borderColor:"#85701D"
		},
		danger:{
			background:"#FFE9E4",
			color:"#C1715E",
			borderColor:"#C1715E"
		},
		success:{
			background:"#E4F4E2",
			color:"#4B7A14",
			borderColor:"#4B7A14"
		},
		container:{
			padding:20,
			borderRadius:3,
			border:"1px solid",
			marginBottom:"1em"
		}
	}
})(_AFNote);


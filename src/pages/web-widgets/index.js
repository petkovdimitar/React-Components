import React, {Component} from "react";
import {
	Typography,
	withStyles
} from "material-ui";
import {
    AFHeading, AppsFlyWebComponent, Divider,
    FlexLayout
} from "../../util/utils";
import {WEB_MICROAPP_ID, WIDGET_URL} from "../../auth/config";

class WebWidgets extends Component{

	constructor(props){
		super(props);
		this.state = {};
		this.props.webWidgetProvider.onLoad(()=>{
			console.log("Loading");
			console.log(this.props.webWidgetProvider.intents)
			this.setState({});
		});
	}

    componentDidMount() {
        let receiveAppsflyMessage = function (event) {
            if (event.origin === WIDGET_URL) {
                if (event.data.intent) {
                    // Microapp
                    var data = event.data;
                    data.intentData = JSON.stringify(data.intentData);
                    var microapp = document.createElement("iframe");
                    microapp.id = "af_iframe_callback";
                    microapp.frameBorder = "0";
                    microapp.scrolling = "no";
                    microapp.style.position = "fixed";
                    microapp.style.top = "50%";
                    microapp.style.left = "50%";
                    microapp.style.width = "100%";
                    microapp.style.height = "100%";
                    microapp.style.zIndex = 999;
                    microapp.style.background = `rgba(0, 0, 0, 0.6) url(${WIDGET_URL}/ripple.svg) center center no-repeat`;
                    microapp.style.transform = "translate(-50%, -50%)";
                    microapp.style.opacity = 0;
                    microapp.style.transition = "opacity 0.3s linear";
                    setTimeout(function () {
                        microapp.style.opacity = 1;
                    }, 0);
                    microapp.setAttribute("src", `${WIDGET_URL}/index.html?module_handle=${data.moduleHandle}&app_key=${data.appKey}&repo_url=${data.repoUrl}&intent=${data.intent}&intent_data=${encodeURIComponent(data.intentData)}&jsincludes=${encodeURIComponent(data.jsincludes)}&options=${encodeURIComponent(JSON.stringify(event.data.options))}`);
                    document.body.appendChild(microapp);
                }
                if (event.data.close) {
                    var appsflyCallback = document.getElementById('af_iframe_callback');
                    appsflyCallback.style.opacity = 0;
                    setTimeout(function () {
                        appsflyCallback.parentNode.removeChild(appsflyCallback);
                    }, 1000);
                }
                if (event.data.hideEmbed) {
                    console.log(event.data.embedName);
                    let iframes = document.getElementsByName(event.data.embedName);
                    for (var i = 0; i < iframes.length; i++) {
                        iframes[i].style.display = "none";
                    }
                }
            }
        };

        window.addEventListener("message", receiveAppsflyMessage);
    }

	intents(){
		var intents = this.props.webWidgetProvider.intents || [];
		return intents;
	}


	render(){
		const {classes} = this.props;
		return <FlexLayout className={classes.body}>
			<Typography variant={"display1"} gutterBottom>
				Widgets
			</Typography>
			{
				this.intents().map((intent)=>{
                    var afStyle={};
                    if(intent.options && intent.options.defaultWidgetHeight){
                        afStyle.height=intent.options.defaultWidgetHeight;
                    }
					return <div key={intent.label}>
						<FlexLayout row style={{padding:10}}>
							<FlexLayout>
								<AFHeading>{intent.label}</AFHeading>
								<div>Intent : <code>{intent.intent}</code></div>
								<div>{intent.desc}</div>
                                <AppsFlyWebComponent appKey={"abb3f71c-a8cc-4f2a-90aa-23ac3771f5f7"} intent={intent.intent} intentData={intent.request} handle={WEB_MICROAPP_ID} afStyle={afStyle}/>
							</FlexLayout>
						</FlexLayout>
						<Divider/>
					</div>
				})
			}
		</FlexLayout>
	}
}


WebWidgets = withStyles(()=>{
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
})(WebWidgets);

export default WebWidgets;
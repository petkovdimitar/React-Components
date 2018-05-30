import React, {Component} from "react";
import {
    Typography,
    withStyles
} from "material-ui";
import {AFEditor, AFHeading, AFNote, FlexLayout} from "../../util/utils";

class GettingStartedAndroid extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        const {classes} = this.props;
        return <FlexLayout className={classes.body}>
            <AFHeading >How to integrate the Appsfly Android Utils</AFHeading>
            <Typography variant={"title"} gutterBottom>
                Add artifactory maven repository:
            </Typography>
            <AFEditor
                mode="groovy"
                value={`/* Add the following to the root gradle file. */
					|allprojects {
					|    repositories {
					|        ...
					|        maven { url "https://repos.appsfly.io/artifactory/libs-release-local" }
					|    }
					|}`.split("\n").map((item) => {
                        return item.trim().replace("|", "")
                    }).join("\n")
                }
            />
            <Typography variant={"title"} gutterBottom>
                Add the gradle dependency
            </Typography>
            <AFEditor
                mode="Java"
                value={`implementation ('io.appsfly.android.utils:micro-app:1.2.22'){
					|    transitive = true
					|}
					|`.split("\n").map((item) => {
                    return item.trim().replace("|", "")
                }).join("\n")
                }
            />
            <AFNote title={"Note"} body={"If you are using a lower version of Android Studio, use 'compile' instead of 'implementation'"}/>
            <Typography variant={"title"} gutterBottom>
                Generated Secret-key
            </Typography>
            <Typography gutterBottom>
                Obtain a unique secret key from Appsfly.io (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx). To keep the secret
                key secure, it is recommended to follow the below steps.
            </Typography>
            <Typography variant={"body2"}>
                Place this key in the gradle.properties file of the Android Project.
            </Typography>
            <AFEditor
                mode="Java"
                value={`appsfly_app_key=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.split("\n").map((item) => {
                    return item.trim().replace("|", "")
                }).join("\n")
                }
            />
            <Typography variant={"body2"}>
                Add the following config to the manifest placeholders.
            </Typography>
            <AFEditor
                mode="groovy"
                value={`defaultConfig {
                      |    ...
                      |    manifestPlaceholders.appsfly_app_key = appsfly_app_key
                      |}`.split("\n").map((item) => {
                    return item.trim().replace("|", "")
                }).join("\n")
                }
            />
            <Typography variant={"body2"}>
                Add the following to the application module Manifest file.
            </Typography>
            <AFEditor
                mode="xml"
                value={`<application>
                      |    <meta-data
                      |        android:name="appsfly_app_key"
                      |        android:value=appsfly_app_key />
                      |        ...
                      |`.split("\n").map((item) => {
                    return item.trim().replace("|", "")
                }).join("\n")
                }
            />

            <Typography variant={"title"} gutterBottom>
                Initialize runtime with MicroApp configurations
            </Typography>
            <AFEditor
                mode="Java"
                value={`/*Override your Application/Activity Instance onCreate() method*/
                       |@Override
                       |public void onCreate() {
                       |    super.onCreate();
                       |    AppsFlyClientConfig config = new AppsFlyClientConfig(context, "MICRO_MODULE_HANDLE", "EXECUTION_URL");
                       |    ArrayList appsFlyClientConfigs = new ArrayList(){{
                       |        configs.add(appsflyConfig);
                       |    }};
                       |    AppsFlyProvider.getInstance().initialize(appsFlyClientConfigs, this);
                       |}`.split("\n").map((item) => {
                    return item.trim().replace("|", "")
                }).join("\n")
                }
            />
	        <AFNote level={"success"} title={"Note"} body={"This will start the process of syncing Metadata required to run MicroApp in your application."}/>

            <Typography variant={"title"} gutterBottom>
                Fly in MicroApp into context of user
            </Typography>
            <AFEditor
                mode="text/x-java"
                value={`/*To launch the MicroApp, run the following snippet where there is a call to action.*/
                    |MicroAppLauncher.pushApp(*MICRO_MODULE_HANDLE*, *INTENT*, *new JSONObject(){INTENT_DATA}*, *ACTIVITY*);`.split("\n").map((item) => {
                    return item.trim().replace("|", "")
                }).join("\n")
                }
            />

            <AFHeading >Data into and out of MicroApp</AFHeading>
            <Typography variant={"title"} gutterBottom>
                To put data into the MicroApp:
            </Typography>
            <AFEditor
                mode="Java"
                value={`//Put context data inside a JSONobject and pass it as intent data.
                    |JSONObject contextData = new JSONObject();
                    |data.put(*key* , *value*);
                    |MicroAppLauncher.pushApp(*MICRO_MODULE_HANDLE*, *INTENT*, data, *ACTIVITY*);`.split("\n").map((item) => {
                    return item.trim().replace("|", "")
                }).join("\n")
                }
            />
            <Typography variant={"title"} gutterBottom>
                To retrieve data from the MicroApp:
            </Typography>
            <AFEditor
                mode="Java"
                value={`@Override
                    |protected void onActivityResult(int requestCode, int resultCode, Intent data) {
                    |    super.onActivityResult(requestCode, resultCode, data);
                    |    if (resultCode == RESULT_OK && requestCode == AppsFlyConstants.NAVIGATION_CODE) {
                    |        String dataStr = data.getStringExtra("postData");
                    |        JSONObject resultData;
                    |        try {
                    |            resultData = new JSONObject(dataStr);
                    |        } catch (JSONException e) {
                    |            e.printStackTrace();
                    |        }
                    |        //Get values from resultData with keys specified by the Microapp Documentation.
                    |        Object value1 = resultData.get(*key1*);
                    |        String value2 = resultData.getString(*key2*);
                    |    }
                    |}`.split("\n").map((item) => {
                    return item.trim().replace("|", "")
                }).join("\n")
                }
            />

        </FlexLayout>
    }
}


GettingStartedAndroid = withStyles(() => {
    return {
        body: {
            padding: 30
        },
        section: {
            paddingTop: 10,
            paddingBottom: 10
        }
    };
})(GettingStartedAndroid);

export default GettingStartedAndroid;
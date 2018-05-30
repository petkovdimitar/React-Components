import React, {Component} from "react";
import {
    Dialog, Slide, Switch, TextField, Typography,
    withStyles
} from "material-ui";
import {AFPrimaryButton, FlexLayout} from "../../util/utils";
import * as co from "co";

class AppUpdateModal extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.appsManager = props.appsManager;
    }

    transition(props) {
        return <Slide direction="up" {...props} />;
    }

    componentWillMount(){
        this.setState({checked:this.props.data.is_enabled,name:this.props.data.name,id:this.props.data._id});
    }

    updateApp(){
        const self = this;
        if (this.props.data.is_enable !== this.state.checked) {
            co(function*() {
                try {
                    yield self.appsManager.changeAppStatus(self.state.id);
                    self.props.onClose();
                }
                catch (err) {
                    self.props.onError(err.response.data.error_description);
                }
            });
        }
        co(function*() {
            try {
                yield self.appsManager.updateApp(self.state.id,self.state.name);
                self.props.onClose();
            }
            catch (err) {
                self.props.onError(err.response.data.error_description);
            }
        });
    }


    render() {
        const {classes} = this.props;
        return (<Dialog
            open={this.props.open || false}
            transition={this.transition}
            keepMounted
            onClose={this.props.onClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
                <FlexLayout className={classes.body}>
                    <Typography variant="headline" gutterBottom>Edit</Typography>
                    <TextField
                        label={"App Name"}
                        className={[classes.textField, classes.marginBottom].join(" ")}
                        defaultValue={this.state.name}
                        margin="normal"
                        onChange={(e)=>{this.setState({name:e.currentTarget.value})}}
                    />
                    <FlexLayout row justifyContent={"space-between"}>
                        <FlexLayout>
                            <label className={classes.label}>Status</label>
                            <span>{(this.state.checked ? "Active" : "Inactive")}</span>
                        </FlexLayout>
                        <Switch checked={this.state.checked} classes={{checked: classes.checked, bar: classes.bar,}}
                                onChange={
                                    ()=>{this.setState({checked:!this.state.checked});}}
                        />
                    </FlexLayout>
                    <AFPrimaryButton  className={classes.submit} type={"submit"} variant="primary" color="primary"
                                      onClick={()=>{this.updateApp();}}

                    >Apply</AFPrimaryButton>
                </FlexLayout>

        </Dialog>)
    }
}

AppUpdateModal = withStyles({
    body: {
        padding: 30,
        width: 290
    },
    label: {
        color: "rgba(0, 0, 0, 0.54)",
        padding: 0,
        fontSize: "12px",
        lineHeight: 1,
        marginBottom: "0.5em"
    },
    marginBottom: {
        marginBottom: "1em"
    },
    checked: {
        color: "#FFFFFF",
        '& + $bar': {
            backgroundColor: "#48da17",
        },
    },
    bar: {},
})(AppUpdateModal);

export default AppUpdateModal;

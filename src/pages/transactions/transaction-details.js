import React, {Component} from "react";
import {
    Dialog, Divider, Slide, TextField, Typography,
    withStyles
} from "material-ui";
import {FlexLayout} from "../../util/utils";
import Moment from "react-moment";

class TransactionDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    transition(props) {
        return <Slide direction="up" {...props} />;
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
            {
                this.props.data &&
                <FlexLayout className={classes.body}>
                    <Typography variant="headline" gutterBottom>Transaction Details</Typography>
                    <FlexLayout row justifyContent={"space-between"}>
                        <FlexLayout row>
                            <FlexLayout>
                                <span className={classes.detailsHeader}>Transaction ID</span>
                                <span className={classes.detailsContent}>{this.props.data.order_id}</span>
                            </FlexLayout>
                        </FlexLayout>
                        <FlexLayout >
                            <FlexLayout>
                                <span className={classes.detailsHeader}>{this.props.data.service_company_name}</span>
                                <span className={classes.detailsContent}>
                                    <Moment format="DD MMM YYYY / hh:mm:ss a">{this.props.data.date}</Moment>
                                </span>
                            </FlexLayout>
                        </FlexLayout>
                        <FlexLayout >
                            <FlexLayout>
                                <span className={classes.detailsHeader}>Price</span>
                                <span className={classes.detailsContent}>{this.props.data.price}</span>
                            </FlexLayout>
                        </FlexLayout>
                    </FlexLayout>
                    <Divider className={classes.dividerMargin}/>
                    <FlexLayout row className={classes.payloadContainer}>
                        {
                            Object.keys(this.props.data.payload).map((key,index) =>  {
                                return <div key={index} className={classes.payloadDetails}>
                                    <TextField
                                        label={key}
                                        className={classes.textField}
                                        value={this.props.data.payload[key]}
                                        margin="normal"
                                        disabled
                                    />
                                </div>
                            })


                        }
                    </FlexLayout>
                </FlexLayout>
            }
            {
                !this.props.data && <span></span>
            }
        </Dialog>)
    }
}

TransactionDetails = withStyles({
    body:{
        padding:30,
        width:500
    },
    detailsHeader:{
      color:"#595959",
      fontSize:12,
      opacity: 0.6
    },
    detailsContent:{
        color:"#595959",
        fontSize:14,
        wordWrap:"break-word",
        width:120

    },
    dividerMargin:{
        marginTop:"1em",
        marginBottom:"1em"
    },
    payloadContainer:{
        flexWrap:"wrap",
    },
    payloadDetails:{
        flexBasis:"30%",
        display:'flex',
        flexGrow:0,
        flexShrink:0,
        paddingRight:"1em"
    }
})(TransactionDetails);

export default TransactionDetails;

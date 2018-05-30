import {createMuiTheme} from "material-ui";

const Theme = createMuiTheme({
    overrides: {
        MuiButton: {
            root: {
                padding: 10
            },
            raised: {
                boxShadow: "none"
            },
            keyboardFocused: {
                boxShadow: "none"
            }
        },
        MuiMenu: {
            paper: {
                boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.01), 0px 8px 10px 1px rgba(0, 0, 0, 0.01), 0px 3px 14px 2px rgba(0, 0, 0, 0.01)",
                border: "1px solid #e6eaef"
            }
        },
        MuiDialog: {
            paper: {
                boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.01), 0px 8px 10px 1px rgba(0, 0, 0, 0.01), 0px 3px 14px 2px rgba(0, 0, 0, 0.01)",
                border: "1px solid #e6eaef"
            }
        }
    },
    palette: {
        primary: {
            main: "#0080EF"
        }
    },
    typography: {
        fontFamily: '"proxima-nova","Open Sans"',
        color: "#595959",
        fontSize: 14,
        body1:{
	        fontSize: 15
        }
    },
    afPrimaryColor: "#0080EF",
    secondaryTextColor: "#8B9AA9"
});

export default Theme;
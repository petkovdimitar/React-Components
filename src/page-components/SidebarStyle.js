const SidebarStyle = (theme) => {
	return {
		leftNavPadding:{
			paddingLeft:15
		},
		selectionPadding:{
			marginTop:30,
			marginRight:30,
			marginLeft:16,
			border:"1px solid #e6eaef",
			borderRadius:3,
		},
		navIcon:{
			color:theme.afPrimaryColor
		},
		subNav:{
			marginLeft:20,
			marginRight:30,
			paddingLeft:20,
			borderLeft:"1px solid #e6eaef"
		},
		scroll:{
			overflowY:"scroll"
		}
	}
};

export default SidebarStyle;
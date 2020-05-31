import {RootState} from "../../data/reducer";
import "./Appbar.scss"
import React, {Component} from 'react';
import {AppBar, IconButton, Toolbar, Typography} from '@material-ui/core';
import {Dispatch} from "redux";
import {toggleTheme} from "../../data/module/theme/action";
import {connect, ConnectedProps} from "react-redux";

import Brightness5Icon from "@material-ui/icons/Brightness5"
import Brightness3Icon from "@material-ui/icons/Brightness3"

const mapStateToProps = (state: RootState) => ({theme: state.theme.current})

const mapDispatchToProps = (dispatch: Dispatch) => ({toggleTheme: () => dispatch(toggleTheme())})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;


interface Props extends ReduxTypes {
	appName: string
}


class Appbar extends Component<Props> {
	render() {

		const toggleButton = this.props.theme === "dark" ? <Brightness5Icon/> : <Brightness3Icon style={{color: "white"}}/>

		return (
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6">
						{this.props.appName}
					</Typography>
					<IconButton
						edge={"end"}
					    className={"toggleTheme"}
					    onClick={this.props.toggleTheme}
					>
						{toggleButton}
					</IconButton>
				</Toolbar>
			</AppBar>
		);
	}
}

export default connector(Appbar);

import * as React from 'react';
import {Paper, Typography} from "@material-ui/core";
import "./Application.scss"
import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {RootState} from "../data/reducer";
import {toggleTheme} from "../data/module/theme/action";
import Appbar from "./Appbar/Appbar";
import {Interactor} from "../api/Interactor";

const mapStateToProps = (state: RootState) => ({theme: state.theme.current})

const mapDispatchToProps = (dispatch: Dispatch) => ({toggleTheme: () => dispatch(toggleTheme())})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;

export interface Props {
}

interface State {
	something: object
}

class Application extends React.Component<Props & ReduxTypes, State> {

	state = {something: {}}

	async componentDidMount() {
		this.setState({
			something: await Interactor.instance.test
		})
	}

	render() {
		return (
			<Paper square={true} className={"Application"}>
				<Appbar appName={"TEMPLATE"}/>
				<Paper square className={"content"} >
					<Typography variant={"subtitle1"}> Server is running on  {JSON.stringify(this.state.something)}</Typography>
				</Paper>
			</Paper>
		);
	}
}

export default connector(Application)

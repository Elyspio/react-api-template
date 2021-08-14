import {CircularProgress, Container, Grid} from "@material-ui/core";
import "./Test.scss"
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import {Services} from "../../../core/services";
import * as React from 'react';
import {useAsyncEffect} from "../../hooks/useAsyncEffect";
import {useAsyncCallback} from "../../hooks/useAsyncCallback";
import {AuthenticationEvents} from "../../../core/services/authentication";

const Test = () => {


	const [msg, setMsg] = React.useState("");
	const [admin, setAdmin] = React.useState("");

	const [fetchAdmin, {isExecuting}] = useAsyncCallback(async () => {
		const data = await Services.example.getAdminContent();
		if (data) {
			setAdmin(data)
		}
	}, [])


	useAsyncEffect(async () => {
		const {data} = await Services.example.getContent();
		setMsg(data)

		AuthenticationEvents.on("login", () => {
			fetchAdmin();
		})
	}, [])


	return (
		<Container className={"Test"}>


			<Grid container direction={"column"}>

				<Grid item container alignItems={"center"} spacing={4}>
					<Grid item><Typography color={"textPrimary"} variant={"overline"}>Test</Typography></Grid>
					<Grid item><Typography color={"textPrimary"}>{msg}</Typography></Grid>
				</Grid>

				<Grid item container alignItems={"center"} spacing={4}>
					<Grid item><Typography color={"textPrimary"} variant={"overline"}>Test (Admin)</Typography></Grid>
					<Button color={"secondary"} onClick={fetchAdmin}>{isExecuting ? <CircularProgress/> : "Fetch admin"}</Button>
					<Grid item><Typography color={"error"}>{admin}</Typography></Grid>
				</Grid>
			</Grid>


		</Container>
	);

}


export default Test;

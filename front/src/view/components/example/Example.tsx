import React from 'react';
import {RootState} from "../../store/reducer";
import {Dispatch} from "redux";
import {connect, ConnectedProps} from "react-redux";
import {Container} from "@material-ui/core";
import "./Example.scss"
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import {Services} from "../../../core/services";

const mapStateToProps = (state: RootState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;


const Test = (props: ReduxTypes) => {


    const [msg, setMsg] = React.useState("");
    const [admin, setAdmin] = React.useState("");

    React.useEffect(() => {

        const fetchData = async () => {
            const {data} = await Services.test.getContent();
            setMsg(data)
        }
        fetchData();


    }, [])


    const fetchAdmin = async () => {
        const data = await Services.test.getAdminContent();
        if(data) {
            setAdmin(data)
        }
    }

    return (
        <Container className={"Test"}>
            <Typography>msg: {msg}</Typography>

            <Button onClick={fetchAdmin}>Admin content</Button>
            {admin && <Typography>admin response: {admin}</Typography>}

        </Container>
    );

}


export default connector(Test);

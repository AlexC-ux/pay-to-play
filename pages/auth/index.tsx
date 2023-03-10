import { Alert, Button, ButtonGroup, Grid, Input, Paper, Typography } from "@mui/material"
import Container from "@mui/material/Container"
import axios from "axios";
import { useRouter } from "next/router"
import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { useIntl } from "react-intl";
import Error from "../../components/interfaces/error";
import { sha512, } from 'crypto-hash';
import { stringify } from "querystring";
import { Users } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "../../app/sessions";
import { Header } from "../../app/header";


export default function SignIn() {
    const intl = useIntl();
    const router = useRouter();

    const [error, setError]: [any, Dispatch<SetStateAction<any>>] = useState({ text: undefined });

    const [authData, setAuthData] = useState({ login: "", pass: "" })

    function authorizeByCreds() {
        sha512(authData.pass).then(passHash => {
            axios.post("/api/auth/checkcreds", {
                username: authData.login,
                password: passHash
            }).then((result) => {
                const responseUser: Users = result.data;
                const responseError: Error = result.data;

                if (!!responseError.error) {
                    setError({ text: intl.formatMessage({ id: responseError.error }) })
                } else {
                    router.replace("/userprofile/me")
                }
            })
        })

    }
    return (
        <>
            <Header user={null} />
            <Container>
                <Paper
                    sx={{
                        p: 6,
                        m: 3,
                        borderRadius: 3,
                    }}>
                    <Alert severity="error"
                        sx={{
                            display: !!error.text ? "block" : "none"
                        }}>{error.text}</Alert>
                    <Typography
                        variant="h5"
                        component={"div"}
                        align="center"
                        sx={{
                            pb: 3
                        }}>
                        {intl.formatMessage({ id: "AUTH.signin" })}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="subtitle1">{intl.formatMessage({ id: "AUTH.login" })}</Typography>
                            <Input
                                onChange={(input) => { setAuthData((prev) => { return { ...prev, login: input.target.value } }) }}
                                name="username"
                                type="text"
                                fullWidth={true} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="subtitle1">{intl.formatMessage({ id: "AUTH.password" })}</Typography>
                            <Input
                                onChange={(input) => { setAuthData((prev) => { return { ...prev, pass: input.target.value } }) }}
                                name="password" type="password"
                                fullWidth={true} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} rowSpacing={2}
                        sx={{
                            mt: 2
                        }}>
                        <Grid item xs={0} md={7} />
                        <Grid item xs={12} md={5}>
                            <Button type="submit"
                                variant="outlined"
                                onClick={authorizeByCreds}
                                color="secondary"
                                fullWidth={true}>{intl.formatMessage({ id: "AUTH.signin" })}</Button>
                        </Grid>
                        <Grid item xs={0} md={7} />
                        <Grid item xs={12} md={5}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => { router.push(intl.locale + "/auth/newProfile") }}
                                fullWidth={true}>{intl.formatMessage({ id: "AUTH.register" })}</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </>

    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context.req, context.res)
    if (!!session.token) {
        context.res.writeHead(301, { Location: '/userprofile/me' })
        context.res.end()
    }
    return {
        props: {}
    }
}
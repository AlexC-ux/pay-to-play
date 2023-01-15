import { Alert, Button, ButtonGroup, Grid, Input, Paper, Typography } from "@mui/material"
import Container from "@mui/material/Container"
import axios from "axios";
import { useRouter } from "next/router"
import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { useIntl } from "react-intl";
import { GlobalContext } from "../../components/contextes/globalcontext";
import Error from "../../components/interfaces/error";
import { IUser } from "../../components/interfaces/user";
import { sha512, sha256 } from 'crypto-hash';


export default function SignIn() {
    const intl = useIntl();
    const router = useRouter();
    const globalContext = useContext(GlobalContext)!;

    const [error, setError]: [any, Dispatch<SetStateAction<any>>] = useState({ text: undefined });

    const [regData, setRegData] = useState({ login: "", password1: "", password2: "", email: "" })

    function createNewAccount() {
        console.log({ regData })
        if (regData.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            if (regData.password1 == regData.password2) {
                if (regData.password1.length < 7) {
                    setError({ text: intl.formatMessage({ id: "AUTH.REGISTER.ERROR.passwordlength" }) })
                } else if (regData.login.length < 7) {
                    setError({ text: intl.formatMessage({ id: "AUTH.REGISTER.ERROR.loginlength" }) })
                }
                else {
                    sha512(regData.password1).then(hash => {
                        axios.post("/api/reg",
                            {
                                email: regData.email,
                                passwordHash: hash,
                                login: regData.login
                            }).then((result) => {
                                const responseUser: IUser = result.data;
                                const responseError: Error = result.data;

                                console.log({ responseError })

                                if (!!responseError.error) {
                                    setError({ text: intl.formatMessage({ id: responseError.error }) })
                                } else {
                                    globalContext.user.dispatch(responseUser);
                                    localStorage.setItem("userToken", responseUser.token)
                                    router.push("/userprofile/me")
                                }
                            })
                    })

                }
            } else {
                setError({ text: intl.formatMessage({ id: "AUTH.REGISTER.ERROR.passwordsnotequal" }) })
            }
        } else {
            setError({ text: intl.formatMessage({ id: "AUTH.REGISTER.ERROR.wrongmail" }) })
        }
    }
    return (
        <>
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
                        {intl.formatMessage({ id: "AUTH.register" })}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="subtitle1">{intl.formatMessage({ id: "AUTH.login" })}</Typography>
                            <Input
                                onChange={(input) => { setRegData((prev) => { return { ...prev, login: input.target.value } }) }}
                                name="username"
                                type="text"
                                fullWidth={true} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="subtitle1">{intl.formatMessage({ id: "AUTH.REGISTER.email" })}</Typography>
                            <Input
                                onChange={(input) => { setRegData((prev) => { return { ...prev, email: input.target.value } }) }}
                                name="email"
                                type="text"
                                fullWidth={true} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="subtitle1">{intl.formatMessage({ id: "AUTH.password" })}</Typography>
                            <Input
                                onChange={(input) => { setRegData((prev) => { return { ...prev, password1: input.target.value } }) }}
                                name="password" type="password"
                                fullWidth={true} />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="subtitle1">{intl.formatMessage({ id: "AUTH.REGISTER.passwordrepeat" })}</Typography>
                            <Input
                                onChange={(input) => { setRegData((prev) => { return { ...prev, password2: input.target.value } }) }}
                                name="password2" type="password"
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
                                onClick={createNewAccount}
                                color="secondary"
                                fullWidth={true}>{intl.formatMessage({ id: "AUTH.register" })}</Button>
                        </Grid>
                        <Grid item xs={0} md={7} />
                        <Grid item xs={12} md={5}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => { router.push(`/${intl.locale}/auth`) }}
                                fullWidth={true}>{intl.formatMessage({ id: "AUTH.signin" })}</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </>

    )
}
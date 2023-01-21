import { Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react"
import { useIntl } from "react-intl";
import { getSession } from "../../app/sessions";

export default function SignIn() {

    const intl = useIntl();
    return (
        <>
            <Typography
                align="center"
                variant="h5" component={"div"}
                sx={{
                    p: 3,
                    m: 3
                }}>
                {intl.formatMessage({ id: "AUTH.EXIT.message" })}
            </Typography>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    const session = await getSession(context.req, context.res);
    session.destroy();

    context.res.writeHead(301, { Location: '/' })
    context.res.end()

    return {
        props: {}
    }
}
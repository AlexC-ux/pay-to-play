import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react"
import { useIntl } from "react-intl";
import { GlobalContext } from "../../components/contextes/globalcontext";

export default function SignIn() {

    const globalContext = useContext(GlobalContext)!;
    console.log(globalContext.user.value)
    globalContext.user.dispatch(undefined);
    const router = useRouter();
    useEffect(() => {
        localStorage.clear();
        router.push("/")
    })
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
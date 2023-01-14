import Alert from "@mui/material/Alert";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { useIntl } from "react-intl";
import { UserRoles } from "../../components/interfaces/user";
import { GlobalContext } from "../globalcontext";

export default function HasToken() {

    const globalContext = useContext(GlobalContext)!;
    const intl = useIntl();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token != null && !globalContext?.user.value) {
            axios.post("/api/auth/verifToken", {
                "token": token
            }).then(resp => {
                if (!resp.data.error) {
                    globalContext.user.dispatch(resp.data)
                } else {
                    console.log({resp})
                    globalContext.user.dispatch(undefined)
                    localStorage.clear();
                    return <Alert>{intl.formatMessage({id:resp.data.error})}</Alert>
                }
            })
        }
    })

    return <></>
}
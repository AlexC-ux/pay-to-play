import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../globalcontext";

export default function NeedAuth(props: { children: any, redirectOnUnauth: boolean, }) {
    const globalContext = useContext(GlobalContext);
    const router = useRouter();

    useEffect(() => {
        if ((!globalContext?.user.value&&!localStorage.getItem("userToken")) && props.redirectOnUnauth) {
            router.push("/auth");
        }
    })
    return (globalContext != null && !!globalContext.user.value) ? props.children : <></>
}
import { useRouter } from "next/router"
import { useIntl } from "react-intl";
import NeedAuth from "../../contextes/Checkers/NeedAuth";

export default function MyProfilePage() {

    const router = useRouter();
    const intl = useIntl();


    return <>
    <NeedAuth
    redirectOnUnauth={true}>

    </NeedAuth>
    </>
}
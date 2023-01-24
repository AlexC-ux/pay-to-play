import dynamic from "next/dynamic";
import { Suspense } from "react";
import { DisplayMdWrapperProps } from "./EditorsComponents/displayMdWrapper";
import { MdEditorProps } from "./EditorsComponents/mdEditor";


export function DisplayMdWrapper(props: DisplayMdWrapperProps) {
    const Wrapper = dynamic(() => import("./EditorsComponents/displayMdWrapper"), {
        suspense: true,
    });
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Wrapper>{props.children}</Wrapper>
            </Suspense>
        </div>
    );
}

export function MdEditor(props:MdEditorProps) {
    const Navigation:any = dynamic(() => import("./EditorsComponents/mdEditor"), {
        suspense: true,
    });
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Navigation {...props}/>
            </Suspense>
        </div>
    );
}
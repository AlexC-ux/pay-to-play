import dynamic from "next/dynamic";
import { Suspense } from "react";
import { DisplayMdWrapperProps } from "./EditorsComponents/displayMdWrapper";
import { MdEditorProps } from "./EditorsComponents/mdEditor";


export function DisplayMdWrapper(props: DisplayMdWrapperProps) {
    const Wrapper = dynamic(() => import("./EditorsComponents/displayMdWrapper"), {
        loading: (p) => <div>{props.children.split("\n\n").map((content, index) => { return <p key={index}>{content}</p> })}</div>
    });
    return (
        <Wrapper>{props.children}</Wrapper>
    );
}
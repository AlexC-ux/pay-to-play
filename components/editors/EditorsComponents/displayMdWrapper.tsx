'use-client'

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import React from "react";
import reactStringReplace from "react-string-replace";
import cuid from "cuid";
import style from "./styles/displayMdWrapper.module.css";
import { Box } from "@mui/material";

export interface DisplayMdWrapperProps { children: string }

export default function DisplayMdWrapper(props: DisplayMdWrapperProps) {

    return (<Box key={cuid()}
        sx={{
            maxWidth: "100%"
        }}>
        <ReactMarkdown
            className={style.wrapper}
            remarkPlugins={[remarkGfm]}>
            {props.children}
        </ReactMarkdown>
    </Box>
    )
}
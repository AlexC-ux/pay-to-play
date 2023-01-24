'use-client'

import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import React from "react";
import reactStringReplace from "react-string-replace";
import cuid from "cuid";
import style from "./styles/displayMdWrapper.module.css";
import { Box } from "@mui/material";

const convertStylesStringToObject = (stringStyles: string) => typeof stringStyles === 'string' ? stringStyles
    .split(';')
    .reduce((acc, style) => {
        const colonPosition = style.indexOf(':')

        if (colonPosition === -1) {
            return acc
        }

        const
            camelCaseProperty = style
                .substring(0, colonPosition)
                .trim()
                .replace(/^-ms-/, 'ms-')
                .replace(/-./g, c => c.substr(1).toUpperCase()),
            value = style.substr(colonPosition + 1).trim()

        return value ? { ...acc, [camelCaseProperty]: value } : acc
    }, {}) : {}

export interface DisplayMdWrapperProps { children: string }

export default function DisplayMdWrapper(props: DisplayMdWrapperProps) {

    function replaceWithStyle(children: any) {
        const customColorsExpr = /(\[.*?\].*?\[endStyle\])/gm;
        return reactStringReplace(children, customColorsExpr, (match, index, offset) => {
            const style = /\[(.*?)\]/g.exec(match)
            const child = /\[(.*?)\](.*?)\[(.*?)\]/g.exec(match)
            if (!!child && !!style && !!style[1] && !!child[2]) {
                const a = `color:"red";width:200px;`
                a.split(";").map(el => {
                    return `"${el.split(":")[0]}":}`
                })
                return React.createElement("span", { style: convertStylesStringToObject(style[1]), key: cuid() }, <>{child[2]}</>)
            } else {
                return <React.Fragment key={cuid()}>{match}</React.Fragment>
            }
        })
    }

    const checkCustomTags = ({ node, className, children, ...props }: any) => {
        let replaced = replaceWithStyle(children)

        return React.createElement(node.tagName, {
            key: cuid(),
        },
            replaced)
    }

    return (<Box key={cuid()}
    sx={{
        maxWidth:"100%"
    }}>
        <ReactMarkdown
            className={style.wrapper}
            remarkPlugins={[remarkGfm]}
            components={{
                p: checkCustomTags,
                li: checkCustomTags,
                ul: checkCustomTags,
                h1: checkCustomTags,
                h2: checkCustomTags,
                h3: checkCustomTags,
                h4: checkCustomTags,
                h5: checkCustomTags,
                h6: checkCustomTags,
                strong: checkCustomTags,
                del: checkCustomTags,
                em: checkCustomTags,
            }}>
            {props.children}
        </ReactMarkdown>
    </Box>
    )
}
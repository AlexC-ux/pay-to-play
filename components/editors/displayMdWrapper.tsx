import { children } from "cheerio/lib/api/traversing";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
import React from "react";
import reactStringReplace from "react-string-replace";

export default function DisplayMdWrapper(props: { children: string }) {



    function getCustomComponents({ node, className, children, ...props }: any): JSX.Element {
        console.log({ node, className, children, ...props })
        return <p>
            {
                //COLORS
                reactStringReplace(children, /(\[#.*?\].*?\[\/#.*?\])/gm, (match, index, offset) => {
                    const color = /\[([^\/]*?)\]/g.exec(match)![1]
                    const text = /\[#.*?\](.*?)\[\/#.*?\]/g.exec(match)![1]
                    return <span key={index} style={{ color: color }}>{text}</span>
                })
            }
        </p>
    }

    return (
        ReactMarkdown({
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeMathjax],
            components: {
                p: params => { return getCustomComponents(params) },
                strong: params => { return getCustomComponents(params) },
                em: params => { return getCustomComponents(params) },
                h1: params => { return getCustomComponents(params) },
                h2: params => { return getCustomComponents(params) },
                h3: params => { return getCustomComponents(params) },
                h4: params => { return getCustomComponents(params) },
                h5: params => { return getCustomComponents(params) },
                h6: params => { return getCustomComponents(params) },
            },
            children: props.children
        })

    )
}
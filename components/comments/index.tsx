import { Avatar, Button, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { ThreadComment, Users } from "@prisma/client";
import DisplayMdWrapper from "../editors/displayMdWrapper";
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import React, { useState } from "react";
import { FormatDateToRu } from "../formatters/formatTimeToRu";

export interface ICommentComponentParams extends ThreadComment {
    user: { avatar: string, login: string }
    liked: boolean,
}

export default function CommentsElement(props: ICommentComponentParams, dispatcher: (el: any, index: any) => void, index: number) {

    async function handleLike() {
        await fetch(`/api/threads/comments/like/${props.id}`)
        if (!props.liked) {
            dispatcher({ ...props, liked: true, likes: props.likes + 1 }, index)
        } else {
            dispatcher({ ...props, liked: false, likes: props.likes - 1 }, index)
        }
    }


    return <Paper
        key={`${props.id}_${props.likes}`}
        sx={{
            p: 2
        }}>
        <Stack
            direction={"column"}>
            <Stack
                spacing={1}
                direction={"row"}>
                <Avatar
                    src={props.user.avatar}></Avatar>
                <Typography
                    variant="subtitle1"
                    component={"div"}
                    flexWrap={"wrap"}
                    alignContent="space-around"
                    display={"flex"}
                >{props.user.login}</Typography>
            </Stack>

            <Typography
                variant="subtitle2"
                component={"div"}>
                <DisplayMdWrapper>
                    {props.text}
                </DisplayMdWrapper>
            </Typography>
            <Stack
                direction={"row"}
                justifyContent="space-between"
                sx={{
                    pr: 2,
                }}>

                <Typography
                    variant="body1"
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignContent: "space-around"
                    }}>
                    {FormatDateToRu(new Date(Number(props.createdAt.toString())))}
                </Typography>
                <Button
                    onClick={handleLike}
                    color="secondary"
                    variant="text">
                    {
                        !props.liked ? <ThumbUpOutlinedIcon /> : <ThumbUpIcon />
                    }
                    <Typography
                        variant="subtitle2"
                        component={"div"}
                        sx={{ px: 1 }}>
                        {`${props.likes}`}
                    </Typography>
                </Button>
            </Stack>
        </Stack>
    </Paper>
}
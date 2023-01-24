import { Avatar, Button, IconButton, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Thread, ThreadComment, Users } from "@prisma/client";
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import React, { useState } from "react";
import { FormatDateToRu } from "../formatters/formatTimeToRu";
import DisplayMdWrapper from "../editors/EditorsComponents/displayMdWrapper";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

export interface ICommentComponentParams extends ThreadComment {
    user: { avatar: string, login: string }
    liked: boolean,
}

export default function CommentsElement(props: ICommentComponentParams, dispatcher: () => void, index: number, userId: string, threadId: string, threadOwnerID: string) {

    async function handleLike() {
        await fetch(`/api/threads/comments/like/${props.id}`)
        dispatcher();
    }

    async function handleDelete() {
        await fetch(`/api/threads/comments/delete/${props.id}`);
        dispatcher();
    }


    return <Paper
        key={`${props.id}_${props.likes}`}
        sx={{
            p: 2,
            maxWidth: "100%",
            position: "relative"
        }}>
        <Stack
            justifyContent={"end"}
            direction="row"
            display={() => {
                if (userId == threadOwnerID || props.usersId == userId.toString()) {
                    return "flex"
                }
                return "none"
            }}>
            <IconButton
                onClick={handleDelete}>
                <DeleteForeverOutlinedIcon />
            </IconButton>
        </Stack>
        <Stack
            direction={"column"}>
            <Stack
                spacing={1}
                direction={"row"}
                sx={{
                    minHeight: "40px"
                }}>
                <Avatar
                    src={`/avatars/${props.user.avatar}`}></Avatar>
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
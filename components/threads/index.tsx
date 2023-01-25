import { Avatar, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { Thread } from "@prisma/client";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';

export default function ThreadComponent(props: Thread & {
    _count: {
        comments: number;
    },
    userOwner: {
        avatar: string;
        login: string;
    } | null;
}) {


    return <>
        <Stack
            key={props.id}
            component={Paper}
            spacing={1}
            sx={{
                p: 2
            }}>
            <Typography
                variant="subtitle1"
                onClick={() => { }}
                sx={{
                    width: "100%",
                    cursor: "pointer",
                }}>
                {props.title}
            </Typography>
            <Stack
                direction={"row"}
                justifyContent="space-between">
                <Stack
                    spacing={0}
                    direction="row"
                >
                    <Avatar src={props.userOwner?.avatar}></Avatar>
                    <Typography
                        sx={{
                            pl: 2,
                            display: "flex",
                            flexWrap: "wrap",
                            alignContent: "center",
                        }}>{props.userOwner?.login}</Typography>
                </Stack>
                <Stack
                    spacing={0}
                    direction="row">
                    <Button
                        color="secondary"
                        variant="text">
                        <Typography
                            variant="subtitle1"
                            color="secondary"
                            component="div"
                            sx={{
                                px: 1
                            }}>
                            {props._count.comments}
                        </Typography>
                        <TextsmsOutlinedIcon />
                    </Button>
                    <Button
                        color="secondary"
                        variant="text">
                        <Typography
                            variant="subtitle1"
                            color="secondary"
                            component="div"
                            sx={{
                                px: 1
                            }}>
                            {props.likes}
                        </Typography>
                        <ThumbUpOutlinedIcon />
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    </>
}
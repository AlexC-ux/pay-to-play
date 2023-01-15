import { Backdrop, Box, Button, Grid, List, ListItem, Paper, SxProps } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import TitleOutlinedIcon from '@mui/icons-material/TitleOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined';
import ReactMarkdown from "react-markdown";
import Typography from "@mui/material/Typography";
import remarkGfm from 'remark-gfm'
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ButtonGroup from "@mui/material/ButtonGroup";
import ShowAlertMessage from "../alerts/alertMessage";
import { useIntl } from "react-intl";


export default function MdEditor(props: { styleSx?: SxProps }) {

    const [modeEdit, setModeEdit] = useState(true)
    const [content, setContent] = useState("");
    const [headerChooserShown, setHeaderChooserShown] = useState(false);

    const intl = useIntl();

    const messageDial = ShowAlertMessage({
        title: "Форматирование текста", content: <ReactMarkdown
            children={intl.formatMessage({ id: "MDEDITOR.info" })}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeMathjax]}
        />
    })

    return <Paper
        sx={props.styleSx}>
        <Grid container>
            <Grid item xs={12}>
                <Grid container
                    sx={{
                        pb: 0.5,
                        px: 1,
                        justifyContent: "end",
                    }}>
                    <Grid item xs={"auto"}>
                        <ButtonGroup
                            variant="text"
                            size="small">
                            <Button
                                color="secondary"
                                disabled={!modeEdit}
                                variant="text"><InsertLinkOutlinedIcon /></Button>

                            <Button
                                color="secondary"
                                disabled={!modeEdit}
                                onClick={() => { setHeaderChooserShown(true) }}
                                variant="text"><TitleOutlinedIcon /></Button>

                            <Button
                                color="secondary"
                                disabled={!modeEdit}
                                variant="text"><FormatBoldOutlinedIcon /></Button>

                            <Button
                                color="secondary"
                                disabled={!modeEdit}
                                variant="text"><ImageOutlinedIcon /></Button>

                            <Button
                                color="secondary"
                                onClick={() => { setModeEdit(!modeEdit) }}
                                variant="text">{modeEdit ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}</Button>

                            <Button
                                color="secondary"
                                onClick={() => { messageDial.setShown(true) }}
                                variant="text"><HelpOutlineIcon /></Button>
                        </ButtonGroup>
                        <Backdrop
                            open={headerChooserShown}
                            invisible={true}
                            onClick={() => { setHeaderChooserShown(false) }}
                            sx={{
                                zIndex: 10
                            }}>
                            <Paper
                                sx={{
                                    position: "absolute",
                                    top: 0
                                }}>
                                <List>
                                    <ListItem>
                                        123
                                    </ListItem>
                                    <ListItem>
                                        123
                                    </ListItem>
                                    <ListItem>
                                        123
                                    </ListItem>
                                </List>
                            </Paper>
                        </Backdrop>

                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <>
                    <TextField
                        multiline={true}
                        minRows={9}
                        contentEditable={false}
                        onChange={(tf) => { setContent(tf.target.value) }}
                        sx={{
                            width: "100%",
                            display: !!modeEdit ? "inheirit" : "none"
                        }} />
                    <Typography
                        sx={{
                            display: !modeEdit ? "inheirit" : "none",
                            p: 2,
                        }}><ReactMarkdown
                            children={content}
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeMathjax]}
                        /></Typography>
                </>

            </Grid>
        </Grid>
        {messageDial.element}
    </Paper >
}
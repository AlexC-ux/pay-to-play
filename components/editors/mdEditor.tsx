import { Backdrop, Box, Button, FormControl, FormControlLabel, FormGroup, Grid, IconButton, List, ListItem, Menu, MenuItem, Paper, Stack, SxProps, Tooltip } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import TitleOutlinedIcon from '@mui/icons-material/TitleOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import FormatBoldOutlinedIcon from '@mui/icons-material/FormatBoldOutlined';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import Typography from "@mui/material/Typography";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ShowAlertMessage from "../alerts/alertMessage";
import { useIntl } from "react-intl";
import React from "react";
import DisplayMdWrapper from "./displayMdWrapper";
import { ArrowCircleRightOutlined } from "@mui/icons-material";


const selection = { start: 0, end: 0 };

export default function MdEditor(props: { rowsCount?: number, placeholder?: string, onSend: (comment: string) => void } = { rowsCount: 9, placeholder: "", onSend: () => { } }) {

    const [modeEdit, setModeEdit] = useState(true)
    const [content, setContent] = useState("");
    const intl = useIntl();

    const messageDial = ShowAlertMessage({
        title: "Форматирование текста", content: <DisplayMdWrapper>{intl.formatMessage({ id: "MDEDITOR.info" })}</DisplayMdWrapper>
    })


    //formatting text
    function handleSelection(inputElement: HTMLInputElement | HTMLTextAreaElement) {
        selection.start = inputElement.selectionStart!;
        selection.end = inputElement.selectionEnd!;
    }

    function replaceSelection(editFunc: (selectedText: string) => string) {
        if (selection.start != selection.end) {
            setContent((prev) => {
                console.log({ prev })
                const edited = editFunc(prev.substring(selection.start, selection.end));
                console.log({ edited })
                const neVal = `${prev.substring(0, selection.start)}${edited}${prev.substring(selection.end, prev.length)}`
                console.log({ neVal })
                return neVal
            })
        }
    }

    enum FormatActions {
        bold,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        italic,
        strikethrough,
        listbullet,
        listnumbered
    }

    function handleFormatAction(action: FormatActions) {
        switch (action) {
            case FormatActions.bold:
                replaceSelection((selectedText: string) => {
                    return `**${selectedText}**`
                })
                break;
            case FormatActions.h1:
                replaceSelection((selectedText: string) => {
                    return `\n# ${selectedText}\n`
                })
                break;
            case FormatActions.h2:
                replaceSelection((selectedText: string) => {
                    return `\n## ${selectedText}\n`
                })
                break;
            case FormatActions.h3:
                replaceSelection((selectedText: string) => {
                    return `\n### ${selectedText}\n`
                })
                break;
            case FormatActions.h4:
                replaceSelection((selectedText: string) => {
                    return `\n#### ${selectedText}\n`
                })
                break;
            case FormatActions.h5:
                replaceSelection((selectedText: string) => {
                    return `\n##### ${selectedText}\n`
                })
                break;
            case FormatActions.h6:
                replaceSelection((selectedText: string) => {
                    return `\n###### ${selectedText}\n`
                })
                break;
            case FormatActions.italic:
                replaceSelection((selectedText: string) => {
                    return `*${selectedText}*`
                })
                break;
            case FormatActions.strikethrough:
                replaceSelection((selectedText: string) => {
                    return `~~${selectedText}~~`
                })
                break;
            case FormatActions.listbullet:
                replaceSelection((selectedText: string) => {
                    const rows = selectedText.split("\n");
                    if (rows.length > 0) {
                        return rows.map(str => { return `+ ${str}` }).join("\n")
                    } else {
                        return `\n+ ${selectedText}`
                    }
                })
                break;
            case FormatActions.listnumbered:
                replaceSelection((selectedText: string) => {
                    const rows = selectedText.split("\n");
                    if (rows.length > 0) {
                        return rows.map((str, index) => { return `${index + 1}. ${str}` }).join("\n")
                    } else {
                        return `\n+ ${selectedText}`
                    }
                })
                break;

            default:
                break;
        }
    }

    //end formatting text


    //titleMenu
    const [titleMenuAnchor, setTitleMenuAnchor] = React.useState<null | HTMLElement>(null);

    const titleMenuAnchorOpen = Boolean(titleMenuAnchor);

    const handleTitleMenuAnchorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setTitleMenuAnchor(event.currentTarget);
    };

    const handleTitleMenuAnchorClose = () => {
        setTitleMenuAnchor(null);
    };
    //end titleMenu

    //image menu
    const [insertImageMenuAnchor, setInsertImageMenuAnchor] = React.useState<null | HTMLElement>(null);
    const insertImageMenuAnchorOpen = Boolean(insertImageMenuAnchor);
    const handleInsertImageMenuAnchorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setInsertImageMenuAnchor(event.currentTarget);
    };
    const handleInsertImageMenuAnchorClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        setInsertImageMenuAnchor(null);
    };
    const insertImageParams = { label: "", uri: "" }
    function insertImage() {
        setContent(prev => {
            return `${prev}\n\n![${insertImageParams.label}](${insertImageParams.uri})`
        })
    }
    //image menu

    //link menu
    const [insertLinkMenuAnchor, setInsertlinkMenuAnchor] = React.useState<null | HTMLElement>(null);
    const insertLinkMenuAnchorOpen = Boolean(insertLinkMenuAnchor);
    const handleInsertLinkMenuAnchorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setInsertlinkMenuAnchor(event.currentTarget);
    };
    const handleInsertLinkMenuAnchorClose = (event: React.MouseEvent<HTMLButtonElement>) => {
        setInsertlinkMenuAnchor(null);
    };
    const insertLinkParams = { label: "", uri: "" }
    function insertLink() {
        setContent(prev => {
            return `${prev} [${insertLinkParams.label}](${insertLinkParams.uri})`
        })
    }
    //link menu

    return <Paper>
        <Grid container>
            <Grid item xs={12}>
                <Stack
                    direction={"row"}
                    maxWidth="90vw"
                    flexWrap={"wrap"}
                    justifyContent="flex-end">
                    <Button
                        id="link-button"
                        color="secondary"
                        variant="text"
                        disabled={!modeEdit}
                        aria-controls={insertLinkMenuAnchorOpen ? 'link-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={insertLinkMenuAnchorOpen ? 'true' : undefined}
                        onClick={handleInsertLinkMenuAnchorClick}
                    ><InsertLinkOutlinedIcon /></Button>

                    <Menu
                        id="link-menu"
                        anchorEl={insertLinkMenuAnchor}
                        open={insertLinkMenuAnchorOpen}
                        onClose={handleInsertLinkMenuAnchorClose}
                        MenuListProps={{
                            'aria-labelledby': 'link-button',
                        }}
                    >
                        <MenuItem>
                            <FormGroup>
                                <FormControl>
                                    <Typography
                                        align="center">{intl.formatMessage({ id: "MDEDITOR.link" })}</Typography>
                                    <TextField
                                        onChange={(input) => { insertLinkParams.uri = input.target.value }}
                                    ></TextField>
                                </FormControl>
                                <FormControl
                                    sx={{
                                        py: 2
                                    }}>
                                    <Typography
                                        align="center">{intl.formatMessage({ id: "MDEDITOR.linkLabel" })}</Typography>
                                    <TextField
                                        onChange={(input) => { insertLinkParams.label = input.target.value }}></TextField>
                                </FormControl>
                                <FormControl>
                                    <Button
                                        fullWidth={true}
                                        color="secondary"
                                        variant="outlined"
                                        onClick={(event) => { handleInsertLinkMenuAnchorClose(event); insertLink() }}>Добавить</Button>
                                </FormControl>
                            </FormGroup>
                        </MenuItem>
                    </Menu>
                    <Button
                        id="title-button"
                        color="secondary"
                        variant="text"
                        disabled={!modeEdit}
                        aria-controls={titleMenuAnchorOpen ? 'title-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={titleMenuAnchorOpen ? 'true' : undefined}
                        onClick={handleTitleMenuAnchorClick}
                    >
                        <TitleOutlinedIcon />
                    </Button>
                    <Menu
                        id="title-menu"
                        anchorEl={titleMenuAnchor}
                        open={titleMenuAnchorOpen}
                        onClose={handleTitleMenuAnchorClose}
                        MenuListProps={{
                            'aria-labelledby': 'title-button',
                        }}
                    >
                        <MenuItem onClick={() => { handleTitleMenuAnchorClose(); handleFormatAction(FormatActions.h1) }}><TitleOutlinedIcon />1</MenuItem>
                        <MenuItem onClick={() => { handleTitleMenuAnchorClose(); handleFormatAction(FormatActions.h2) }}><TitleOutlinedIcon />2</MenuItem>
                        <MenuItem onClick={() => { handleTitleMenuAnchorClose(); handleFormatAction(FormatActions.h3) }}><TitleOutlinedIcon />3</MenuItem>
                        <MenuItem onClick={() => { handleTitleMenuAnchorClose(); handleFormatAction(FormatActions.h4) }}><TitleOutlinedIcon />4</MenuItem>
                        <MenuItem onClick={() => { handleTitleMenuAnchorClose(); handleFormatAction(FormatActions.h5) }}><TitleOutlinedIcon />5</MenuItem>
                        <MenuItem onClick={() => { handleTitleMenuAnchorClose(); handleFormatAction(FormatActions.h6) }}><TitleOutlinedIcon />6</MenuItem>
                    </Menu>
                    <Button
                        color="secondary"
                        disabled={!modeEdit}
                        variant="text"
                        onClick={() => { handleFormatAction(FormatActions.bold) }}><FormatBoldOutlinedIcon /></Button>
                    <Button
                        color="secondary"
                        disabled={!modeEdit}
                        variant="text"
                        onClick={() => { handleFormatAction(FormatActions.italic) }}><FormatItalicIcon /></Button>
                    <Button
                        color="secondary"
                        disabled={!modeEdit}
                        variant="text"
                        onClick={() => { handleFormatAction(FormatActions.strikethrough) }}><FormatStrikethroughIcon /></Button>
                    <Button
                        color="secondary"
                        disabled={!modeEdit}
                        variant="text"
                        onClick={() => { handleFormatAction(FormatActions.listbullet) }}><FormatListBulletedOutlinedIcon /></Button>
                    <Button
                        color="secondary"
                        disabled={!modeEdit}
                        variant="text"
                        onClick={() => { handleFormatAction(FormatActions.listnumbered) }}><FormatListNumberedOutlinedIcon /></Button>
                    <Button
                        id="image-button"
                        color="secondary"
                        variant="text"
                        disabled={!modeEdit}
                        aria-controls={insertImageMenuAnchorOpen ? 'image-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={insertImageMenuAnchorOpen ? 'true' : undefined}
                        onClick={handleInsertImageMenuAnchorClick}
                    ><ImageOutlinedIcon /></Button>
                    <Menu
                        id="image-menu"
                        anchorEl={insertImageMenuAnchor}
                        open={insertImageMenuAnchorOpen}
                        onClose={handleInsertImageMenuAnchorClose}
                        MenuListProps={{
                            'aria-labelledby': 'image-button',
                        }}
                    >
                        <MenuItem>
                            <FormGroup>
                                <FormControl>
                                    <Typography
                                        align="center">{intl.formatMessage({ id: "MDEDITOR.image" })}</Typography>
                                    <TextField
                                        onChange={(input) => { insertImageParams.uri = input.target.value }}
                                    ></TextField>
                                </FormControl>
                                <FormControl
                                    sx={{
                                        py: 2
                                    }}>
                                    <Typography
                                        align="center">{intl.formatMessage({ id: "MDEDITOR.imageLabel" })}</Typography>
                                    <TextField
                                        onChange={(input) => { insertImageParams.label = input.target.value }}></TextField>
                                </FormControl>
                                <FormControl>
                                    <Button
                                        fullWidth={true}
                                        color="secondary"
                                        variant="outlined"
                                        onClick={(event) => { handleInsertImageMenuAnchorClose(event); insertImage() }}>Добавить</Button>
                                </FormControl>
                            </FormGroup>
                        </MenuItem>
                    </Menu>
                    <Button
                        color="secondary"
                        onClick={() => { setModeEdit(!modeEdit) }}
                        variant="text">{modeEdit ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}</Button>

                    <Button
                        color="secondary"
                        onClick={() => { messageDial.setShown(true) }}
                        variant="text"><HelpOutlineIcon /></Button>
                </Stack>
            </Grid>
            <Grid item xs={12}
                sx={{
                    position: "relative"
                }}>
                <>
                    <TextField
                        placeholder={props.placeholder}
                        multiline={true}
                        minRows={props.rowsCount}
                        contentEditable={false}
                        onChange={(tf) => { setContent(tf.target.value) }}
                        InputProps={{ value: content }}
                        sx={{
                            width: "100%",
                            display: !!modeEdit ? "inheirit" : "none"
                        }}
                        inputProps={{ onSelect: (input) => { handleSelection(input.currentTarget) } }}
                        onKeyDownCapture={(e) => {
                            if (e.shiftKey) {
                                if (e.key == "Enter") {
                                    props.onSend(content);
                                    setTimeout(() => { setContent(""); })
                                }
                            }
                        }} />
                    <Typography
                        sx={{
                            p: 2,
                            width: "100%",
                            display: !modeEdit ? "inheirit" : "none",
                        }}>
                        <DisplayMdWrapper>{content}</DisplayMdWrapper>
                    </Typography>
                </>
                <Tooltip title="SHIFT+ENTER" placement="top">
                    <IconButton
                        color="secondary"
                        onClick={() => {
                            props.onSend(content);
                            setContent("");
                        }}
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            mt: "10px"
                        }}>
                        <ArrowCircleRightOutlined />
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
        {messageDial.element}
    </Paper >
}
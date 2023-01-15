import { DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import { Button } from "selenium-webdriver";
import CloseIcon from '@mui/icons-material/Close';

export default function ShowAlertMessage(props: { title: string, content: JSX.Element | string }) {

    const [shown, setShown] = useState(false)

    function handleClose() {
        setShown(false)
    }

    return {
        element:
            <Dialog
                open={shown}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title"
                sx={{
                    pr:6,
                }}>
                    {props.title}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.content}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        ,
        setShown,
    }
}
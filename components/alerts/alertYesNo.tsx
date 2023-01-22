import { DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton, Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';

export function ShowAlertYesNoMessage(props: { title: string, content: JSX.Element | string, yesText: string, noText: string, yesAction: () => void, noAction: () => void }) {

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
                        pr: 6,
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
                    <DialogActions>
                        <Button
                            variant="outlined"
                            color="success"
                            onClick={props.yesAction}
                            sx={{
                                fontWeight: 600
                            }}>
                            {props.yesText}
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={props.noAction}
                            sx={{
                                fontWeight: 600
                            }}>
                            {props.noText}

                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        ,
        setShown,
    }
}
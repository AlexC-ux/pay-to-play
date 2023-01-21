import { PrismaClient, Users } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getSession } from "../sessions";
import { AppBar, Avatar, Button, IconButton, Stack, Toolbar } from "@mui/material";
import {MenuOutlined} from "@mui/icons-material"

type ComponentsProps = { user: Users | null }

export function Header(props: ComponentsProps) {
    return <>
        <AppBar
        sx={{
            position:"relative"
        }}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                >
                    <MenuOutlined />
                </IconButton>
                <Stack
                direction={"row-reverse"}
                spacing={2}>
                    {
                        (()=>{
                            if (!!props.user) {
                             return <>
                             <Avatar
                             src={props.user.avatar}>

                             </Avatar>
                             </>   
                            }
                            else{
                                return <>
                                <Button>
                                    123
                                </Button>
                                </>
                            }
                        })()
                    }
                </Stack>
            </Toolbar>
        </AppBar>
    </>
}
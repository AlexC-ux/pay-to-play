import { AppBar, Avatar, Backdrop, Badge, Box, Button, ButtonGroup, Divider, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, TextField, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useIntl } from "react-intl";
import React, { createRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SearchIcon from '@mui/icons-material/Search';
import styles from "../../styles/header/header.module.css";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import NotificationsWindow from "./notifications";
import ProfileNavigation from "./profileNav";
import MainMenu from "./mainMenu";
import axios from "axios";
import { INotification } from "../interfaces/notification";
import { IUser } from "../interfaces/user";
import { GlobalContext } from "../contextes/globalcontext";
import NeedAuth from "../contextes/Checkers/NeedAuth";

export default function Header() {

  const intl = useIntl();
  const router = useRouter();

  const globalContext = React.useContext(GlobalContext)!;

  const [profileNavShown, setProfileNavShown] = useState(false);
  const [mainNavShown, setMainNavShown] = useState(false);
  const [notifsPreviewShown, setNotifsPreviewShown] = useState(false);

  const [newNotifsCount, setNewNotifsCount] = useState(0);

  const goToIndex = () => {
    router.push(`/${intl.locale}`)
  }

  function markNotifsRead() {
    setNewNotifsCount(0);
    //TODO fetch to change new notifs
  }


  useEffect(() => {
    if (!!globalContext.user.value) {
      axios.post("/api/user/getNotifications",
        { token: globalContext.user.value!.token }).then((response) => {
          const notifs: INotification[] = response.data;

          let newNotifs = 0;

          if (Array.isArray(notifs)) {
            globalContext.user.dispatch((prev: any) => {
              const user: IUser | undefined = prev;
              if (!!user) {
                console.log({ user })
                user.notifications = notifs;
                if (!!notifs) {
                  notifs.forEach(n => {
                    if (!!n.new) {
                      newNotifs += 1
                    }
                  })
                }
                setNewNotifsCount(newNotifs)
                return user
              } else {
                return undefined
              }
            })
          }
        })

    }
  },
    [globalContext.user.value])

  function CheckAllNotifs() {
    //TODO post все уведомления прочитаны
  }

  return <>
    <AppBar
      sx={{
        bgColor: '#edf',
        display: "block",
        position: "relative",
        height: "64px",
      }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => { setMainNavShown(true) }}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          onClick={goToIndex}
          sx={{
            flexGrow: 1,
            cursor: "pointer",
          }}>
          Pay2Play
        </Typography>
        {!!globalContext.user.value ?
          //authed
          <NeedAuth redirectOnUnauth={false} >
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={0}
              sx={{
                height: "100%",
              }}>
              <Box
                className={styles.search}
                sx={{
                  display: "block",
                  m: 0,
                  p: 0,
                  margin: "auto",
                  mr: 1,
                  border: " 1px solid grey",
                  borderRadius: 4,
                }}>
                <Stack
                  direction="row"
                  spacing={0}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    margin: "auto",
                  }}>
                  <Box
                    sx={{
                      margin: "auto",
                      display: "flex",
                      p: 1,
                    }}>
                    <SearchIcon
                      sx={{
                        mr: 1
                      }}></SearchIcon>
                  </Box>
                  <TextField
                    variant="standard"
                    color="info"
                    placeholder={intl.formatMessage({ id: "HEADER.SEARCH.placeholder" })}
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{
                      pr: 1
                    }}></TextField>
                </Stack>
              </Box>
              <Button
                className={`${styles.paddingResizable} ${styles.messages}`}
                variant="text"
                endIcon={<ChatBubbleIcon></ChatBubbleIcon>}
                sx={{
                  px: 2,
                  color: "text.primary",
                  borderRadius: 0,
                  span: {
                    p: 0,
                    m: 0,
                  }
                }}
              ></Button>

              <Button
                className={styles.paddingResizable}
                variant="text"
                endIcon={
                  <Badge badgeContent={newNotifsCount} color="primary"><NotificationsIcon /></Badge>}
                onClick={() => { setNotifsPreviewShown(true); markNotifsRead(); }}
                sx={{
                  px: 2,
                  color: "text.primary",
                  borderRadius: 0,
                  span: {
                    p: 0,
                    m: 0,
                  }
                }}
              ></Button>
              <Button
                className={`${styles.paddingResizable} ${styles.profile}`}
                variant="text"
                endIcon={<Avatar
                  src={globalContext.user.value.avatar}></Avatar>}
                onClick={() => { setProfileNavShown(true) }}
                sx={{
                  px: 2,
                  color: "text.primary",
                  borderRadius: 0
                }}
              >
                <p className={styles.nick}>{globalContext.user.value.login}</p>
              </Button>
            </Stack>
            {
              /**PROFILE NAVIGATION */
            }
            <ProfileNavigation
              dispatch={setProfileNavShown}
              state={profileNavShown} />
            {
              /**NOTIFICATIONS */
            }
            <NotificationsWindow
              state={notifsPreviewShown}
              dispatch={setNotifsPreviewShown}
            />
          </NeedAuth>
          :
          //not authed
          <><Button color="inherit"
            href={`/auth`}
          >{intl.formatMessage({ id: "HEADER.authbtn" })}</Button></>}
      </Toolbar>

      {
        /**MAIN MENU */
      }
      <MainMenu
        state={mainNavShown}
        dispatch={setMainNavShown} />

    </AppBar>
  </>
}

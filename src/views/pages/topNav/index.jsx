import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  ClickAwayListener,
  Fade,
  IconButton,
  List,
  ListItem,
  Paper,
  Popper,
} from "@mui/material";

// css file
import "./index.scss";

const TopNav = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const useName = localStorage.getItem("user_name");

  const onLogout = () => {
    setAnchorEl(null);
    localStorage.removeItem("user_name");
    localStorage.removeItem("auth_token");
    window.location = "/login";
  };

  return (
    <AppBar className="top_nav" position="sticky">
      <img
        width="100vw"
        alt="logo-icon"
        src="https://kutumbapp.com/public/images/main/k-logo.svg"
      />

      <IconButton
        size="small"
        onClick={({ currentTarget }) => setAnchorEl(currentTarget)}
      >
        <Avatar className="user_icon" sizes="small" alt={useName || ""}>
          {useName?.[0] || ""}
        </Avatar>
      </IconButton>
      <ClickAwayListener
        mouseEvent="onMouseDown"
        onClickAway={() => setAnchorEl(null)}
      >
        <Popper
          transition
          placement="bottom-end"
          open={!!anchorEl}
          anchorEl={anchorEl}
          sx={{ zIndex: 10000 }}
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <Paper>
                <List className="list_container">
                  <ListItem
                    disablePadding
                    className="list_item"
                    onClick={onLogout}
                  >
                    Log Out
                  </ListItem>
                </List>
              </Paper>
            </Fade>
          )}
        </Popper>
      </ClickAwayListener>
    </AppBar>
  );
};

export default TopNav;

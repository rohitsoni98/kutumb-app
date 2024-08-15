import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Close from "@mui/icons-material/Close";
import { createQuote } from "./service";
import toast from "react-toast";
import { DEFAULT_ERROR_MESSAGE } from "../../../helpers/constant/utils";

const defaultState = { username: "", text: "", fileName: "" };

const AddQuoteDrawer = ({ openDrawer, closeDrawer, onSubmit }) => {
  const [state, setState] = useState({
    ...defaultState,
    username: localStorage.getItem("user_name").toLowerCase(),
  });
  const { username, text, fileName, file } = state;
  const uploadInputRef = useRef(null);

  useEffect(() => {
    return () => setState({ ...defaultState });
  }, []);

  const onChangeFields = ({ target: { name, value, files } }) => {
    // iterate fields data
    const data =
      name === "uploadFile"
        ? { file: files?.[0], fileName: files?.[0]?.["name"] }
        : { [name]: value };

    // set fields data
    setState((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const addQuote = async () => {
    try {
      await createQuote({ file, username, text });
      closeDrawer();
      onSubmit();
      toast.success("Successfully created a quote.");
    } catch (err) {
      toast.error(err?.["message"] || DEFAULT_ERROR_MESSAGE);
    }
  };

  return (
    <Drawer
      anchor={"right"}
      open={openDrawer}
      className={"add_quote_drawer"}
      PaperProps={{ sx: { width: "28vw" } }}
    >
      <Stack
        p="8px 16px"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography>Add Quote</Typography>
        <IconButton size="small" onClick={() => closeDrawer()}>
          <Close />
        </IconButton>
      </Stack>
      <Divider />
      {/* content section */}
      <Stack p="16px" spacing="16px" height="100%" overflow="auto">
        <TextField
          required
          fullWidth
          disabled
          size="small"
          name="username"
          label="User Name"
          value={username}
          onChange={onChangeFields}
        />

        <TextField
          required
          fullWidth
          name="text"
          size="small"
          label="Text"
          value={text}
          onChange={onChangeFields}
        />

        <input
          value={""}
          type={"file"}
          name={"uploadFile"}
          ref={uploadInputRef}
          style={{ display: "none" }}
          accept={".png, .svg, .jpeg, .jpg"}
          onChange={onChangeFields}
        />

        <Stack
          height="180px"
          alignItems="center"
          justifyContent="center"
          border="1px dashed rgba(0, 0, 0, 0.4)"
        >
          <img
            alt="uploadImg"
            style={{ width: fileName ? "10vh" : "20vh", cursor: "pointer" }}
            src={
              !fileName
                ? "https://t4.ftcdn.net/jpg/04/81/13/43/240_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg"
                : "https://uxwing.com/wp-content/themes/uxwing/download/video-photography-multimedia/remove-image-photo-icon.png"
            }
            onClick={() =>
              !fileName
                ? uploadInputRef.current.click()
                : setState((prev) => ({ ...prev, fileName: "", file: null }))
            }
          />
          <Typography>{fileName}</Typography>
        </Stack>
      </Stack>

      {/* action section */}
      <Divider />
      <Stack
        p="8px 16px"
        spacing="16px"
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Button size="small" onClick={() => closeDrawer()}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={addQuote}
          disabled={!fileName || !text || !username}
        >
          Done
        </Button>
      </Stack>
    </Drawer>
  );
};

export default AddQuoteDrawer;

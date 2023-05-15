import React, { useContext, useEffect, useState } from "react";
import * as signalR from "@aspnet/signalr";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import moment from "moment";
import { AppContext } from "../contexts/app.context";
export default function TestSignalr({
  isOpen,
  hasNotication,
  time,
  name,
  getEmployeeList,
}) {
  const [connection, setConnection] = useState();
  const [inputText, setInputText] = useState("");
  const [valueSendMessage, setValueSendMessage] = useState("");
  const [valueSendUser, setValueSendUser] = useState("");
  const [open, setOpen] = React.useState(false);
  const {
    appState,
    dispatch,
    setIsLoading,
    noticationIsOpen,
    setNoticationIsOpen,
    previousUrl,
    setPreviousUrl,
  } = useContext(AppContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    hasNotication(false);
    setPreviousUrl("/appointment");
  };

  useEffect(() => {
    const connect = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7101/hubs/notification", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();

    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("messageReceived", (username, message, sendDate) => {
            // console.log("12365412369874")
            onMessageReceived(username, message, sendDate);
            console.log(message, sendDate);
          });
        })
        .catch((error) => console.log(error));
    }
  }, [connection]);

  const sendMessage = async () => {
    var connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7101/hubs/notification", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .build();
    connection.start().then(() => {
      sendNewMessage(connection, inputText);

      connection.on("messageReceived", (username, message) => {
        console.log(123);
        onMessageReceived(username, message);
      });
      // connection.invoke("ReDesignMap").catch(function (err)s {
      //   return console.error(err.toString());
      // });
    });
    // setInputText("");
  };

  const onMessageReceived = (username, message) => {
    setValueSendMessage(message);
    setValueSendUser(username);
  };
  const sendNewMessage = () => {
    if (connection) {
      connection
        .send("newMessage", "pqbinh", "Update", new Date())
        .then((x) => console.log("sent"));
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Thông báo cập nhập lại bảng lương
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bảng lương đã có sự thay đổi bởi {name} vào thời gian{" "}
            {moment(time).format("DD-MM-YYYY HH:mm:ss")}. Bạn có muốn cập nhập
            lại bảng lương không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Từ chối</Button>
          <Button
            onClick={() => {
              hasNotication(false);
              getEmployeeList(1);
            }}
            autoFocus
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

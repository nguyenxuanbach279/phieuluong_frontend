import { Button, Input, notification } from "antd";
import React, { useEffect, useState } from "react";
import * as signalR from "@aspnet/signalr";
export default function TestSignalr(){
  const [connection, setConnection] = useState();
  const [inputText, setInputText] = useState("");
  const [valueSendMessage, setValueSendMessage] = useState("");
  const [valueSendUser, setValueSendUser] = useState("");

  useEffect(() => {
    const connect = new signalR.HubConnectionBuilder().withUrl("https://localhost:7101/hubs/notification",{
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    }).build();

    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("messageReceived", (username, message) => {
            // console.log("12365412369874")
            onMessageReceived(username, message);
          });
        })
        .catch((error) => console.log(error));
    }
  }, [connection]);

  const sendMessage = async () => {
      var connection = new signalR.HubConnectionBuilder().withUrl("https://localhost:7101/hubs/notification",{
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).build();
      connection.start().then(() => {
        sendNewMessage(connection,inputText);

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
        connection.send("newMessage", "pqbinh", inputText).then(x => console.log("sent"));
    }
  }

  return (
    <>
      <Input
        value={inputText}
        onChange={(input) => {
          setInputText(input.target.value);
        }}
      />
      <Button onClick={sendNewMessage}>
        Send
      </Button>
      <p>Người gửi: {valueSendUser}</p>
      <p>Tin nhắn: {valueSendMessage}</p>
    </>
  );
};
import React from "react";
import { Container, Button, Header, Image } from "semantic-ui-react";
import "./App.css";

export default function Clips({ ClipInfo }) {
 
  var StreamerInfo;
  var listItems;
  if (typeof ClipInfo["clipInfo"] === "undefined") {
  } else if (ClipInfo["clipInfo"].length === 0) {
  } else {
    StreamerInfo = ClipInfo["clipInfo"];
    listItems = StreamerInfo.map((d) => {
      return (
        <div
          className="column"
          key={d.title + d.thumbnail}
          style={{ marginTop: 20 }}
          id="containersmall"
        >
          <Image src={d.thumbnail} size="large" rounded />
          <Container id="infoBox">
            <Header style={{ marginTop: 5, marginBottom: 0 }}>{d.title}</Header>
            <Header as="h5" style={{ marginTop: 0, marginBottom: 0 }}>
              {d.duration} seconds long, with {d.views} views
            </Header>
            <Header as="h5" style={{ marginTop: 0, marginBottom: 0 }}>
              Posted on {d.date}
            </Header>
          </Container>
          <div style={{ textAlign: "center", marginLeft: 5 }}>
            <Button
              color="violet"
              style={{ marginTop: 5, textAlign: "center" }}
              href={d.download}
            >
              Download
            </Button>
          </div>
        </div>
      );
    });
  }
  // Render it
  return (
      <Container style={{ marginTop: 30, textAlign: 'center' }}>
        <div id="container" className="ui three column grid">
          {listItems}
        </div>
      </Container>
  );
}

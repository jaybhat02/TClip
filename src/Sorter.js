import React, { useState, useEffect } from "react";
import { Dropdown } from "semantic-ui-react";
import "./App.css";

export default function Sorter({ ClipInfo, setClipInfo, ResetSort }) {
  const [SortValue, setSortValue] = useState("");

  function Decreasing() {
    StreamerInfo.sort(function (a, b) {
      var dateA = a.views,
        dateB = b.views;
      return dateA - dateB;
    });
    StreamerInfo.reverse();
    var clips = { clipInfo: StreamerInfo };
    setClipInfo(clips);
  }

  function Increasing() {
    StreamerInfo.sort(function (a, b) {
      var dateA = a.views,
        dateB = b.views;
      return dateA - dateB;
    });
    var clips = { clipInfo: StreamerInfo };
    setClipInfo(clips);
  }

  function Oldest() {
    StreamerInfo.sort(function (a, b) {
      var dateA = new Date(a.date),
        dateB = new Date(b.date);
      return dateA - dateB;
    });
    var clips = { clipInfo: StreamerInfo };
    setClipInfo(clips);
  }

  function Newest() {
    StreamerInfo.sort(function (a, b) {
      var dateA = new Date(a.date),
        dateB = new Date(b.date);
      return dateA - dateB;
    });
    StreamerInfo.reverse();
    var clips = { clipInfo: StreamerInfo };
    setClipInfo(clips);
  }

  useEffect(() => {
    if (StreamerInfo !== undefined) {
      if (SortValue === 1) {
        Decreasing();
      } else if (SortValue === 2) {
        Increasing();
      } else if (SortValue === 3) {
        Newest();
      } else if (SortValue === 4) {
        Oldest();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SortValue]);

  useEffect(() => {
    if (StreamerInfo !== undefined) {
      setSortValue(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ResetSort]);

  var StreamerInfo;
  if (typeof ClipInfo["clipInfo"] === "undefined") {
    
  } else if (ClipInfo["clipInfo"].length === 0) {
    console.log("no clips");
  } else {
    StreamerInfo = ClipInfo["clipInfo"];
  }

  const options = [
    { key: 1, text: "Descending Views", value: 1 },
    { key: 2, text: "Ascending Views", value: 2 },
    { key: 3, text: "Newest", value: 3 },
    { key: 4, text: "Oldest", value: 4 },
  ];

  function sort(event, data) {
    if (StreamerInfo !== undefined) {
      setSortValue(data.value);
    }
  }

  return (
    <div style = {{ textAlign: "right" }}>
      <Dropdown
        placeholder="Sort by..."
        value={SortValue}
        id="sortInput"
        options={options}
        selection
        onChange={sort}
        
      />
    </div>
  );
}

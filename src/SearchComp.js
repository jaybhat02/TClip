import React, { useState, useEffect } from "react";
import { Form, Input, Button, List, Image, Loader } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import twitchPoint from "./twitch.png";
import { resolve } from "bluebird";
const request = require("request");



export default function SearchComp({ setClipInfo, setResetSort }) {
  const [Streamer, setStreamer] = useState("");
  var ClipInfo = useState("");
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const absMin = new Date(2016, 6, 26);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const absMax = new Date();
  const [MinDate, setMinDate] = useState(absMin);
  const [MaxDate, setMaxDate] = useState(absMax);
  var tomorrow = new Date(absMin);
  tomorrow.setDate(tomorrow.getDate() + 1);
  var yesterday = new Date(absMax);
  yesterday.setDate(yesterday.getDate() - 1);

  const [CalMinDate, setCalMinDate] = useState(tomorrow);
  const [CalMaxDate, setCalMaxDate] = useState(yesterday);
  const [LoaderAct, setLoaderAct] = useState(false);
  const setToday = false;

  const client_id =`${process.env.REACT_APP_CLIENT_ID}`;
  const client_secret =`${process.env.REACT_APP_CLIENT_SECRET}`;
  const NumClip = "100";
  var accessToken = "";
  var id = "";

  const [inst, setInst] = useState(
    <div style={{ marginTop: 15, marginBottom: 25 }} id="inst">
      <List size="big">
        <List.Item>
          <Image
            size="mini"
            src={twitchPoint}
          />
          <List.Content>
            Search your favourite streamers and get their best clips to download
          </List.Content>
        </List.Item>
        <List.Item>
          <Image
            size="mini"
            src={twitchPoint}          />
          <List.Content>
            Optional: You can select a minimum date, maximum date or a range of
            dates to query the clips you wish to download
          </List.Content>
        </List.Item>
        <List.Item>
          <Image
            size="mini"
            src={twitchPoint}          />
          <List.Content>
            Sort the clips how ever you like to find what you are looking for
          </List.Content>
        </List.Item>
      </List>
    </div>
  );

  useEffect(() => {
    if (MaxDate < absMin && MaxDate !== null) {
      alert(
        "The maximum date you have inputed is before twitch clips existed. This will not yield anything. Please change the maximum date."
      );
    }
    if (MinDate > absMax && MinDate !== null) {
      alert(
        "The minimum date you have inputed is in the future. This will not yield anything. Please change the minimum date."
      );
    }
    if (MinDate >= MaxDate && MinDate !== null) {
      alert(
        "The minimum date you have inputed is after maximum date. This will not yield anything. Please change the minimum date."
      );
    }
  }, [MaxDate, MinDate, absMax, absMin]);

  function changeMin(event, data) {
    var dateValue;
    if (data.value !== null) {
      dateValue = data.value;
    } else {
      dateValue = absMin;
    }
    setMinDate(dateValue);
    var tomorrow = new Date(dateValue);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCalMinDate(tomorrow);
  }

  function changeMax(event, data) {
    var dateValue;
    if (data.value !== null) {
      dateValue = data.value;
    } else {
      dateValue = absMax;
    }
    setMaxDate(dateValue);
    var yesterday = new Date(dateValue);
    yesterday.setDate(yesterday.getDate() - 1);
    setCalMaxDate(yesterday);
  }

  function getToken() {
    return new Promise((resolve, reject) => {
      const options = {
        url: "https://id.twitch.tv/oauth2/token",
        json: true,
        body: {
          client_id: client_id,
          client_secret: client_secret,
          grant_type: "client_credentials",
        },
      };
      request.post(options, (err, res, body) => {
        if (err) {
          reject(console.log(err));
        }
        var accessToken = body.access_token;
        resolve(accessToken);
      });
    });
  }

  function getId(accessToken) {
    return new Promise((resolve, reject) => {
      const idReq = {
        url: "https://api.twitch.tv/helix/users?login=" + Streamer,
        method: "GET",
        headers: {
          "Client-ID": client_id,
          Authorization: "Bearer " + accessToken,
        },
      };
      if (!accessToken) {
        reject(console.log("No Token"));
      } else {
        request.get(idReq, (err, res, body) => {
          if (err) {
            reject(console.log(err));
          }
          if(JSON.parse(body).data[0] === undefined){
            resolve('');
          } else {
            var id = JSON.parse(body).data[0].id;
            resolve(id);
          }
          
        });
      }
    });
  }

  function getClips(accessToken, id) {
    var clipInfo = [];
    if(id === ''){
      resolve(clipInfo)
    } else{
      return new Promise((resolve, reject) => {
        var cursor = '';
        
        getClipBatch(accessToken, id, cursor).then((response) => {
          cursor = response.cur;
          for(const i in response.ClipInfo){
            clipInfo.push(response.ClipInfo[i]);
          }
        }).then(() => {
          getClipBatch(accessToken, id, cursor).then((response) => {
            cursor = response.cur;
            for(const i in response.ClipInfo){
              clipInfo.push(response.ClipInfo[i]);
            }
          }).then(() => {
            getClipBatch(accessToken, id, cursor).then((response) => {
              cursor = response.cur;
              for(const i in response.ClipInfo){
                clipInfo.push(response.ClipInfo[i]);
              }
              resolve(clipInfo)
            })
          })
        })
      })
        
    }
      
  }

  function getClipBatch(accessToken, id, in_cursor) {
    return new Promise((resolve, reject) => {
      var cursor = in_cursor;
      var ClipInfo = [];
      var clipReq;
      if (cursor === '') {
        clipReq = {
          url:
            "https://api.twitch.tv/helix/clips?broadcaster_id=" +
            id +
            "&first=" +
            NumClip + '&started_at=' + MinDate.toISOString() +'&ended_at=' + MaxDate.toISOString(),
          method: "GET",
          headers: {
            "Client-ID": client_id,
            Authorization: "Bearer " + accessToken,
          },
        };

      } else if (cursor === undefined) {
        resolve({'cur': undefined,
                'ClipInfo': []});
      } else {
        clipReq = {
          url:
            "https://api.twitch.tv/helix/clips?broadcaster_id=" +
            id +
            "&first=" +
            NumClip + '&started_at=' + MinDate.toISOString() +'&ended_at=' + MaxDate.toISOString() +
            "&after=" +
            cursor,
          method: "GET",
          headers: {
            "Client-ID": client_id,
            Authorization: "Bearer " + accessToken,
          },
        };
      }
      request.get(clipReq, (err, res, body) => {
        if (err) {
          reject(console.log(err));
        }

        var clip_info = JSON.parse(body);
        cursor = clip_info.pagination.cursor;
        var options = { year: 'numeric', month: 'short', day: 'numeric' };
        
        for (const i in clip_info.data) {
          var x = clip_info.data[i];
          var date = new Date(x.created_at).toLocaleDateString("en-US", options)
          var relevent_info = {
            title: x.title,
            views: x.view_count,
            date: date,
            duration: x.duration,
            thumbnail: x.thumbnail_url,
            download: x.thumbnail_url.split("-preview", 1)[0] + ".mp4",
            toggle: false,
          };
          ClipInfo.push(relevent_info);
        }
        resolve({'cur': cursor,
                'ClipInfo': ClipInfo});
      });
    });
  }

  function getClipsRequest() {
    setLoaderAct(true);
    if (MaxDate === null) {
      setMaxDate(absMax);
    }
    if (MinDate === null) {
      setMinDate(absMax);
    }
    if (Streamer === "") {
      alert("Please Enter Streamer Name");
      setLoaderAct(false)
    } else {
  getToken()
    .then((response) => {
      accessToken = response;
      return getId(response);
    })
    .then((response) => {
      id = response;
      return(getClips(accessToken, id));
    }).then((response) => {
      var dict = {"clipInfo": response}
      ClipInfo = dict;
      if (
        typeof ClipInfo === "undefined" ||
        ClipInfo["clipInfo"] === undefined ||
        ClipInfo["clipInfo"].length === 0
      ) {
        alert("No Clips Found");
      } else {
        setInst("");
        setResetSort(new Date().toISOString());

        setClipInfo(ClipInfo);
      }
      setLoaderAct(false)
    })
    }
  }

  return (
    <div>
      <Form style={{ textAlign: "center", marginTop: 10 }}>
        
        <Input
          value={Streamer}
          onChange={(e) => setStreamer(e.target.value)}
          size="large"
          icon="search"
          style={{ width: 450, marginTop: 40 }}
          id="search"
          placeholder="Streamer Name"
          maxLength="25"
        />

        <Button
          color="violet"
          onClick={getClipsRequest}
          size="large"
          style={{ width: 200, marginLeft: 15, marginRight: 15 }}
          id="submitButton"
        >
          Submit
        </Button>

        <SemanticDatepicker
          id="initialDate"
          minDate={absMin}
          maxDate={CalMaxDate}
          onChange={changeMin}
          showToday={setToday}
          label="From: "
        />
        <SemanticDatepicker
          id="finalDate"
          minDate={CalMinDate}
          maxDate={absMax}
          onChange={changeMax}
          showToday={setToday}
          label="To:"
        />
      </Form>
      <Loader size='medium' inverted inline='centered' active={LoaderAct}/>
      <div>{inst}</div>
    </div>
  );
}

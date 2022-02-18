import React, { useState } from "react";
import SearchComp from "./SearchComp";
import Clips from "./Clips";
import TopHeader from "./TopHeader";
import Sorter from "./Sorter";

import { Container} from "semantic-ui-react";
import "./App.css";

function App() {
  const [ClipInfo, setClipInfo] = useState("");
  const [ResetSort, setResetSort] = useState(new Date().toISOString());

  return (
    <div >
    <Container >
      
      <TopHeader />
      <SearchComp setClipInfo={setClipInfo} setResetSort={setResetSort} />
      <Sorter ClipInfo={ClipInfo} setClipInfo={setClipInfo} ResetSort={ResetSort}/>
      <Clips ClipInfo={ClipInfo} />
      
    </Container>
    </div>
  );
}

export default App;

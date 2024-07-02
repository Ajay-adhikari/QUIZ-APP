import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

function Timer(props) {
  const [allsecs, setallsecs] = useState(
    parseInt(props.mins) * 60 + parseInt(props.secs)
  );
  const [mins, setmins] = useState(props.mins);
  const [secs, setsecs] = useState(props.secs);
  let history = useHistory();

  const handle = () => {
    setallsecs((prevAllsecs) => {
      const newAllsecs = prevAllsecs - 1;
      if (newAllsecs <= 0) {
        props.submithandler();
        return 0;
      }
      return newAllsecs;
    });
  };

  useEffect(() => {
    let altmins = Math.floor(allsecs / 60).toString();
    if (altmins.length === 1) altmins = "0" + altmins;
    let altsecs = (allsecs % 60).toString();
    if (altsecs.length === 1) altsecs = "0" + altsecs;
    setmins(altmins);
    setsecs(altsecs);

    const handleReload = () => {
      alert('reloaded encountered, Submitting the test');
      props.submithandler();
    };

    window.addEventListener('beforeunload', handleReload);

    return () => {
      window.removeEventListener('beforeunload', handleReload);
    };
  }, [allsecs, props]);

  useEffect(() => {
    const interval = setInterval(handle, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        justifyContent: "space-around",
        display: "flex",
        flexDirection: "row",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "rgb(26, 26, 26, 0.5)",
          color: "white",
          padding: "2% 2% 2% 2%",
          borderRadius: "8px",
        }}
      >
        <h1 style={{ fontSize: "2.5em" }}>{mins}</h1>
      </div>
      <div
        style={{
          background: "rgb(26, 26, 26, 0.5)",
          color: "white",
          padding: "2% 2% 2% 2%",
          borderRadius: "8px",
        }}
      >
        <h1 style={{ fontSize: "2.5em" }}>:</h1>
      </div>
      <div
        style={{
          background: "rgb(26, 26, 26, 0.5)",
          color: "white",
          padding: "2% 2% 2% 2%",
          borderRadius: "8px",
        }}
      >
        <h1 style={{ fontSize: "2.5em" }}>{secs}</h1>
      </div>
    </div>
  );
}

export default Timer;

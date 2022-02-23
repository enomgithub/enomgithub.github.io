import React, { useState } from "https://esm.sh/react@17.0.2";
import "../css/green.css";

export default function Navi() {
  const home = "Home";
  const about = "About";
  const gallery = "Gallery";
  const github = "GitHub";

  type CurrentContent =
    | "Home"
    | "About"
    | "Gallery";

  const [currentContent, setCurrentContent] = useState<CurrentContent>(home);
  const styleSelected = {
    borderBottomWidth: "4px",
    borderBottomStyle: "solid",
    borderBottomColor: "#fbfaf5",
  };
  const styleDeselected = { borderBottomWidth: "0" };

  const setContentStyle = (content: CurrentContent) => {
    return currentContent === content ? styleSelected : styleDeselected;
  };

  return (
    <h1>
      <div className="header">
        <div
          className={home.toLowerCase()}
          style={setContentStyle(home)}
          onClick={() => {
            setCurrentContent(home);
          }}
        >
          {home}
        </div>
        <div
          className={about.toLowerCase()}
          style={setContentStyle(about)}
          onClick={() => {
            setCurrentContent(about);
          }}
        >
          {about}
        </div>
        <div
          className={gallery.toLowerCase()}
          style={setContentStyle(gallery)}
          onClick={() => {
            setCurrentContent(gallery);
          }}
        >
          {gallery}
        </div>
        <div className={github.toLowerCase()}>
          <a href="https://github.com/enomgithub">{github}</a>
        </div>
      </div>
    </h1>
  );
}

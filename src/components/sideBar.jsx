import React from "react";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocketchat } from "@fortawesome/free-brands-svg-icons";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar({ nodeName, setNodeName, selectedNode, setSelectedElements, setSelectedNode}) {

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
      };

    const handleInputChange = (event) => {
        setNodeName(event.target.value);
    };
  

  return (
    <aside className="sideBar">
      {selectedNode ? (
        //settings panel
        <div >
          <div className="header">
          <FontAwesomeIcon icon={faArrowLeft} size="xs" style={{marginLeft: 2}} onClick={() => setSelectedElements([])}/>
          <span className="headerTitle">Message</span>
          </div>

          <div className="inputBox">
           <label className="label">Text</label>
           <br/>
          <textarea
            type="text"
            value={nodeName}
            onChange={handleInputChange}
            className="msg"
            rows={5}
          />
          <div className="line"/>
         </div>
        </div>
      ) : (
        //node panel
        <>
          <div
            onDragStart={(event) => onDragStart(event, "textnode")}
            draggable
            className="sideBarNode"
          >
            <FontAwesomeIcon icon={faRocketchat} size="2x" color="steelblue"/>
           <span style={{color: "steelblue", marginTop: '2px'}}>Message</span>
          </div>
        </>)}
        </aside>
  );
}
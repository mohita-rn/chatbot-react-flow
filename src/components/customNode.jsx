import React from "react";
import { Handle, Position } from "reactflow";
import "./styles.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faRocketchat } from "@fortawesome/free-brands-svg-icons";

//custome node
function CustomNode({ data, selected }) {
  return (
    <div className={`customNode ${selected ? "selected" : ""}`}>
      
        <div className="nodeTitle">
        <FontAwesomeIcon icon={faRocketchat} size="xs" transform="shrink-6"/>
          <span className="title"> Send Message </span>
          <div className="wtspIcon">
          <FontAwesomeIcon icon={faWhatsapp} size="xs" color="green" transform="shrink-6"/>
          </div>
        </div>
        <div className="nodeBody">
          <div>
            {data.label ?? "Text Node"}
          </div>
        </div>

      <Handle
        id="a"
        type="target"
        position={Position.Left}
      />
      <Handle
        id="b"
        type="source"
        position={Position.Right}
      />
    </div>
  );
}

export default CustomNode;
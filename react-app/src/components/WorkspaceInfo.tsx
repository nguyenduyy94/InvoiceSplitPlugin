import React from "react"
import {useSelector} from "react-redux";

const WorkspaceInfo = () => {
    const currentURL = useSelector((state:any) => state.workspace.currentURL);
    return (
        <div>
            Current URL : {currentURL}
        </div>
    )
};

export default WorkspaceInfo
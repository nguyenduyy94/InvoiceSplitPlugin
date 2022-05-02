import { configureStore } from '@reduxjs/toolkit'
import {workspaceSlice} from "./workspaceSlice";

export default configureStore({
    reducer: {
        workspace: workspaceSlice,
    },
})
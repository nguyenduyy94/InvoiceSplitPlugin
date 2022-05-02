import store from '../redux/store'

export const getWorkspaceInfo = (onSuccess:(response:any)=>void) => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // @ts-ignore
        chrome.tabs.sendMessage(tabs[0].id, {type: "getWorkspaceInfo"}, function(response) {
            onSuccess(response);
        });
    });
};


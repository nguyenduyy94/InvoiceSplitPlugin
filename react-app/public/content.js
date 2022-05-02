const port = chrome.runtime.connect();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting === "hello")
            sendResponse({farewell: "goodbye"});

        if (request.type === 'login') {
            var aTags = document.getElementsByTagName("a");
            var found;

            for (var i = 0; i < aTags.length; i++) {
                if (aTags[i].innerText.indexOf("Sign") >= 0) {
                    found = aTags[i];
                    break;
                }
            }

            found.click()
        }

        if (request.type === 'getWorkspaceInfo') {
            // TODO :
        }
    }
);

console.log('Content Script Injected!!');
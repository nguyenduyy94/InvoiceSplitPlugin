import React from 'react';
import logo from './logo.svg';
import './App.css';

import store from './redux/store'
import { Provider } from 'react-redux'
import WorkspaceInfo from "./components/WorkspaceInfo";

function App() {
  return (
      <Provider store={store}>
            <div className="App">
              <header className="App-header">
                HoaDonAuto
              </header>
              <div>
                <button onClick={e => {
                    console.log("Click");
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        // @ts-ignore
                        chrome.tabs.sendMessage(tabs[0].id, {type: "login"}, function(response) {
                            console.log(response.farewell);
                        });
                    });
                }}>Run</button>
              </div>
                <WorkspaceInfo/>
            </div>
      </Provider>
  );
}

export default App;

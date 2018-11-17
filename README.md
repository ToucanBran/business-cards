#Setup

- npm install
- You will need to create a environment.ts file in src/environments. It will need to contain the following constants:

export const environment = {<br>
  googleAnalytics: {<br>
    domain: 'auto',  // if in localhost enviroment, replace 'auto' with 'none'<br>
    trackingId: 'UA-xxxxxxxx-1' // replace with your Tracking Id<br>
  }<br>
};

<br>
export const firebaseConfig = { <br>
  apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxx',<br>
  authDomain: 'xxxxxxxxxxxxxxxxxxxxxxxx',<br>
  databaseURL: 'xxxxxxxxxxxxxxxxxxxxxxxx',<br>
  projectId: 'xxxxxxxxxxxxxxxxxxxxxxxx,<br>
  storageBucket: 'xxxxxxxxxxxxxxxxxxxxxxxx',<br>
  messagingSenderId: 'xxxxxxxxxxxxxxxxxxxxxxxx'<br>
};
<br>
export const googleApi = {<br>
  visionKey: 'xxxxxxxxxxxxxxxxxxxxxxxx',<br>
  languageKey: 'xxxxxxxxxxxxxxxxxxxxxxxx'<br>
};<br>

Without these the project will not work. You will need API keys for google Vision and google Cloud Natural Language



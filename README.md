#Setup

- npm install
- You will need to create a environment.ts file in src/environments. It will need to contain the following constants:

export const firebaseConfig = {
  apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxx',
  authDomain: 'xxxxxxxxxxxxxxxxxxxxxxxx',
  databaseURL: 'xxxxxxxxxxxxxxxxxxxxxxxx',
  projectId: 'xxxxxxxxxxxxxxxxxxxxxxxx,
  storageBucket: 'xxxxxxxxxxxxxxxxxxxxxxxx',
  messagingSenderId: 'xxxxxxxxxxxxxxxxxxxxxxxx'
};

export const googleApi = {
  visionKey: 'xxxxxxxxxxxxxxxxxxxxxxxx',
  languageKey: 'xxxxxxxxxxxxxxxxxxxxxxxx'
};

Without these the project will not work. You will need API keys for google Vision and google Cloud Natural Language



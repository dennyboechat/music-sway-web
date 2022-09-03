<div align="center">
    <img src="https://github.com/dennyboechat/music-sway-web/blob/main/public/ms_logo.png" alt="" width="100" height="auto" />
    <h1>MUSIC SWAY</h1>
    <p>Manage Music You Play</p>
    <p>
        <a href="https://github.com/dennyboechat/music-sway-web/graphs/contributors">
            <img src="https://img.shields.io/github/contributors/dennyboechat/music-sway-web" alt="contributors" />
        </a>
        <a href="">
            <img src="https://img.shields.io/github/last-commit/dennyboechat/music-sway-web" alt="last update" />
        </a>
        <a href="https://github.com/dennyboechat/music-sway-web/issues/">
            <img src="https://img.shields.io/github/issues/dennyboechat/music-sway-web" alt="open issues" />
        </a>
        <a href="https://github.com/dennyboechat/music-sway-web/blob/master/LICENSE">
            <img src="https://img.shields.io/github/license/dennyboechat/music-sway-web" alt="license" />
        </a>
    </p>
    <h4>
        <a href="https://music-sway-web.vercel.app/">View Demo</a>
        <span> · </span>
        <a href="https://github.com/dennyboechat/music-sway-web/issues/">Report Bug</a>
        <span> · </span>
        <a href="https://github.com/dennyboechat/music-sway-web/issues/">Request Feature</a>
    </h4>
</div>

<br />

<h3>Table of Contents</h3>

- [:dart: Features](#dart-features)
- [:space_invader: Tech Stack](#space_invader-tech-stack)
- [:key: Environment Variables](#key-environment-variables)
- [:gear: Installing/Running Locally](#gear-installingrunning-locally)
- [:compass: Features Roadmap](#compass-features-roadmap)
  - [Tech Roadmap](#tech-roadmap)
- [:warning: License](#warning-license)
- [:gem: Acknowledgements](#gem-acknowledgements)


### :dart: Features

- Create/copy lyrics and playlists freely, your way!
- Hands free: auto scroll songs, split screens, enlarge/reduce font.
- Display always visible (screen never locks).
- Keep songs and playlists private, share them publicly or with your band(s).
- Authentication performed via Spotify. We store no password!
- Totally responsive: great in mobiles, tablets and laptops.

<img src="https://user-images.githubusercontent.com/12437153/186416472-d23c9be6-2e58-4e54-abb7-1a00d44ffcd1.jpg" alt="" width="400" height="auto" />
<img src="https://user-images.githubusercontent.com/12437153/186417468-0018fdcb-8f2d-41d2-8617-f4d67d06a3a8.jpg" alt="" width="400" height="auto" />


### :space_invader: Tech Stack

<ul>
    <li><a href="https://vercel.com/" target="_blank">Vercel</a></li>
    <li><a href="https://nextjs.org/" target="_blank">Next JS</a></li>
    <li><a href="https://reactjs.org/" target="_blank">React JS 17.0.2</a></li>
    <li><a href="https://www.apollographql.com/" target="_blank">Apollo Server Micro</a></li>
    <li><a href="https://graphql.org/" target="_blank">GraphQL</a></li>
    <li><a href="https://mui.com/" target="_blank">Material UI</a></li>
    <li><a href="https://swr.vercel.app/" target="_blank">SWR</a></li>
    <li><a href="https://www.mysql.com/" target="_blank">MySQL</a></li>
</ul>


### :key: Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MYSQL_HOST`  
`MYSQL_DATABASE`  
`MYSQL_USERNAME`  
`MYSQL_PASSWORD`  

`SPOTIFY_CLIENT_ID`  
`SPOTIFY_CLIENT_SECRET`  

`NEXTAUTH_URL`  
`NEXTAUTH_SECRET`  


### :gear: Installing/Running Locally

Installation

```bash
 npm install
```

Run

```bash
 npm run dev
```

Access

```bash
 http://localhost:3000/
```

Other Commands

```bash
// Create db tables and populate basic data
npm run migrate

// Drop db tables
npm run drop-tables
```

### :compass: Features Roadmap

* [x] CRUD Songs.
* [x] Display of songs list and search.
* [x] CRUD Playlists.
* [x] Display of playlists list and internal songs.
* [x] Auto scroll, screen split, enlarge/reduce font.
* [x] CRUD Bands.
* [x] Bands invitations.
* [x] Users authentication.
* [ ] Main page content.
* [ ] Songs copy feature.
* [ ] Notifications (in app and email).
* [ ] Playlist temp sharing.
* [ ] Auto lyrics import.
* [ ] User manual.
* [ ] Premium mode.

#### Tech Roadmap

* [ ] Refactor code for TypeScript.
* [ ] Add unit tests.
* [ ] Add UI tests.


### :warning: License

Distributed under the <a href="https://github.com/dennyboechat/music-sway-web/blob/main/LICENSE">MIT License</a>.


### :gem: Acknowledgements

<ul>
    <li><a href="https://developer.spotify.com/documentation/general/guides/authorization/" target="_blank">Spotify Authorization</a></li>
    <li><a href="https://github.com/SortableJS/react-sortablejs/" target="_blank">react-sortablejs</a></li>
    <li><a href="https://github.com/richtr/NoSleep.js/" target="_blank">NoSleep.js</a></li>
    <li><a href="https://github.com/motdotla/dotenv/" target="_blank">DotEnv</a></li>
    <li><a href="https://www.tiny.cloud/" target="_blank">TinyMCE</a></li>
    <li><a href="https://github.com/remarkablemark/html-react-parser/" target="_blank">html-react-parser</a></li>
</ul>

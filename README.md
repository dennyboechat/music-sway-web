<div align="center">
    <img src="/ms_logo.png" alt="" width="200" height="auto" />
    <h1>MUSIC SWAY</h1>
    <p>Manage Music You Play</p>
    <p>
        <a href="https://github.com/dennyboechat/music-sway-web/graphs/contributors">
            <img src="https://img.shields.io/github/contributors/Louis3797/awesome-readme-template" alt="contributors" />
        </a>
        <a href="">
            <img src="https://img.shields.io/github/last-commit/Louis3797/awesome-readme-template" alt="last update" />
        </a>
        <a href="https://github.com/dennyboechat/music-sway-web/issues/">
            <img src="https://img.shields.io/github/issues/Louis3797/awesome-readme-template" alt="open issues" />
        </a>
        <a href="https://github.com/dennyboechat/music-sway-web/blob/master/LICENSE">
            <img src="https://img.shields.io/github/license/Louis3797/awesome-readme-template.svg" alt="license" />
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
- [:compass: Roadmap](#compass-roadmap)
- [:warning: License](#warning-license)
- [:gem: Acknowledgements](#gem-acknowledgements)


### :dart: Features

- Create/copy lyrics and playlists freely, your way!
- Hands free: auto scroll songs, split screens, enlarge/reduce font.
- Display always visible (screen never locks).
- Keep songs and playlists private, share them public or with your band(s).
- Authentication performed via Spotify. We store no password!
- Totally responsive: great in mobiles, tablets and laptops.


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

### :compass: Roadmap

* [x] Songs list and search.
* [x] Auto scroll, screen split, enlarge/reduce font.
* [x] Playlist list.
* [x] CRUD Songs.
* [x] CRUD Playlists.
* [x] CRUD Bands.  
* [-] Users credentials and invitations.
* [ ] Songs copy feature.
* [ ] Bands setup improvement.
* [ ] Main page content.
* [ ] Playlist temp sharing.
* [ ] Auto lyrics import.
* [ ] Premium mode.


### :warning: License

Distributed under the MIT License.


### :gem: Acknowledgements

<ul>
    <li><a href="https://developer.spotify.com/documentation/general/guides/authorization/" target="_blank">Spotify Authorization</a></li>
    <li><a href="https://github.com/SortableJS/react-sortablejs/" target="_blank">react-sortablejs</a></li>
    <li><a href="https://github.com/richtr/NoSleep.js/" target="_blank">NoSleep.js</a></li>
    <li><a href="https://github.com/motdotla/dotenv/" target="_blank">DotEnv</a></li>
    <li><a href="TinyMCE" target="_blank">https://www.tiny.cloud/</a></li>
    <li><a href="https://github.com/remarkablemark/html-react-parser/" target="_blank">html-react-parser</a></li>
</ul>

const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton = document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const songArtist = document.getElementById("song-artist");
const pauseButton = document.getElementById("pause");
const playButton = document.getElementById("play");
const playListButton = document.getElementById("playlist");

const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");

const progressBar = document.getElementById("progress-bar");
const playListContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playListSongs = document.getElementById("playlist-songs");

const currentProgress = document.getElementById("current-progress");

let index = 4;
let loop = true;

//Json olarak verilere ulaşıyoruz
const songsList = [
  {
    name: "Allahtan Kork",
    link: "assets/aşkın.mp3",
    artist: "Aşkın Nur Yengi & Mehmet Erdem",
    image: "assets/aşkın.jpg",
  },
  {
    name: "Sensiz Olmaz",
    link: "assets/bülent.mp3",
    artist: "Bülent Ortaçgil",
    image: "assets/bülent.jpeg",
  },
  {
    name: "Havana",
    link: "assets/havana.mp3",
    artist: "Camila Cabello",
    image: "assets/camilla.jpg",
  },
  {
    name: "Yediverenim",
    link: "assets/funda.mp3",
    artist: "Funda Arar",
    image: "assets/funda.jpg",
  },
  {
    name: "Unutmam Lazım",
    link: "assets/sedef.mp3",
    artist: "Sedef Sebüktekin",
    image: "assets/sedef.png",
  },
];

//Play
const playAudio = () => {
  audio.play();
  pauseButton.classList.remove("hide"); //göster
  playButton.classList.add("hide"); //gizle
};

//Pause
const pauseAudio = () => {
  audio.pause();
  pauseButton.classList.add("hide");
  playButton.classList.remove("hide");
};

//SetSong
const setSong = (arrayIndex) => {
  let { name, link, artist, image } = songsList[arrayIndex];
  audio.src = link;
  songName.innerHTML = name;
  songArtist.innerHTML = artist;
  songImage.src = image;
};

audio.onloadedmetadata = () => {
  //calculateSec
  maxDuration.innerText = timeFormatter(audio.duration);
};

playListContainer.classList.add("hide");
playAudio();

//secCheck
setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
  currentProgress.style.width =
    (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
}, 1000);

//Song time control
progressBar.addEventListener("click", (event) => {
  //starter
  let coordStart = progressBar.getBoundingClientRect().left;
  console.log(coordStart);

  // click point
  let coordEnd = event.clientX;
  console.log(coordEnd);
  console.log(progressBar.offsetWidth);

  // percent calculate
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;
  console.log(progress);

  //keep progress
  currentProgress.style.width = progress * 100 + "%";

  //set time sound
  audio.currentTime = progress * audio.duration;

  audio.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};

const previousSong = () => {
  if (index > 0) {
    pauseAudio();
    index = index - 1;
  } else {
    index = songsList.length - 1;
  }
  setSong(index);
};

const nextSong = () => {
  if (loop) {
    if (index == songsList.length - 1) {
      index = 0;
    } else {
      index = index + 1;
    }
    setSong(index);
  } else {
    let randIndex = Math.floor(Math.random() * songsList.length);
    setSong(randIndex);
  }
};

//when click repeat
repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active");
    audio.loop = false;
  } else {
    repeatButton.classList.add("active");
    audio.loop = true;
  }
});

//when use mix
shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    shuffleButton.classList.remove("active");
    audio.loop = true;
  } else {
    shuffleButton.classList.add("active");
    audio.loop = false;
  }
});

//when end song
audio.onended = () => {
  nextSong(); //next song
};

playListButton.addEventListener("click", () => {
  playListContainer.classList.remove("hide");
});

closeButton.addEventListener("click", () => {
  playListContainer.classList.add("hide");
});

//play click
playButton.addEventListener("click", playAudio);

//stop click
pauseButton.addEventListener("click", pauseAudio);

//after click
prevButton.addEventListener("click", previousSong);

//next click
nextButton.addEventListener("click", nextSong);

const initializePlaylist = () => {
  for (let i in songsList) {
    playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
         <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
         <span id="playlist-song-name">
          ${songsList[i].name}
         </span>
         <span id="playlist-song-artist-album">
         ${songsList[i].artist}
         </span>
        </div>
       </li>
       `;
  }
};

window.onload = () => {
  index = 0;
  setSong(index);
  pauseAudio();
  initializePlaylist();
};

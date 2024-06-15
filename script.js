var audio = new Audio()
let play = document.getElementById("play")
let next = document.getElementById("next")
let previous = document.getElementById("previous")
let index
let volumebar_measure = document.getElementById("volume").getBoundingClientRect();
let currentfolder
let songs

function firstsong(song, name) {
  audio.src = song
  document.querySelector(".songinfo").innerHTML = name
  audio.addEventListener("loadedmetadata", () => {
    document.querySelector(".duration").innerHTML = convertominute(audio.duration)
  })
}

async function getSongs(folder) {
  currentfolder=folder
  let a = await fetch(`/songs/${folder}/`)
  console.log(a)
  let response = await a.text()
  console.log(response)
  let div = document.createElement("div")
  div.innerHTML = response
  let tds = div.getElementsByTagName("td")
  console.log(tds)
  let as = div.getElementsByTagName("a")
  console.log(as)
  songs=[]
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href)
    }

  }
  return songs
}

async function songCard(songs) {
  return new Promise((resolve, reject) => {
    console.log(songs)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    for (const song of songs) {
      songUL.innerHTML = songUL.innerHTML + `<li>
            <div class="info">
            <img class="invert" src="music.svg">
                <div class="Name">${song.split(`/songs/${currentfolder}/`)[1].replaceAll("%20", " ")}-Harshit</div>
            </div>
            <div class="playnow">
                <span>Play</span>
                <img class="invert playIcon" src="play.svg" alt="play" >
                
            </div>
        </li>`
    }
    resolve();

  })
}


function playsong(song) {
  console.log(song)
  if (audio.paused) {
    if (audio.src != song) {
      audio.src = song
      audio.play()
      play.src = "pause.svg"
      document.querySelector(".songinfo").innerHTML = song.split(`/songs/${currentfolder}/`)[1].replaceAll("%20"," ")
    }
    else {
      audio.play()
      play.src = "pause.svg"
    }
  }
  else {
    if (audio.src != song) {
      audio.src = song
      document.querySelector(".songinfo").innerHTML = song.split(`/songs/${currentfolder}/`)[1].replaceAll("%20"," ")
      audio.play()
    }
    else {
      audio.pause()
      play.src = "play.svg"

    }

  }
}
function indexcount(songs) {
  songs.forEach((song, i) => {
    if (audio.src == song) {
      index = i
    }
  })
}
function convertominute(x) {
  if(isNaN(x)){
    return `00:00`
  }
  let minute = Math.floor(x / 60)
  console.log(minute)
  let second = Math.floor(x % 60)

  if ((second >= 0) && (second <= 9)) {
    return `${minute}:0${second}`
  }
  else {
    return `${minute}:${second}`
  }

}
function clickseekbar() {
  let seekbar = document.querySelector(".seekbar")
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let seekbarinfo = e.target.getBoundingClientRect()
    let clickwidth = e.clientX - seekbarinfo.left
    let left = ((clickwidth / seekbarinfo.width))
    console.log(clickwidth, e.clientX, seekbarinfo.left, seekbarinfo.width, left)
    document.querySelector(".circle").style.left = (left) * 100 + "%"
    audio.currentTime = Math.floor(left * (audio.duration))

  })
}

function changevolume() {
  document.getElementById("volume").addEventListener("change", (e) => {
    audio.volume=(e.target.value/100)
  })
}
async function artistcards(){
  let a=await fetch("/songs/")
  console.log(a)
  let response=await a.text()
  console.log(response)
  let div=document.createElement("div")
  div.innerHTML=response
  as=div.getElementsByTagName("a")
 console.log(as)
 let arr=Array.from(as)
 for (let i = 0; i < arr.length; i++) {
  const element = as[i];
  if(element.href.includes(`/songs`) && !element.href.includes(".htaccess")){
    let folder=e.href.split("/").slice(-2)[0]
    let info=await fetch(`/songs/${folder}/info.json`)
    let info_obj=await info.json()
    document.querySelector(".card-container").insertAdjacentHTML("beforeend",`<div data-folder=${folder} class="card">
      <img class="flex justify-content artist-img" src=${info_obj.img} alt="pritam">
      <h3>${info_obj.Name}</h3>
      <p>Artist</p>
      <img src="Pictures/Play-button.png" class="play" src="play">
  </div>`)
  }
 }

}


async function main() {

  //for clicking the seekbar and jumping to different parts of a song
  clickseekbar()
  //to change the volume of songs from playbar
  changevolume()
  
  //Get the list of all the songs
  await artistcards()
  document.querySelectorAll(".card").forEach(element => {
    element.addEventListener("click",async (e) => {
      
      document.querySelector(".songList ul").innerHTML=""
      songs = await getSongs(element.dataset.folder);
      await songCard(songs)
      firstsong(songs[0], songs[0].split(`/songs/${currentfolder}/`)[1].replaceAll("%20"," "))
       
      
        let playicons = document.querySelectorAll(".playIcon")
        for (let i = 0; i < playicons.length; i++) {
          playicons[i].addEventListener("click", () => {
            playsong(songs[i])
          })
        }
      })
  });


  play.addEventListener("click", (e) => {
    console.log(audio.volume)
    if (audio.paused) {
      audio.play()
      play.src = "pause.svg"

    }
    else {
      audio.pause()
      play.src = "play.svg"
    }
  })

  previous.addEventListener("click", (e) => {
    play.src = "pause.svg"
    indexcount(songs)
    console.log(songs.length)
    if (index >= 1) {
      audio.src = songs[index - 1]
      audio.play()
    }

    document.querySelector(".songinfo").innerHTML = songs[index - 1].split(`/songs/${currentfolder}/`)[1].replaceAll("%20"," ")
  })

  next.addEventListener("click", (e) => {
    play.src = "pause.svg"
    indexcount(songs)
    if (index<songs.length-1) {
      audio.src = songs[index + 1]
      audio.play()
    }
    document.querySelector(".songinfo").innerHTML = songs[index + 1].split(`/songs/${currentfolder}/`)[1].replaceAll("%20"," ")
  })

  document.querySelector(".hamburger img").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "0%"
  })

  document.querySelector(".back img").addEventListener("click", (e) => {
    document.querySelector(".left").style.left = "-100%"
  })

  //listen for timeupdate event
  audio.addEventListener("timeupdate", (e) => {
    let duration = Math.floor(audio.duration)
    let currentTime = Math.floor(audio.currentTime)
    console.log(currentTime, duration)
    document.querySelector(".currenttime").innerHTML = `${convertominute(currentTime)}/`

    document.querySelector(".duration").innerHTML = convertominute(duration)
    document.querySelector(".circle").style.left = (currentTime / duration) * 100 + "%"
    if (audio.currentTime == audio.duration) {
      document.getElementById("play").src = "play.svg"
    }
  })

}
main();

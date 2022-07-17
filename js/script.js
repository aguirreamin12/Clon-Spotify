
// Se toman las canciones del JSON
songs = JSON.parse(localStorage.getItem("songs"));

const updateStorage = () => {
    localStorage.setItem("songs", JSON.stringify(songs))
}

// Se obtienen los elementos
const playerHead = document.getElementById("player");
let playBtn = document.getElementById("playBtn");
let pauseBtn = document.getElementById("pauseBtn");
let cardCollection = document.querySelectorAll(".card__collection_main");
let currentSong = new Audio();
let saludo = document.getElementById("card__heading");

//El reproductor esta oculto de forma predeterminada (solo cuando aparece cuando se hace click en la cancion)
playerHead.style.display = "none";

//funcion para crear tarjeta y funcionalidad
const createCard = (songs) => {
    const card = document.createElement("div");
    const img = document.createElement("img");
    const cardInfo = document.createElement("div");
    const cardName = document.createElement("p");
    const cardArtist = document.createElement("p");

    //Se asignan clases de los elementos creados
    card.className = "card";
    cardInfo.className = "card_info";
    cardName.className = "card_name";
    cardArtist.className = "card_artist";

    //Se agregan los detalles de cancion a la card
    cardName.innerHTML = songs.name;
    cardArtist.innerHTML = songs.artist;
    img.src = songs.image;
    img.alt = songs.name;

    //Estructura de la card
    cardInfo.append(cardName, cardArtist);
    card.append(img, cardInfo);

    //Se añada funcionalidad de la card
    card.onclick = function(){
        playerHead.style.display = "flex";
        currentSong = updatePlayer(songs);
        playPauseFunc(currentSong);
    }

    //Se devuelve la card
    return card;
}

//Agrego funcionalidad de los botones de reproduccion y pausa
const playPauseFunc = (song) => {
    
    playBtn = document.getElementById("playBtn");
    pauseBtn = document.getElementById("pauseBtn");
    
    //Se añade boton de reproducción, funciona con el click
    playBtn.addEventListener("click", () => {
        song.play();
        playBtn.style.display = "none";
        pauseBtn.style.display = "inline";
    });
    
    //Se añade pausa, funciona con el click
    pauseBtn.addEventListener("click", () => {
        song.pause();
        playBtn.style.display = "inline";
        pauseBtn.style.display = "none";
    });
}

//Like y dislike de cancion para agregar en las canciones que me gustan
const likeSong = (id, likeBtn, songName) => {

    //Se reinicia la coleccion para obtener una actualizada de DOM
    cardCollection = document.querySelectorAll(".card__collection_main");
    //Se obtienen las canciones favoritas actuales de la anterior
    let likedSongs = cardCollection[0].children;

    likedSongs = Array.from(likedSongs);

    //Si no te gusta la cancion:
    //se cambia el color de me gusta
    //se remueve tambien esa cancion de la coleccion de "me gusta"
    if(songs[id].liked){
        songs[id].liked = false;
        likeBtn.style.color = "grey";
        likedSongs.forEach(songCard => {
            const name = songCard.lastChild.firstChild.innerHTML;
            if(name == songName){
                songCard.style.display = "none";
                songCard.remove();
            }
        });
    //Si te gusta la cancion:
    //Se cambia el color de me gusta
    //se agrega esa cancion a la coleccion de "me gusta"
    } else {
        songs[id].liked = true;
        likeBtn.style.color = "red";
        cardCollection[0].append(createCard(songs[id]));
    }
    updateStorage();
}

//se actualiza el reprotudctor cada vez que se hace click en una nueva cancion
const updatePlayer = ({name, artist, location, image, liked, id}) => {
    
    currentSong.setAttribute("src", location);

    //Se obtienen los elemntos necesarios para el reproductor
    const songContainer = document.querySelector(".song");
    const artistContainer = document.querySelector(".artist");
    const likeBtn = document.querySelector(".likeBtn");
    const artistImage = document.querySelector(".artist_image");
    const endTime = document.getElementById("end_time");

    playBtn = document.getElementById("playBtn");
    pauseBtn = document.getElementById("pauseBtn");

    //Configuración predeterminada de pausa y reproduccion.
    playBtn.style.display = "inline";
    pauseBtn.style.display = "none";
    
    //se agregan datos de cancion.
    songContainer.innerHTML = name;
    artistContainer.innerHTML = artist;
    artistImage.src = image;
    
    //Se asigna el id de la cancion,
    //Tambien se verifica si la cancion le gusta o no.
    likeBtn.id = id;
    likeBtn.style.color = "grey";
    if(liked){
        likeBtn.style.color = "red";
    }

    //Se añade funcionalidad al boton me gusta.
    likeBtn.onclick = function () {
        likeSong(likeBtn.id, likeBtn, name);
    }   

    //Se establece duración de la cancion
    currentSong.onloadedmetadata = () => {
        let duration = currentSong.duration;
        duration = (duration/60).toPrecision(3) + "";
        endTime.innerHTML = duration;
    }

    //Se retorna la canción
    return currentSong;
}

//Funcion llama a las demas funciones
//Se actualizan las colleciones creando tarjetas y agregandolas
const updateCollection = () => {
    cardCollection = document.querySelectorAll(".card__collection_main");
    //Usamos ForEach para pasar canciones.
    cardCollection.forEach((collection, index) => {
        //Collecion canciones me gusta
        if(index === 0){
            songs.forEach((song) => {
                if(song.liked){
                    collection.append(createCard(song))
                }
            })
        //Las otras colecciones se ponen todas las canciones
        } else {
            songs.forEach((song) => {
                collection.append(createCard(song));
            });
        }
        //Para cada coleccion impar, invertir el orden de la coleccion
        if(index%2 !== 0){
            collection.classList.toggle("reverse");
        }
    })
}

document.addEventListener("DOMContentLoaded", async() => {
    updateCollection();
})

// Saludo buenos dias/tardes/noches
const DateTime = luxon.DateTime;

const dt = DateTime.now();


if (dt.hour > 5 && dt.hour < 12) {
    saludo.innerHTML = ('Buenos días');
} else if (dt.hour > 12 && dt.hour < 19) {
    saludo.innerHTML = ('Buenas tardes');
} else {
    saludo.innerHTML = ('Buenas noches');
}
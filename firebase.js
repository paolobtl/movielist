import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import {
    getAnalytics
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-analytics.js";
import {
    getDatabase,
    ref,
    onValue,
    push,
    remove
} from "https://www.gstatic.com/firebasejs/10.2.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyARwWxDAU7-Iyg1YygHZAOzU56UX1GORMg",
    authDomain: "movie-db-23877.firebaseapp.com",
    databaseURL: "https://movie-db-23877-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "movie-db-23877",
    storageBucket: "movie-db-23877.appspot.com",
    messagingSenderId: "746478772130",
    appId: "1:746478772130:web:8148b3082f9afc593f5cfb",
    measurementId: "G-V2FWYMGVXM"
};

const addButton = document.querySelector('#addButton')
const movieInput = document.querySelector('#movieInput')


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

const movieDB = ref(database, 'movies')
const writeDataBase = () => {
    if (movieInput.value !== '') {
        push(movieDB, {
            name: movieInput.value
        })
        console.log(`Movie ${movieInput.value} was pushed to the dataBase`);
        movieInput.value = '';
    }
    renderMovies()
}
const removeFromDataBase = (parsedMoviesArray, index) => {
    const moviedBIndex = parsedMoviesArray[index].id;
    remove(ref(database, `movies/${moviedBIndex}`));
}


const renderMovies = () => {
    const movieList = document.querySelector('#movieList');
    const lsMovies = JSON.parse(localStorage.getItem('movies'));
    movieList.innerHTML = ''; // Clear the movieList before rendering
    if (lsMovies && lsMovies.length) {
        lsMovies.forEach((movie, index) => {
            const li = document.createElement('li');
            li.className = "movie-item";
            li.setAttribute('data-movie-index', index);
            li.textContent = movie.name;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                removeFromDataBase(lsMovies, index);
                renderMovies()
            });

            li.appendChild(removeButton);
            movieList.appendChild(li);
        });
    }
}
const readDataBase = () => {
    return new Promise((resolve, reject) => {
        onValue(movieDB, (snapshot) => {
            var data = [];
            snapshot.forEach(element => {
                data.push({
                    id: element['key'],
                    ...element.val()
                })
            });

            if (data) {
                localStorage.setItem('movies', JSON.stringify(data));
                resolve(true); // Resolve the promise with true
            } else {
                resolve(false); // Resolve the promise with false
            }
        }, (error) => {
            console.error("Error reading data:", error);
            reject(error); // Reject the promise with the error
        });
    });
}

// Usage of the function
readDataBase()
    .then((success) => {
        console.log("Data read and stored successfully:", success);
    })
    .catch((error) => {
        console.error("An error occurred:", error);
    });


addButton.addEventListener('click', writeDataBase);
movieInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        writeDataBase(); 
    }
});
renderMovies()
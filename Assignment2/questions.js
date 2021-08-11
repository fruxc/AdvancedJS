// Promise to get data from specified URL 
getResponseData = (url) => {
    return new Promise((resolve, reject) => {
        $.getJSON({
            url: url,
            type: 'GET',
            data: {},
            success: (data) => {
                resolve(data)
            },
            error: (error) => {
                reject(error)
            },
        })
    })
}


// Question 1

const MoviesByActor = async (movies, actor) => {
    let moviesByActor = []
    movies.forEach((movie) => {
        movie.cast.forEach((cast) => {
            if (cast === actor) {
                moviesByActor.push(movie.title)
            }
        })
    })
    return moviesByActor
}


const MoviesByGenre = async (movies, genre) => {
    let moviesByGenre = []
    await movies.forEach((movie) => {
        movie.genres.forEach((data) => {
            if (data === genre) {
                moviesByGenre.push(movie.title)
            }
        })
    })
    return moviesByGenre
}

QuestionOne = async () => {
    await getResponseData("https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json").then((movies) => {
        let result = {
            "Actors": [],
            "Genres": []
        }
        let actors = []
        let genres = []
        movies.forEach((movie) => {
            movie.cast.forEach((actor) => {
                if (!actors.includes(actor)) {
                    actors.push(actor)
                }
            })
            movie.genres.forEach((genre) => {
                if (!genres.includes(genre)) {
                    genres.push(genre)
                }
            })
        })
        actors.forEach(async (actor) => {
            let Actors = {
                "Name": actor,
                "Movies": await MoviesByActor(movies, actor)
            }
            result.Actors.push(Actors)
        })
        genres.forEach(async (genre) => {
            let Genres = {
                "Type": genre,
                "Movies": await MoviesByGenre(movies, genre)
            }
            result.Genres.push(Genres)
        })
        console.log(result)
    }).catch((error) => {
        console.error(error)
    })
}

// Question 2
QuestionTwo = async () => {

}
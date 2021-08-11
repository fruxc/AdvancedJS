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
    console.time("exec")
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
    console.timeEnd("exec")
}

// Question 2
class QueenAttack {
    constructor(queen1, queen2) {
        if (queen1[0] === queen2[0] && queen1[1] === queen2[1]) throw new Error("Queens cannot be at the same position")
        if (queen1[0] >= 8 || queen1[0] < 0 || queen1[1] >= 8 || queen1[1] < 0) throw new Error("Queens cannot be outside the board")
        if (queen2[0] >= 8 || queen2[0] < 0 || queen2[1] >= 8 || queen2[1] < 0) throw new Error("Queens cannot be outside the board")
        this.queen1 = queen1
        this.queen2 = queen2
    }
    canAttack() {
        // If queen and the opponent are in the same row
        if (this.queen1[1] === this.queen2[1]) return "Queens can attack because they are in the same row"
        // If queen and the opponent are in the same column
        if (this.queen1[0] === this.queen2[0]) return "Queens can attack because they are in the same column"
        // If queen can attack the opponent diagonally
        if (this.queen1[1] - this.queen2[1] === this.queen1[0] - this.queen2[0]) return "Queens can attack each other diagonally"
        return "Queens cannot attack each other"
    }
}

QuestionTwo = async () => {
    const queen1 = [parseInt($("#qox").val()), parseInt($("#qoy").val())]
    const queen2 = [parseInt($("#qtx").val()), parseInt($("#qty").val())]
    const queens = new QueenAttack(queen1, queen2)
    var div = $('<div> <br/> For Queen1 position: x = ' + queen1[0] + ' and y = ' + queen1[1] + '<br/> For Queen2 position: x = ' + queen2[0] + ' and y = ' + queen2[1] + '<br/>' + queens.canAttack() + '</div>');
    $('.answer-container').append(div);
}
// Get max function
let getMax = (object) => {
    return Object.keys(object).reduce((a, b) => {
        if (object[a] === object[b]) return "All names occur only once"
        else return object[a] > object[b] ? a : b
    })
}

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
QuestionOne = async () => {
    await getResponseData("battles.json").then((battles) => {
        let result = {
            'most_active': {
                'attacker_king': '',
                'defender_king': '',
                'region': '',
                'name': ''
            },
            'attacker_outcome': {
                'win': 0, // total win
                'loss': 0 // total loss
            },
            'battle_type': [], // unique battle types
            'defender_size': {
                'average': '',
                'min': Number.MAX_SAFE_INTEGER,
                'max': Number.MIN_SAFE_INTEGER
            }
        }

        let attacker_kings = {};
        let defender_kings = {};
        let regions = {};
        let names = {};
        let sum = 0;
        battles.forEach(battle => {
            attacker_kings[battle.attacker_king] = attacker_kings[battle.attacker_king] ?
                attacker_kings[battle.attacker_king] + 1 :
                1;
            defender_kings[battle.defender_king] = defender_kings[battle.defender_king] ?
                defender_kings[battle.defender_king] + 1 :
                1;
            regions[battle.region] = regions[battle.region] ?
                regions[battle.region] + 1 :
                1;
            names[battle.name] = names[battle.name] ?
                names[battle.name] + 1 :
                1;
            battle.attacker_outcome === "win" ? result.attacker_outcome.win += 1 : result.attacker_outcome.win
            battle.attacker_outcome === "loss" ? result.attacker_outcome.loss += 1 : result.attacker_outcome.loss
            if (!result.battle_type.includes(battle.battle_type)) {
                result.battle_type.push(battle.battle_type)
            }
            if (battle.defender_size) {
                sum += battle.defender_size
                result.defender_size.min = result.defender_size.min > battle.defender_size && battle.defender_size !== null ? battle.defender_size : result.defender_size.min
                result.defender_size.max = result.defender_size.max < battle.defender_size && battle.defender_size !== null ? battle.defender_size : result.defender_size.max
            }

        })
        result.most_active.attacker_king = getMax(attacker_kings)
        result.most_active.defender_king = getMax(defender_kings)
        result.most_active.region = getMax(regions)
        result.most_active.name = getMax(names)
        result.defender_size.average = Math.round(sum / battles.length)

        var div = $('<div> <br/> Answer for Question 1: <br/> <br/>' + JSON.stringify(result) + '</div>');
        $('.answer-container').append(div);
    }).catch((error) => {
        console.error(error)
    })
}

// Question 2
QuestionTwo = async () => {
    let result = []
    let query = $("#query").val()
    if (query.length !== 0) {
        const url = "https://api.github.com/search/repositories?q="
        await getResponseData(url + query).then(async (data) => {
            for (let item of data.items) {
                let owner = {
                    login: item.owner.login,
                }
                let numberOfBranch = ''
                await getResponseData(item.owner.url).then(async (ownerData) => {
                    owner.name = ownerData.name
                    owner.followersCount = ownerData.followers
                    owner.followingCount = ownerData.following
                }).catch((error) => {
                    console.log(error)
                })

                await getResponseData(item.branches_url.split("{")[0]).then(async (branchData) => {
                    numberOfBranch = branchData.length;
                }).catch((error) => {
                    console.log(error)
                })
                console.log(item)
                result.push({
                    name: item.name,
                    full_name: item.full_name,
                    private: item.private,
                    owner: owner,
                    license: item.license?.name || '',
                    score: item.score,
                    numberOfBranch: numberOfBranch
                })
            }

            var div = $('<div> <br/> Answer for Question 2: <br/> <br/>' + JSON.stringify(result) + '</div>');
            $('.answer-container').append(div);
        }).catch((error) => {
            console.error(error)
        })
    } else {
        var div = $('<div> <br/> Answer for Question 2: <br/> <br/> Query is empty </div>');
        $('.answer-container').append(div);
    }
}

// Question 3
QuestionThree = async () => {
    const url = "http://api.nobelprize.org/v1/prize.json"
    await getResponseData(url).then(async (data) => {
        let dataFilter = data.prizes.filter(prize => prize.year >= "2000" && prize.year <= "2019" && prize.category === "chemistry")
        let result = []
        dataFilter.forEach(data => {
            data.laureates.forEach(laureate => {
                result = result.concat(" " + laureate.firstname + " " + laureate.surname)
            })
        })
        var div = $('<div> <br/> Answer for Question 3: <br/> <br/>' + result + '</div>');
        $('.answer-container').append(div);
    }).catch((error) => {
        console.error(error)
    })
}
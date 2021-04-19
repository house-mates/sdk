const hSDK = require('../src/sdk.js')

hSDK.execute(
    hSDK.Find,
    hSDK.url('users')
).then(function(response) {

    for (const user of response.data.results) {
        console.log(user)
    }

})

hSDK.execute(
    hSDK.Create,
    hSDK.url('events'), {
        "action_id": 5,
        "time": "2019-04-18 11:29:21"
    }
).then(function(response) {

    console.log(response)

})

async function example() {
    const response = await hSDK.execute(hSDK.Find, hSDK.url('events'))

    console.log(response)
}

example()
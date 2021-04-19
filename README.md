### Housemates SDK

This repository contains a Node JS SDK for the [Housemates API](https://github.com/house-mates/api).

<br>

### [Documentation](https://housemates-sdk-docs.000webhostapp.com/index.html)

<br>

### Functions

| Function    | Argument    | Possible Values |
| ----------- | ----------- | -----------     |
| SDK.url     | route       | users, usermeta, actions, events, responses           |
| SDK.url   | option        | id, userID, actionID, range, range-actionID, eventID            |
| SDK.execute   | method        | POST, GET, PATCH, DELETE |

<br>

Example code:
```javascript
const hSDK = require('../src/sdk.js')

/**
 * @param method string
 * @param url string
 */
hSDK.execute(
    hSDK.Find, // "GET"
    hSDK.url('users') // "localhost:8080/users"
).then(function(response) {

    for (const user of response.data.results) {
        console.log(user)
    }

})

hSDK.execute(
    hSDK.Create, // "POST"
    hSDK.url('events'), // "localhost:8080/events"
    { // Request body
        "action_id": 5,
        "time": "2019-04-18 11:29:21"
    }
).then(function(response) {

    console.log(response)

})

async function example() {
    const response = await hSDK.execute(
        hSDK.Find, 
        hSDK.url('events')
    )

    console.log(response)
}

example()
```
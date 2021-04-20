const axios = require('axios')

/**
 * SDKCore - The core functions used by the SDK.
 * 
 * These functions should only be called
 * through the functions in the SDK class.
 */
class SDKCore {

    /**
     * @constructor
     */
    constructor() {
        this.baseUrl = 'http://localhost:8080/'

        this.error = ''
        this.previousErrors = []

        this.generate = {}

        this.lastGeneratedUrl = ''
        this.generatedUrls = []
    }

    /**
     * Generates a url
     * @param {string} route 
     * @param {string} option 
     * @param {int} argument 
     * @param {object} data 
     * @returns {string|boolean}
     */
    generateUrl(route, option = '', argument = 0, data = {}) {
        this.generate.data = data

        switch (route) {
            case 'users':
            case 'usermeta':
            case 'actions':
            case 'events':
            case 'responses':
                this.generate.route = route
                break;
            default:
                this.error = "generateUrl(): route is not a valid route"
                return false;
        }

        switch (option) {
            case 'id':
                this.generate.option = option
                break;
            case 'userID':
                switch (route) {
                    case 'usermeta':
                    case 'actions':
                    case 'responses':
                        this.generate.option = option
                        break;
                    default:
                        break;
                }
                break;
            case 'actionID':
            case 'range':
            case 'range-actionID':
                switch (route) {
                    case 'events':
                        this.generate.option = option
                        break;
                    default:
                        break;
                }
                break;
            case 'eventID':
                switch (route) {
                    case 'responses':
                        this.generate.option = option
                        break;
                    default:
                        break;
                }
                break;
            default:
                this.generate.option = 0
                break;
        }

        if (
            argument === 0 &&
            this.generate.option !== 0 &&
            this.generate.option !== 'range'
        ) {
            this.error = 'generateUrl(): An argument must be supplied for option: ' + this.generate.option
            return false
        }

        if (argument !== parseInt(argument, 10)) {
            this.error = "generateUrl(): argument must be an integer"
            return false
        }

        this.generate.argument = argument

        let builtUrl = this.baseUrl + this.generate.route

        switch (this.generate.option) {
            case 0:
                break;
            case 'id':
                builtUrl += '/' + this.generate.argument
                break;
            case 'userID':
                builtUrl += '_by_uid/' + this.generate.argument
                break;
            case 'actionID':
                builtUrl += '_by_aid/' + this.generate.argument
                break;
            case 'eventID':
                builtUrl += '_by_eid/' + this.generate.argument
                break;
            case 'range':
                builtUrl += '_by_range'
                break;
            case 'range-actionID':
                builtUrl += '_by_range_and_aid/' + this.generate.argument
                break;
        }

        if (this.lastGeneratedUrl !== '') {
            this.generatedUrls.push(this.lastGeneratedUrl)
        }
        this.lastGeneratedUrl = builtUrl

        return builtUrl
    }

    /**
     * Saves and then clears the current error
     */
    resetCurrentError() {
        this.previousErrors.push(this.error)
        this.error = ''
    }
}

/**
 * SDK
 */
class SDK {

    /**
     * @constructor
     */
    constructor() {
        this.core = new SDKCore()

        this.Create = "POST"
        this.Find = "GET"
        this.Edit = "PATCH"
        this.Delete = "DELETE"
    }

    /**
     * Generates a url
     * @param {string} route - Route group
     * @param {string} option - Search modifier (Optional)
     * @param {int} argument - Search variable (Optional)
     * @param {object} data - Object (Optional)
     * @returns {string|boolean}
     */
    url(route, option = '', argument = 0, data = {}) {
        let gen = this.core.generateUrl(route, option, argument, data)

        if (this.getLastError() !== '') {
            return this.getLastError()
        }

        this.core.resetCurrentError()

        return gen
    }

    /**
     * Executes a request to an endpoint
     * @param {string} method - HTTP Request Method
     * @param {string} url - URL
     * @param {object} data - Object (Optional)
     * @returns {object}
     */
    async execute(method, url, data = {}) {
        let config = {
            method: method,
            url: url,
        }

        if (data !== {}) {
            config.data = data
        }

        const response = await axios(config)
        if (response.hasOwnProperty('data')) {
            return response.data
        } else {
            return response
        }
    }

    /**
     * Changes the base url
     * @param {string} url 
     */
    changeBaseUrl(url) {
        if (!this.core.hasOwnProperty('initialBaseUrl')) {
            this.core.initialBaseUrl = this.core.baseUrl
        }
        this.core.baseUrl = url
    }

    /**
     * Resets the base url to it's initial value
     */
    reset() {
        if (!this.core.hasOwnProperty('initialBaseUrl')) {
            return
        }
        this.core.baseUrl = this.core.initialBaseUrl
    }

    /**
     * Gets the last error
     * @returns {string}
     */
    getLastError() {
        return this.core.error
    }

    /**
     * Gets the previous errors
     * @returns {string[]}
     */
    getPreviousErrors() {
        return this.core.previousErrors
    }

    /**
     * Gets all errors
     * @returns {string[]}
     */
    getAllErrors() {
        if (this.core.error !== '') {
            return [this.core.error, ...this.core.previousErrors]
        } else {
            return this.getPreviousErrors()
        }
    }

    /**
     * Gets the last generated url
     * @returns {string}
     */
    getLastGeneratedUrl() {
        return this.core.lastGeneratedUrl
    }

    /**
     * Gets the last generated urls
     * @returns {string[]}
     */
    getPreviousGeneratedUrls() {
        return this.core.generatedUrls
    }

    /**
     * Gets all the generated urls
     * @returns {string[]}
     */
    getAllGeneratedUrls() {
        if (this.core.lastGeneratedUrl !== '') {
            return [this.core.lastGeneratedUrl, ...this.core.generatedUrls]
        } else {
            return this.getPreviousGeneratedUrls()
        }
    }

}

// TODO: Create API
// class API {
//     constructor() {
//         this.SDK = new SDK();
//     }

//     getUsers() {
//         this.SDK.prepare('users').
//     }
// }

module.exports = new SDK();
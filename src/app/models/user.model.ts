export class UserModel {
    constructor(public email: string, private token: string, private expires: Date ) {}

    getToken() {
        return this.token;
    }

    getExpires() {
        return this.expires;
    }
}

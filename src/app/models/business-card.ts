export class BusinessCard {
    firstName = '';
    lastName = '';
    email: string;
    phoneNumber: string;
    extraText: string;
    imageUri: string;

    getKey() {
        // strips punctation as well
        return `${this.firstName}${this.lastName}`.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    }
}

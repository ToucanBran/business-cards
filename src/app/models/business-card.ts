export class BusinessCard {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    extraText: string;
    imageUri: string;

    // constructor(firstName: string, lastName: string, email: string,
    //     phoneNumber: string, extraText: string, imageUri: string) {
    //         this.firstName = firstName;
    //         this.lastName = lastName;
    //     }

    getKey() {
        // strips punctation as well
        return `${this.firstName}${this.lastName}`.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    }
}


/******************************************************************************
 * I got this code from here:
 * https://cloud.google.com/blog/products/ai-machine-learning/how-realtimecrm-built-a-business-card-reader-using-machine-learning
 **************************************************************************\
/**
* Parse matches from string and remove any line containing a match
*/
const removeByRegex = (str, regex) => {
    const matches = [];
    const cleanedText = str
        .split('\n')
        .filter(line => {
            const hits = line.match(regex);
            if (hits != null) {
                matches.push(hits[0]);
                return false;
            }
            return true;
        })
        .join('\n');
    return { matches, cleanedText };
};
// from http://emailregex.com
const emailRegex =
    /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
export const removeEmails = str => {
    const { matches, cleanedText } = removeByRegex(str, emailRegex);
    return { emails: matches, stringWithoutEmails: cleanedText };
};
// Regex taken from https://en.wikipedia.org/wiki/Postcodes_in_the_United_Kingdom#Validation
const postcodeRegex =
    /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})/i;
export const removePostcodes = str => {
    const { matches, cleanedText } = removeByRegex(str, postcodeRegex);
    return { postalCode: matches.map(s => s.toUpperCase()), stringWithoutPostalCode: cleanedText };
};

// Regex from https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
const phoneNumberRegex =
    /\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*/;
export const removePhoneNumbers = str => {
    const {matches, cleanedText } = removeByRegex(str, phoneNumberRegex);
    return {phoneNumbers: matches, stringWithoutPhoneNumbers: cleanedText };
};


import {AsyncStorage} from 'react-native';

class DataBaseAsync {
    static LOCALE = 'locale'

    constructor() {

    }

    async getLocale(onSuccess, onFailure) {
        try {
            const value = await AsyncStorage.getItem(DataBaseAsync.LOCALE);
            if (value !== null) {
              onSuccess(value)
            } else {
                onFailure()
            }
          } catch (error) {
              onFailure()
          }
    }

    async postLocale(locale, onSuccess, onFailure) {
        try {
            await AsyncStorage.setItem(DataBaseAsync.LOCALE, locale);
            onSuccess()
        } catch(error) {
            onFailure()
        }
    }

} 


export default DataBaseAsync
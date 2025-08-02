import { isValidFavoriteGroupName } from '../../src/utils/Utils';
import i18n from 'i18n-js'

i18n.t = jest.fn((key) => {
    const translations = {
        'screens.planex.editNamePopup.errorEmpty': 'Name cannot be empty',
        'screens.planex.editNamePopup.errorTooLong': 'Name is too long',
        'screens.planex.editNamePopup.errorInvalidChars': 'Name contains invalid characters',
    };
    return translations[key];
});

describe('isValidFavoriteGroupName', () => {
    test('name empty', () => {
        expect(() => isValidFavoriteGroupName('').toThrow('Name cannot be empty'));
        expect(() => isValidFavoriteGroupName('   ').toThrow('Name cannot be empty'))
    });

    test('name too long', () => {
        const longName = 'a'.repeat(75);
        expect(() => isValidFavoriteGroupName(longName).toThrow('Name is too long'));
    });

    test('name with invalid characters', () => {
        const invalidNames = [
            'Inv@lid','#','<','>','/','%','^','&','*','(',')','=','+','{','}','[',']','|','\\',
            ':',';','"',"'",',','.','?','/','💻','🚀','🎉','©','®','™','\u200B','\u200C','\u200D','\n','\t'
        ];
        invalidNames.forEach((name) => {
            expect(() => isValidFavoriteGroupName(name).toThrow('Name contains invalid characters'))
        })
    });

    test('valid names', () => {
        expect(() => isValidFavoriteGroupName('Name').not.toThrow());
        expect(() => isValidFavoriteGroupName('Name_without_space').not.toThrow());
        expect(() => isValidFavoriteGroupName('Name_w1th numb333rs ').not.toThrow());
        expect(() => isValidFavoriteGroupName('Nàme with accènts ').not.toThrow());
        expect(() => isValidFavoriteGroupName('a').not.toThrow());
        const notSoLongName = 'a'.repeat(74);
        expect(() => isValidFavoriteGroupName(notSoLongName).not.toThrow());
    });
})

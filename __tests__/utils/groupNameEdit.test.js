import { validateFavoriteGroupName } from '../../src/utils/Utils';
import i18n from 'i18n-js';

i18n.t = jest.fn((key) => {
  const translations = {
    'screens.planex.editNamePopup.errorEmpty': 'Name cannot be empty',
    'screens.planex.editNamePopup.errorTooLong': 'Name is too long',
    'screens.planex.editNamePopup.errorInvalidChars':
      'Name contains invalid characters',
  };
  return translations[key];
});

describe('validateFavoriteGroupName', () => {
  test('name empty', () => {
    expect(() => validateFavoriteGroupName('').toThrow('Name cannot be empty'));
    expect(() =>
      validateFavoriteGroupName('   ').toThrow('Name cannot be empty')
    );
  });

  test('name too long', () => {
    const longName = 'a'.repeat(75);
    expect(() =>
      validateFavoriteGroupName(longName).toThrow('Name is too long')
    );
  });

  test('name with invalid characters', () => {
    const invalidNames = [
      'Inv@lid',
      '#',
      '<',
      '>',
      '/',
      '%',
      '^',
      '&',
      '*',
      '(',
      ')',
      '=',
      '+',
      '{',
      '}',
      '[',
      ']',
      '|',
      '\\',
      ':',
      ';',
      '"',
      "'",
      ',',
      '.',
      '?',
      '/',
      '💻',
      '🚀',
      '🎉',
      '©',
      '®',
      '™',
      '\u200B',
      '\u200C',
      '\u200D',
      '\n',
      '\t',
    ];
    invalidNames.forEach((name) => {
      expect(() =>
        validateFavoriteGroupName(name).toThrow(
          'Name contains invalid characters'
        )
      );
    });
  });

  test('valid names', () => {
    expect(() => validateFavoriteGroupName('Name').not.toThrow());
    expect(() => validateFavoriteGroupName('Name_without_space').not.toThrow());
    expect(() =>
      validateFavoriteGroupName('Name_w1th numb333rs ').not.toThrow()
    );
    expect(() => validateFavoriteGroupName('Nàme with accènts ').not.toThrow());
    expect(() => validateFavoriteGroupName('a').not.toThrow());
    const notSoLongName = 'a'.repeat(74);
    expect(() => validateFavoriteGroupName(notSoLongName).not.toThrow());
  });
});

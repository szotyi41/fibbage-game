const Categories = required('../Categories');

const categories = new Categories();

test('Get random categories', () => {
    const categoriesToGuess = categories.getCategoriesForChoosing();
    expect(categoriesToGuess).toHaveLength(5);
});

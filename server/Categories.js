import Fact from './Fact.js';

class Categories {
    constructor() {
        this.categoriesNumberCanGuess = 5;
        this.getFactsCount();
    }

    // Get facts count once when instance created
    async getFactsCount() {
        const allFacts = await Fact.find({}).exec();
        this.factsCount = allFacts.length;

        console.log(
            this.factsCount,
            ' fact(s) queried successfully, database connection is estabilished'
        );
    }

    // Get categories for choosing
    async getCategoriesForChoosing() {
        let random,
            fact,
            category,
            categories = [];

        do {
            // Get fact, and category
            random = Math.floor(Math.random() * (this.factsCount / 2));
            fact = await Fact.findOne().sort({ use_times: 1 }).skip(random).exec();
            category = fact.category;

            // When category not added yet, push it
            if (!categories.includes(category)) {
                categories.push(category);
            }
        } while (categories.length < this.categoriesNumberCanGuess);

        return categories;
    }
}

export default Categories;

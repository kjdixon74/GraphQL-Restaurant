const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const express = require("express");

// Construct a schema, using GraphQL schema language
let restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
const schema = buildSchema(`
type Query {
  restaurant(id: Int): Restaurant
  restaurants: [Restaurant]
},
type Restaurant {
  id: Int
  name: String
  description: String
  dishes: [Dish]
}
type Dish {
  name: String
  price: Int
}
input RestaurantInput {
  name: String
  description: String
}
type DeleteResponse {
  ok: Boolean!
}
type Mutation {
  setRestaurant(input: RestaurantInput): Restaurant
  deleteRestaurant(id: Int!): DeleteResponse
  editRestaurant(id: Int!, name: String!): Restaurant
}
`);
// The root provides a resolver function for each API endpoint

const root = {
  restaurant: ({ id }) => {
    const getRest = restaurants.find((restaurant) => restaurant.id === id);
    if (getRest) {
      return getRest;
    } else {
      throw new Error("Restaurant doesn't exist");
    }
  },

  restaurants: () => restaurants,

  setRestaurant: ({ input }) => {
    restaurants.push({ name: input.name, description: input.description });
    return input;
  },

  deleteRestaurant: ({ id }) => {
    const deletedRest = restaurants.find((restaurant) => restaurant.id === id);
    const ok = deletedRest ? true : false;
    restaurants = restaurants.filter((restaurant) => restaurant.id !== id);
    console.log(JSON.stringify(deletedRest));
    return { ok };
  },

  editRestaurant: ({ id, name }) => {
    const editedRest = restaurants.find((restaurant) => restaurant.id === id);
    if (editedRest) {
      editedRest.name = name;
      return editedRest;
    } else {
      throw new Error("Restaurant doesn't exist");
    }
  },
};

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

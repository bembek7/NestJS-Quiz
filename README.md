<h1>Quiz app using NestJS and GraphQL</h1>

## Description
 It's the app providing few functionalities for a Quiz application. Such as :
  - creating the quiz with questions,
  - checking the answers sent,
  - getting the quiz and questions,
  - deleting the quiz.
  
  I decided that question should hold right answers as an actual answer string instead of 'abc' or '123', so that order of answers in response does not matter, and on the actual site the order of answers in questions could be randomized. For similar reason I grab the question ID in question response, so questions order can be randomized too. Apart from that I tried to keep everything simple and self-explanatory.
## Running the app

1. Clone the repository to your pc.
2. Go to the project root directory.
3. Change the `.env` information, so that it matches your database setup.
4. Run the command `npm install`
5. After installation is complete  run `npm run start`
6. Open the browser and go to `localhost:3000/graphql`. If you specified a different port number in the `.env` file, replace 3000 with that port number.
7. Test the project using queries and mutations examples that are provided in folder `queries mutation examples`.

## Test

To run unit test use the following command: `npm run test`

## Examples of GraphQL queries and mutations
Can be found in folder `queries mutation examples`:

[GetScore query](queries%20mutation%20examples/getScoreQuery.graphql)

[Getters query](queries%20mutation%20examples/getterQueries.graphql)

[Mutations](queries%20mutation%20examples/mutations.graphql)

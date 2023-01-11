## Hackernews Clone Site with GraphQL

This is a [Hackernews](https://news.ycombinator.com/) clone site built with next.js implementing GraphQL APIs, for which Apollo Client is adopted in the frontend and Apollo Server in the backend server. We can successfully build a full functionality of GraphQL server with next.js, including queries, mutations, and subscriptions.
           
The real-time communication of subscriptions however was found not to function well once the package is deployed to Vercel, which is a serverless platform. Therefore real-time [Firebase Cloud Firestore](https://firebase.google.com/products/firestore) is used to substitute GraphQL subscriptions.

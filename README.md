## Hackernews Clone Site with GraphQL

This is a [Hackernews](https://news.ycombinator.com/) clone site built with next.js implementing GraphQL APIs, for which Apollo Client is adopted in the frontend and Apollo Server in the backend server. We can successfully build a full functionality of GraphQL server with next.js, including queries, mutations, and subscriptions.
           
The real-time communication of subscriptions however was found not to function well once the package is deployed to Vercel, which is a serverless platform. Therefore real-time [Firebase Cloud Firestore](https://firebase.google.com/products/firestore) is used to substitute GraphQL subscriptions.

**iOS** and **Android** mobile apps are also delivered. The apps are developed with **React Native**, anyone who is interested can test the apps through the [Expo Publish Link](https://expo.dev/@jglchen/hackernews-apollo) with [Expo Go](https://expo.dev/client) app. 

### [View the App](https://hackernews-nextjs-apollo.vercel.app)
### [App GitHub](https://github.com/jglchen/hackernews-nextjs-apollo)
### Docker: docker run -p 3000:3000 jglchen/hackernews-nextjs-apollo
### [React Native Expo Publish](https://expo.dev/@jglchen/hackernews-apollo)
### [React Native GitHub](https://github.com/jglchen/react-native-hackernews-apollo)

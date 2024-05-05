---
#
# By default, content added below the "---" mark will appear in the home page
# between the top bar and the list of recent posts.
# To change the home page layout, edit the _layouts/home.html file.
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
#
layout: home
---

This is a [Hackernews](https://news.ycombinator.com/) clone site built with next.js implementing GraphQL APIs, for which Apollo Client is adopted in the frontend and Apollo Server in the backend server. We can successfully build a full functionality of GraphQL server with next.js, including queries, mutations, and subscriptions.
           
The real-time communication of subscriptions however was found not to function well once the package is deployed to Vercel, which is a serverless platform. Therefore real-time [Firebase Cloud Firestore](https://firebase.google.com/products/firestore) is used to substitute GraphQL subscriptions.

[![hackernews-nextjs-apollo-screenshot](/images/hackernews-nextjs-apollo-screenshot.png)](https://hackernews-nextjs-apollo.vercel.app)

**iOS** and **Android** mobile apps are also delivered. The apps are developed with **React Native**, anyone who is interested can test the development builds with [iOS Simulator Build](https://expo.dev/accounts/jglchen/projects/hackernews-apollo/builds/b6aa3b39-e2ec-48cd-89f5-14028feff519) and [Android Internal Distribution Build](https://expo.dev/accounts/jglchen/projects/hackernews-apollo/builds/5b979dee-6874-48a8-ade1-231a750eca9c). If the build storage link has expired, please go to [https://projects-jglchen.vercel.app/en/contact](https://projects-jglchen.vercel.app/en/contact) to request build files.


### [View the App](https://hackernews-nextjs-apollo.vercel.app)
### [App GitHub](https://github.com/jglchen/hackernews-nextjs-apollo)
### Docker: docker run -p 3000:3000 jglchen/hackernews-nextjs-apollo
### [iOS Simulator Build](https://expo.dev/accounts/jglchen/projects/hackernews-apollo/builds/b6aa3b39-e2ec-48cd-89f5-14028feff519)
### [Android Internal Distribution Build](https://expo.dev/accounts/jglchen/projects/hackernews-apollo/builds/5b979dee-6874-48a8-ade1-231a750eca9c)
### [React Native GitHub](https://github.com/jglchen/react-native-hackernews-apollo)
### back To [Series Home](https://jglchen.github.io/)

{% include giscus.html %}

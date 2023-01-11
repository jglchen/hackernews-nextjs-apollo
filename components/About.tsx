import * as React from 'react';
import { useEffect } from "react";
import  secureLocalStorage  from  "react-secure-storage";
import { TEMP_TOKEN } from '@/lib/constants';

const About = () => {
    useEffect(()=> {
        secureLocalStorage.removeItem(TEMP_TOKEN);
    },[]);
    
    return (
        <div className="pv2 ph0">
           This is a <a className="blue" href="https://news.ycombinator.com/" target="_blank" rel="noreferrer">Hackernews</a> clone site built with next.js implementing GraphQL APIs, for which Apollo Client is adopted in the frontend and Apollo Server in the backend server. We can successfully build a full functionality of GraphQL server with next.js, including queries, mutations, and subscriptions.
           The real-time communication of subscriptions however was found not to function well once the package is deployed to Vercel, which is a serverless platform. Therefore real-time <a className="blue" href="https://firebase.google.com/products/firestore" target="_blank"  rel="noreferrer">Firebase Cloud Firestore</a> is used to substitute GraphQL subscriptions.
        </div>
    );
}; 

export default About;
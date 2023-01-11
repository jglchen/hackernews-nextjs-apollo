import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import  secureLocalStorage  from  "react-secure-storage";
import { AUTH_TOKEN, TEMP_TOKEN } from './constants';

const authLink = setContext(async (_, { headers }) => {
    const token = secureLocalStorage.getItem(AUTH_TOKEN) || secureLocalStorage.getItem(TEMP_TOKEN);
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    };
});

const httpLink = new HttpLink({
  uri: '/api/graphql'
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;

  
//firestore does not support full-text search. We have to set up third party search service 
//like Algolia(https://www.algolia.com/developers/firebase-search-extension/) to implement full
//text search. For this demonstration, we use an impractical solution in production as 
//downloading an entire collection to search for fields client-side.
import * as React from 'react';
import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import client from '@/lib/apllo-client';
import  secureLocalStorage  from  "react-secure-storage";
import db from '@/lib/firestore';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Link from './Link';
import {FeedData, VoteDataType, LinkType, FeedQueryParms, Vote } from '@/lib/types';
import { TEMP_TOKEN } from '@/lib/constants';
import loaderStyles from '@/styles/loader.module.css';

const Search = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const [searchResult, setSearchResult] = useState<LinkType[]>([]);
  const [data, setData] = useState<FeedData | null>(null);
  const [inLoading, setInLoading] = useState(false);
  
  useEffect(()=> {
    secureLocalStorage.removeItem(TEMP_TOKEN);
  },[]);
  
  useEffect(() => {
    if (data){
      const q = query(collection(db, "graphql", "hackernews", "recent"), where("key", "==", "newvote"), where("publiccode", "==", process.env.NEXT_PUBLIC_PUBLIC_CODE));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const docItem = doc.data() as VoteDataType;
          delete docItem.publiccode;
          //delete docItem.createdAt;
          delete docItem.key;
          voteDataUpdate(docItem);
          voteSearchResultUpdate(docItem);
          voteCacheUpdate(docItem);
        });
      });
  
      return () => {
        unsubscribe();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
 },[data, searchResult]);

 const voteDataUpdate = (newVote: VoteDataType) => {
  if (!data){
    return;
  }
  const { linkId, userId }  = newVote;
  const linkDataIndex = data.feed.links.findIndex(({id}) => id === linkId);
  if (linkDataIndex < 0){
     return;
  }
  const linkData =  data!.feed.links[linkDataIndex];  
  const exists = linkData.votes?.find(
    ({ id }) => id === newVote.id
  );
  if (exists){
     return;
  }

  const voteData = {
     __typename: 'Vote', 
     id: newVote.id,
     user: {
        __typename: 'User',
        id: userId
     }
  };
  const newVotes = [...(linkData.votes || []), voteData];
  const newLink = {...linkData, votes: newVotes};
  const links = [];
  for (let link of data!.feed.links) {
     links.push(link);
  } 
  links[linkDataIndex] = newLink;
  const newFeed = {...data!.feed, links: links};
  const newData = {...data, feed: newFeed};
  setData(newData);
}
 
const voteSearchResultUpdate = (newVote: VoteDataType) => {
  const { linkId, userId }  = newVote;
  const linkDataIndex = searchResult.findIndex(({id}) => id === linkId);
  if (linkDataIndex < 0){
     return;
  }
  const linkData =  searchResult[linkDataIndex];  
  const exists = linkData.votes?.find(
    ({ id }) => id === newVote.id
  );
  if (exists){
     return;
  }

  const voteData = {
     __typename: 'Vote', 
     id: newVote.id,
     user: {
        __typename: 'User',
        id: userId
     }
  };
  
  const newVotes = [...(linkData.votes || []), voteData];
  const newLink = {...linkData, votes: newVotes};
  const links = [];
  for (let link of searchResult) {
     links.push(link);
  } 
  links[linkDataIndex] = newLink;
  setSearchResult(links);
}

async function voteCacheUpdate(newVote: VoteDataType) {
  const { linkId, userId }  = newVote;
  const linkData = client.readFragment({
    id: `Link:${linkId}`,
    fragment: gql`
       fragment MyLink on Link {
          id
          votes {
            id
            user {
              id
            }
          }
       }
    `,   
  });
  if (!linkData){
     return;
  }
  const exists = (linkData.votes as Vote[]).find(
    ({ id }) => id === newVote.id
  );
  if (exists){
     return;
  }
  
  const voteData = {
     __typename: 'Vote', 
     id: newVote.id,
     user: {
        id: userId
     }
  };
  
  client.writeFragment({
    id: `Link:${linkId}`,
    fragment: gql`
     fragment LinkForVotes on Link {
        votes {
         id
         user {
           id
         }
       }
     }
    `,
    data: {
      votes: [...linkData.votes, voteData],
    },
  });
}  

async function sendQuery(){
    if (!searchFilter){
       setSearchResult([]); 
       return;
    }
    
    if (!data){
       try {
        setInLoading(true);
        const result = await client.query({
             query: gql`
               query FeedQuery {
                 feed(take: 100, skip: 0, orderBy: {createdAt: desc}) {
                   id
                   links {
                     id
                     createdAt
                     url
                     description
                     postedBy {
                       id
                       name
                     }
                     votes {
                       id
                       user {
                         id
                       }
                     }
                   }
                   count
                 }
               }
             `
          });
          //console.log(result);
          setData(result.data);

          const links = result.data.feed.links.filter((item: LinkType) => 
             item.url.includes(searchFilter) || item.description.includes(searchFilter)
          );
          setSearchResult(links);
       }catch(err){
          //.....
       }
       setInLoading(false);
       return;
    }

    const links = data.feed.links.filter((item) => 
       item.url.includes(searchFilter) || item.description.includes(searchFilter)
    );
    setSearchResult(links);
 }

 return (
  <>
    <div>
      Search
      <input
        type="text"
        onChange={(e) => setSearchFilter(e.target.value)}
      />
      <button
        onClick={() => {
          sendQuery();
        }}
      >
        OK
      </button>
    </div>
    {
      searchResult.map((link, index) => (
        <Link key={link.id} link={link} index={index} />
      ))
    }
    {inLoading &&
      <div className={loaderStyles.loadermodal}>
        <div className={`${loaderStyles.loader} ${loaderStyles.div_on_center}`} />
      </div>
    }
   </>
 );
};

export default Search;


//firestore does not support full-text search. We have to set up third party search service 
//like Algolia(https://www.algolia.com/developers/firebase-search-extension/) to implement full
//text search. For this demonstration, we use an impractical solution in production as 
//downloading an entire collection to search for fields client-side.
/*
import { useState, useEffect } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import Link from './Link';
import { FEED_QUERY } from './LinkList';
*/

/*
const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      id
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`;

const Search = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const [executeSearch, { data }] = useLazyQuery(
    FEED_SEARCH_QUERY
  );
  
  return (
    <>
      <div>
        Search
        <input
          type="text"
          onChange={(e) => setSearchFilter(e.target.value)}
        />
        <button
          onClick={() =>
            executeSearch({
              variables: { filter: searchFilter }
            })
          }
        >
          OK
        </button>
      </div>
      {data &&
        data.feed.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
    </>
  );
};

export default Search;
*/

/*
export const FEED_QUERY = gql`
  query FeedQuery(
    $take: Int
    $skip: Int
    $orderBy: LinkOrderByInput
  ) {
    feed(take: $take, skip: $skip, orderBy: $orderBy) {
      id
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`;
*/

/*
const Search = () => {
  const [searchFilter, setSearchFilter] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const skip = 0;
  const take = 100;
  const orderBy = { createdAt: 'desc' };
  const [executeSearch, { data }] = useLazyQuery(
    FEED_QUERY
  );

  useEffect(() => {
    if (!searchFilter || !data){
       setSearchResult([]); 
       return;
    }

    const links = data.feed.links.filter((item) => 
       item.url.includes(searchFilter) || item.description.includes(searchFilter)
    );
    setSearchResult(links);
  },[data,searchFilter]);
  
  return (
    <>
      <div>
        Search
        <input
          type="text"
          onChange={(e) => setSearchFilter(e.target.value)}
        />
        <button
          onClick={() => {
              executeSearch({
                 variables: { skip, take, orderBy }
              })
          }}
        >
          OK
        </button>
      </div>
      {searchResult.map((link, index) => (
          <Link key={link.id} link={link} index={index} />))
      }
    </>
  );

};

export default Search;
*/

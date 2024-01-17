import { useRef ,useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import { fetchEvents } from '../../util/http';
import LoadingIndicator from '../UI/LoadingIndicator';
import ErrorBlock from '../UI/ErrorBlock';
import EventItem from './EventItem';
export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm,setSearchTerm] = useState();
  
  /*
  ? signal --
  TanStack Query provides each query function with an AbortSignal instance. 
  When a query becomes out-of-date or inactive, this signal will become aborted. 
  This means that all queries are cancellable, and you can respond to the cancellation
   inside your query function if desired. The best part about this is that it allows you to 
   continue to use normal async/await syntax while getting all the benefits of automatic 
   cancellation.
  */
 /*
 ? enabled --
 enable if the query will run or not
 */
//* --The query by default will run every time the state of searchTerm changes.
  const {data, isLoading,isError,error} = useQuery({
    queryKey:['elements',{search:searchTerm}],// add one more key to not mix with the results of NewEventsSection
    queryFn:({signal})=> fetchEvents({signal, searchTerm}),
    enabled: searchTerm !== undefined // -- will only run if searchTerm has a value
  });

  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  let content =  <p>Please enter a search term and to find events.</p>;

  if(isLoading) content = <LoadingIndicator/>;

  if(isError) content = <ErrorBlock title="An error occurred" message={error.message}/>;
 
  if(data){
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
     {content}
    </section>
  );
}

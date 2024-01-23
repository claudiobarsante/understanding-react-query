import {useQuery} from '@tanstack/react-query';

import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import { fetchEvents } from '../../util/http.js';

export default function NewEventsSection() {
  const NUMBER_OF_LATEST_EVENTS = 3;

  const {data,isPending, isError,error}= useQuery({
    queryKey:['events', {max:NUMBER_OF_LATEST_EVENTS}],
    queryFn:({signal,queryKey})=> fetchEvents({signal, ...queryKey[1]}),
    // -- it's the same of the line above ☝️- queryFn:({signal,queryKey})=> fetchEvents({signal, max:NUMBER_OF_LATEST_EVENTS}),
    staleTime:5000 // -- mileseconds
    //? gcTime: this controls how log the cache in data will be kept around, default i 5min
  });



  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock title="An error occurred" message={error.message}/>
    );
  }

  if (data) {
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
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}

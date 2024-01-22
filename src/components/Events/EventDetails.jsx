import { Link, Outlet,useNavigate } from 'react-router-dom';
import { useQuery, useMutation} from '@tanstack/react-query';
import Header from '../Header.jsx';
import { fetchEvent,deleteEvent } from '../../util/http.js';
import { useParams } from 'react-router-dom';
import { formatDate } from '../../util/format.js';
import ErrorBlock from './../UI/ErrorBlock';
import { queryClient } from '../../util/http.js';
export default function EventDetails() {
  let { id } = useParams();
  const navigate = useNavigate();

  const {data,isPending,isError,error} = useQuery({
    queryKey:['events',id],
    queryFn:({signal})=> fetchEvent({id,signal})
  });

  const {mutate,isPending:isPendingMutate,isError:isErrorMutate,error:errorMutate} = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['events']}); // -- tells reacquery that all querys that includes queryKey:['events'] are stale, so they need to be refetched. The events will be refetched in the section 'Recently added  events' for example
      navigate('/events');
    }
  });

  const handleDelete = ()=> {
    
    mutate({id});
  } 

  let content;
  
  if(isPending) {
    content = (<div id="event-details-content" className="center">
    <p>Fetching event data...</p>
    </div>)
  }
 
  if(isError){
    content = (<div id="event-details-content" className="center">
    <ErrorBlock title="Failed to fecth an event" message={error.message} />
    </div>)
  }

  if(data){
    const {title,image,location,date,time,description} = data;
    const formattedDate = formatDate(date);

    content = (
      <article id="event-details">
      <header>
        <h1>{title}</h1>
        <nav>
          <button onClick={()=> handleDelete()}>Delete</button>
          <Link to="edit">Edit</Link>
        </nav>
      </header>
      <div id="event-details-content">
        <img src={`http://localhost:3000/${image}`} alt={image} />
        <div id="event-details-info">
          <div>
            <p id="event-details-location">{location}</p>
            <time dateTime={`Todo-DateT$Todo-Time`}>{`${formattedDate} @ ${time}` }</time>
          </div>
          <p id="event-details-description">{description}</p>
        </div>
      </div>
    </article>

    );
  }
  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {content}
   
  
  {isErrorMutate && <ErrorBlock title="Failed to delete an event" message={errorMutate.message}/>}
    </>
  );
}

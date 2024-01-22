import {useState} from 'react';
import { Link, Outlet,useNavigate } from 'react-router-dom';
import { useQuery, useMutation} from '@tanstack/react-query';
import Header from '../Header.jsx';
import { fetchEvent,deleteEvent } from '../../util/http.js';
import { useParams } from 'react-router-dom';
import { formatDate } from '../../util/format.js';
import ErrorBlock from './../UI/ErrorBlock';
import { queryClient } from '../../util/http.js';
import Modal from './../UI/Modal';

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);
  let { id } = useParams();
  const navigate = useNavigate();

  const {data,isPending,isError,error} = useQuery({
    queryKey:['events',id],
    queryFn:({signal})=> fetchEvent({id,signal})
  });

  const {mutate,isPending:isPendingDeletion,isError:isErrorDeleting,error:deleteError} = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['events'],
       refetchType: 'none'}); //--If you do not want active queries to refetch, and simply be marked as invalid, you can use the refetchType: 'none' option.
      navigate('/events');
    }
  });

  const handleStartDelete = ()=> setIsDeleting(true);
  const handleStopDelete = ()=> setIsDeleting(false);

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
          <button onClick={handleStartDelete}>Delete</button>
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
    {isDeleting && <Modal onClose={handleStopDelete}>
    <h2>Are you sure?</h2>
    <p>Dou you really want to delete this event? This action cannot be undone.</p>
    <div className="form-actions">
    {isPendingDeletion && <p>Deleting, please wait...</p>}
    {!isPendingDeletion && (
      <>
      <button onClick={handleStopDelete} className="button-text">Cancel</button>
      <button onClick={handleDelete} className="button">Delete</button>
      </>
    )}
    </div>
    {isErrorDeleting && <ErrorBlock title="Failed to delete an event" message={deleteError.message} />}
    </Modal>}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {content}
   
  
  
    </>
  );
}

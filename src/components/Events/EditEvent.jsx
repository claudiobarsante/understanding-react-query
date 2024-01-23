import { Link, useNavigate, useParams} from 'react-router-dom';
import {useQuery,useMutation} from '@tanstack/react-query';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent, updateEvent, queryClient } from '../../util/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from './../UI/ErrorBlock';

export default function EditEvent() {
  const navigate = useNavigate();
  const {id} = useParams();
  

  const {data,isPending,isError,error} = useQuery({
    queryKey:['events',id],
    queryFn:({signal})=> fetchEvent({id,signal})
  })

  // -- optmistic update
  const {mutate} = useMutation({
    mutationFn: updateEvent,
    // -- onMutate will be executed right when 'mutate'is called, before this process is done or get a response
    // -- will update the cache
    onMutate:async (data)=> {
      const updatedEvent = data.event; //the updated event that was send it to the backend
     // Snapshot the previous value
      const previousEvent = queryClient.getQueryData(['events',id]);// give us the currently stored data
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update) 
      await queryClient.cancelQueries({queryKey:['events',id]}); //-- cancel on going querys to not clash with the results of the updated cache
      // Optimistically update to the new value
      queryClient.setQueryData(['events',id], updatedEvent); // -- manipulate the cache data
      // Return a context object with the snapshotted value
      return {previousEvent}; 
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError:(error,data,context)=>{
      queryClient.setQueryData(['events',id], context.previousEvent); //-- to be stored int the context property
    },
    // Always refetch after error or success:
    // You make sure you fetch the latest data from the server
    onSettled:()=> {
      queryClient.invalidateQueries({queryKey:['events',id]});
    }

  });

  let content;

  if(isPending){
    content = <div className='center'>
    <LoadingIndicator/>
    </div>
  }

  if(isError){
    content = <div>
    <ErrorBlock title="Failed to load an event" message={error.message} />
    <div className= "form-actions">
    <Link to ="../" className='button'>Okay</Link>
    </div>
    </div>
  }

  if(data){
   content = (
    <EventForm inputData={data} onSubmit={handleSubmit}>
    <Link to="../" className="button-text">
      Cancel
    </Link>
    <button type="submit" className="button">
      Update
    </button>
  </EventForm>)

  }

  function handleSubmit(formData) {
    mutate({id,event:formData});
    navigate('../');
  }

  function handleClose() {
    navigate('../');
  }

  return (
    <Modal onClose={handleClose}>
     {content}
    </Modal>
  );
}

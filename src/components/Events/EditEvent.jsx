import { Link, useNavigate, useParams} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent } from '../../util/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from './../UI/ErrorBlock';

export default function EditEvent() {
  const navigate = useNavigate();
  const {id} = useParams();
  

  const {data,isPending,isError,error} = useQuery({
    queryKey:['events',id],
    queryFn:({signal})=> fetchEvent({id,signal})
  })

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

  function handleSubmit(formData) {}

  function handleClose() {
    navigate('../');
  }

  return (
    <Modal onClose={handleClose}>
     {content}
    </Modal>
  );
}

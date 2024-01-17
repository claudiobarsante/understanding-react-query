import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { createNewEvent } from '../../util/http.js';
import ErrorBlock from './../UI/ErrorBlock';
import { queryClient } from '../../util/http.js';

export default function NewEvent() {
  const navigate = useNavigate();

  const {mutate, isPending,isError,error} = useMutation({
    mutationFn: createNewEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['events']}); // -- tells reacquery that all querys that includes queryKey:['events'] are stale, so they need to be refetched. The events will be refetched in the section 'Recently added  events' for example
      navigate('/events');
    }
  })

  function handleSubmit(formData) {
    mutate({event:formData});
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && 'Submitting...'}
        {!isPending && (<>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Create
          </button>
        </>)}        
      </EventForm>
      {isError && <ErrorBlock title="Failed to create an event" message={error.message} />}
    </Modal>
  );
}

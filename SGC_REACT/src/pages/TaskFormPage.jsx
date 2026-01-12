import {useForm} from 'react-hook-form'
import {createTask, } from '../api/tasks.api'
import {useNavigate, useParams} from 'react-router-dom'


export function TaskFormPage() {

  const {register, handleSubmit, formState: {errors}} = useForm()
  const navigate = useNavigate()
  const params = useParams()
  console.log(params)

  const onsubmit = handleSubmit(async data => {
   await createTask(data);
  navigate("/tasks");
  })

    return (
      <div>
        <form onSubmit={onsubmit}>
          <input type="text" placeholder="title" 
          {...register("title", {required: true })}
          />
          {errors.title && <span>this field is required</span>}
          <textarea row="3" placeholder="Description"
          {...register("description", {required: true })}
          ></textarea>
          {errors.description && <span>this field is required</span>}
          <button>save</button>
        </form>

        <button>
          Delete
        </button>
       
      </div>
    );
  }
  
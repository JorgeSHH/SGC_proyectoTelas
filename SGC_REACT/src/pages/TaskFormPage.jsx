import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { createTask, deleteTask, updateTask, getTask } from "../api/tasks.api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

export function TaskFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const navigate = useNavigate();
  const params = useParams();
  // console.log(params)

  const onsubmit = handleSubmit(async (data) => {
    if (params.id) {
      await updateTask(params.id, data);
      toast.success("tarea actualizada", {
        position: "bottom-right",
        style: {
          background: "#101010",
          color: "#fff",
        },
      });
    } else {
      await createTask(data);
      toast.success("tarea creada", {
        position: "bottom-right",
        style: {
          background: "#101010",
          color: "#fff",
        },
      });
    }

    navigate("/tasks");
    //  await createTask(data);
    navigate("/tasks");
  });

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const {
          data: { title, description },
        } = await getTask(params.id);
        setValue("title", title);
        setValue("description", description);
      }
    }
    loadTask();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <form
        onSubmit={onsubmit}
        className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
      >
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Título
        </label>
        <input
          type="text"
          placeholder="Title"
          className="w-full px-4 py-2 mb-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          {...register("title", { required: true })}
        />
        {errors.title && (
          <span className="text-red-500 text-sm mb-2 block">
            Este campo es obligatorio
          </span>
        )}
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          Descripción
        </label>
        <textarea
          rows="3"
          placeholder="Description"
          className="w-full px-4 py-2 mb-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          {...register("description", { required: true })}
        ></textarea>
        {errors.description && (
          <span className="text-red-500 text-sm mb-2 block">
            Este campo es obligatorio
          </span>
        )}
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition">
          Guardar
        </button>
      </form>

      {params.id && (
        <div className="max-w-md mx-auto mt-4">
          <button
            onClick={async () => {
              const accepted = window.confirm(
                "are you sure you want to delete it?"
              );
              if (accepted) {
                await deleteTask(params.id);
                toast.success("tarea eliminada", {
                  position: "bottom-right",
                  style: {
                    background: "#101010",
                    color: "#fff",
                  },
                });
                navigate("/tasks");
              }
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import {
  TASK_STATUS_CLASS_MAP,
  TASK_STATUS_TEXT_MAP,
  TASK_PRIORITY_CLASS_MAP,
  TASK_PRIORITY_TEXT_MAP,
} from "@/constants.jsx";
import { Link, router } from "@inertiajs/react";

export default function TasksTable({
  tasks,
  success,
  queryParams = null,
  hideProjectColumn = false,
  users,
}) {
  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }

    router.get(route("task.index", queryParams));
  };

  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;
    searchFieldChanged(name, e.target.value);
  };

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === "asc") {
        queryParams.sort_direction = "desc";
      } else {
        queryParams.sort_direction = "asc";
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = "asc";
    }

    router.get(route("task.index", queryParams));
  };

  const deleteTask = (task) => {
    if (!window.confirm(`Подтвердите удаление проекта "${task.name}"`)) {
      return;
    }
    router.delete(route("task.destroy", task.id));
  };

  return (
    <>
      {success && (
        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
          {success}
        </div>
      )}
      <div className="overflow-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
            <tr className="text-nowrap text-center">
              <TableHeading
                name={"id"}
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                ID
              </TableHeading>
              {!hideProjectColumn && <th className="px-3 py-2">Проект</th>}
              <TableHeading
                name={"name"}
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Название задачи
              </TableHeading>
              <TableHeading
                name={"status"}
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Статус
              </TableHeading>
              <TableHeading
                name={"priority"}
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Приоритет
              </TableHeading>
              <TableHeading
                name={"assigned_user_id"}
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Назначена
              </TableHeading>
              <TableHeading
                name={"created_at"}
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Дата создания
              </TableHeading>
              <TableHeading
                name={"due_date"}
                sort_field={queryParams.sort_field}
                sort_direction={queryParams.sort_direction}
                sortChanged={sortChanged}
              >
                Срок
              </TableHeading>
              <th className="px-3 py-2">Создатель</th>
              <th className="px-3 py-2">Обновлено</th>
              <th className="px-3 py-2">Действия</th>
            </tr>
          </thead>
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
            <tr className="text-nowrap text-center">
              <th className="px-3 py-2"></th>
              {!hideProjectColumn && <th className="px-3 py-2"></th>}
              <th className="px-3 py-2">
                <TextInput
                  className="w-full text-xs"
                  defaultValue={queryParams.name}
                  placeholder="...задача"
                  onBlur={(e) => searchFieldChanged("name", e.target.value)}
                  onKeyPress={(e) => onKeyPress("name", e)}
                />
              </th>
              <th className="px-3 py-2 text-nowrap">
                <SelectInput
                  className="w-full text-xs"
                  defaultValue={queryParams.status}
                  onChange={(e) => searchFieldChanged("status", e.target.value)}
                >
                  <option value="">выбрать</option>
                  <option className="required:text-white" value="new">новая</option>
                  <option value="pending">в ожидании</option>
                  <option value="in_progress">в процессе</option>
                  <option value="completed">завершена</option>
                  <option value="canceled">отменена</option>
                </SelectInput>
              </th>
              <th className="px-3 py-2">
                <SelectInput
                  className="w-full text-xs"
                  defaultValue={queryParams.priority}
                  onChange={(e) =>
                    searchFieldChanged("priority", e.target.value)
                  }
                >
                  <option className="text-gray-500" value="">выбрать</option>
                  <option value="low">низкий</option>
                  <option value="medium">средний</option>
                  <option value="high">высокий</option>
                </SelectInput>
              </th>
              <th className="px-3 py-2"></th>
              <th className="px-3 py-2"></th>
              <th className="px-3 py-2"></th>
              <th className="px-3 py-2"></th>
              <th className="px-3 py-2"></th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {tasks.data.map((task) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={task.id}
              >
                <td className="px-3 py-2">{task.id}</td>
                {!hideProjectColumn && (
                  <td className="px-3 py-3 hover:text-white">
                    <Link href={route("project.show", task.project_id)}>
                      {task.project.name}
                    </Link>
                  </td>
                )}
                <td className="px-3 py-3 hover:text-white">
                  <Link href={route("task.show", task.id)}>{task.name}</Link>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={
                      "px-2 py-1 rounded text-white text-nowrap " +
                      TASK_STATUS_CLASS_MAP[task.status]
                    }
                  >
                    {TASK_STATUS_TEXT_MAP[task.status]}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={
                      "px-2 py-1 rounded text-white text-nowrap " +
                      TASK_PRIORITY_CLASS_MAP[task.priority]
                    }
                  >
                    {TASK_PRIORITY_TEXT_MAP[task.priority]}
                  </span>
                </td>
                <td className="px-3 py-3 text-nowrap">
                  {task.assignedUser.name}
                </td>
                <td className="px-3 py-3 text-nowrap">{task.created_at}</td>
                <td className="px-3 py-3 text-nowrap">{task.due_date}</td>
                <td className="px-3 py-3">{task.createdBy.name}</td>
                <td className="px-3 py-3">{task.updatedBy.name}</td>
                <td className="px-3 py-3">
                  <div className="flex">
                    <Link
                      href={route("task.edit", task.id)}
                      className="block font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                      </svg>
                    </Link>
                    <button
                      onClick={(event) => deleteTask(task)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination links={tasks.meta.links} />
    </>
  );
}

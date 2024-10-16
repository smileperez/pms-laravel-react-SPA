import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants.jsx";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";

export default function index({ auth, projects, queryParams = null, success }) {

  queryParams = queryParams || {};

  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value
    } else {
      delete queryParams[name]
    }

    router.get(route('project.index', queryParams));
  }

  const onKeyPress = (name, e) => {
    if (e.key !== 'Enter') return;
    searchFieldChanged(name, e.target.value);
  }

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === 'asc') {
        queryParams.sort_direction = 'desc';
      } else {
        queryParams.sort_direction = 'asc';
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = 'asc';
    }

    router.get(route('project.index', queryParams));
  };

  const deleteProject = (project) => {
    if (!window.confirm(`Подтвердите удаление проекта "${project.name}"`)) {
      return;
    }
    router.delete(route('project.destroy', project.id))
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Проекты
          </h2>
          <Link
            href={route("project.create")}
            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
            Добавить проект
          </Link>
        </div>
      }
    >
      <Head title="Проекты" />

      <div className="py-12">
        <div className="max-w-[1400px] mx-auto sm:px-6 lg:px-8">

          {success && (
            <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
              {success}
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
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
                      <th className="px-3 py-2">Аватар</th>
                      <TableHeading
                        name={"name"}
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Название
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
                        Дата окончания
                      </TableHeading>
                      <th className="px-3 py-2">Создано</th>
                      <th className="px-3 py-2">Обновлено</th>
                      <th className="px-3 py-2">Действия</th>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap text-center">
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2">
                        <TextInput
                          className="w-full text-xs"
                          defaultValue={queryParams.name}
                          placeholder="...Проект"
                          onBlur={e => searchFieldChanged('name', e.target.value)}
                          onKeyPress={e => onKeyPress('name', e)}
                        />
                      </th>
                      <th className="px-3 py-2">
                        <SelectInput
                          className="w-full text-xs min-w-24"
                          defaultValue={queryParams.status}
                          onChange={e => searchFieldChanged('status', e.target.value)}
                        >
                          <option className="text-gray-300" value="">Выбрать</option>
                          <option value="new">Новый</option>
                          <option value="pending">Отложен</option>
                          <option value="in_progress">В процессе</option>
                          <option value="completed">Завершен</option>
                          <option value="canceled">Отменен</option>
                        </SelectInput>
                      </th>
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2"></th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.data.map((project) => (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={project.id}>
                        <tdv className="px-3 py-2">{project.id}</tdv>

                        <td className="px-3 py-2">
                          <img src={project.image_path} style={{ width: 60 }} alt="" />
                        </td>
                        <td className="px-3 py-3 hover:text-white">
                          <Link href={route("project.show", project.id)}>{project.name}</Link>
                        </td>
                        <td className="px-3 py-3">
                          <span className={"px-2 py-1 rounded text-white " + PROJECT_STATUS_CLASS_MAP[project.status]}>
                            {PROJECT_STATUS_TEXT_MAP[project.status]}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-nowrap">{project.created_at}</td>
                        <td className="px-3 py-3 text-nowrap">{project.due_date}</td>
                        <td className="px-3 py-3">{project.createdBy.name}</td>
                        <td className="px-3 py-3">{project.updatedBy.name}</td>
                        <td className="px-3 py-3 text-nowrap">
                          <Link href={route('project.edit', project.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                            Изменить
                          </Link>
                          <button
                            onClick={event => deleteProject(project)}
                            className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination links={projects.meta.links} />
            </div>
          </div>
        </div>
      </div>

    </AuthenticatedLayout>
  )
}

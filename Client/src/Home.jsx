import React, {useEffect, useState} from 'react';
import axios from "axios";

const Home = () => {
    const [tab, setTab] = useState(1);
    const [task, setTask] = useState('');
    const [todos, setTodos] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [updatedId, setUpdatedId] = useState(null);
    const [updatedTask, setUpdatedTask] = useState('');
    const [description, setDescription] = useState('');

    const handleTabs = (tab) => {
        setTab(tab);
        // console.log(tab);
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const handleAddTask = () => {
              // console.log(task);
        axios.post(`${apiUrl}/new-task`, {task, description})
            .then(res => {
                // console.log(res.data)
                setTask('');
                setDescription('');
                setTodos(res.data);
            })
            .catch(err => {
                console.log("error while adding task",err);
            });
    }

    useEffect(() => {
        axios.get(`${apiUrl}/read-tasks`)
            .then((res) => {
            // console.log(res.data);
            setTodos(res.data);
        })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleEdit = (id, task) => {
        setIsEdit(true);
        // console.log(id);
        setTask(task);
        setUpdatedId(id);
        setUpdatedTask(task);
        setDescription(description);
    }

    const updateTask = () => {
        axios.post(`${apiUrl}/update-task`, {updatedId, task, description})
            .then(res => {
                // console.log(res.data)
                const updatedTask = res.data[0]; // Assuming only one row is returned

                // Update only the specific task in the todos array
                setTodos(prevTodos =>
                    prevTodos.map(todo =>
                        todo.id === updatedTask.id ? updatedTask : todo
                    )
                );

                // Clear the task input field after updating
                setTask('');
                setDescription('');
            })
            .catch(err => {
                console.log("error while updating task",err);
            });
    }

    const handleDelete = (id) => {
        axios.post(`${apiUrl}/delete-task`, {id})
            .then(res => {
                // console.log(res.data)
                setTodos(res.data)
            })
            .catch(err => {
                console.log("error while deleting task",err);
            });
    }

    const handleComplete = (id) => {
        axios.post(`${apiUrl}/complete-task`, {id})
            .then(res => {
                // console.log(res.data)
                setTodos(res.data)
            })
            .catch(err => {
                console.log("error while completing task",err);
            });
    }

    return (
        <div className="bg-gray-100 h-screen w-screen">
            <div className="flex flex-col w-screen h-screen justify-center items-center">
                <div className="">
                    <h2 className="font-bold text-2xl mb-4">Task Management System</h2>
                </div>
                <div className="flex flex-col gap-3">
                    <input value={task} onChange={(e) => setTask(e.target.value)} type="text" placeholder="Enter Task"
                           className="w-64 p-2 outline-none border border-blue-300 rounded-md"/>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter Description"
                        className="w-64 p-2 outline-none border border-blue-300 rounded-md"
                    />
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-md text-center">{isEdit ?
                        <button onClick={updateTask} className="bg-blue-600 text-white px-4 rounded-md">Update</button> :
                        <button onClick={handleAddTask} className="bg-blue-600 text-white px-4 rounded-md">Add</button>
                    }
                    </div>
                </div>

                <div className="flex text-sm w-80 justify-evenly mt-4">
                    <p onClick={() => handleTabs(1)}
                       className={`${tab === 1 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>All</p>
                    <p onClick={() => handleTabs(2)} className={`${tab === 2 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>Active</p>
                    <p onClick={() => handleTabs(3)} className={`${tab === 3 ? 'text-blue-700' : 'text-black'} cursor-pointer`}>Completed</p>
                </div>

                {
                    tab == 1 && todos?.map((todo) => (
                        <div key={todo.id} className="flex justify-between bg-white p-3 w-80 mt-3 rounded-md">
                            <div>
                                <p className="text-lg font-semibold">{todo.task}</p>
                                <p className="text-xs text-gray-600">{new Date(todo.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-700">Status : {todo.status}</p>
                            </div>
                            <div className="flex flex-col text-sm justify-start items-start">
                                <button className="text-blue-500 cursor-pointer" onClick={() => handleEdit(todo.id, todo.task)}>Edit</button>
                                <button className="text-red-500 cursor-pointer" onClick={() => handleDelete(todo.id)}>Delete</button>
                                <button className="text-green-600 cursor-pointer" onClick={() => handleComplete(todo.id)}>Completed</button>
                            </div>
                        </div>
                    ))
                }
                {
                    tab == 2 && todos?.filter((todo) => todo.status === 'active').map((todo) => (
                        <div key={todo.id} className="flex justify-between bg-white p-3 w-80 mt-3 rounded-md">
                            <div>
                                <p className="text-lg font-semibold">{todo.task}</p>
                                <p className="text-xs text-gray-600">{new Date(todo.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-700">Status : {todo.status}</p>
                            </div>
                            <div className="flex flex-col text-sm justify-start items-start">
                                <button className="text-blue-500 cursor-pointer" onClick={() => handleEdit(todo.id, todo.task)}>Edit</button>
                                <button className="text-red-500 cursor-pointer" onClick={() => handleDelete(todo.id)}>Delete</button>
                                <button className="text-green-600 cursor-pointer" onClick={() => handleComplete(todo.id)}>Completed</button>
                            </div>
                        </div>
                    ))
                }
                {
                    tab == 3 && todos?.filter((todo) => todo.status === 'completed').map((todo) => (
                        <div key={todo.id} className="flex justify-between bg-white p-3 w-80 mt-3 rounded-md">
                            <div>
                                <p className="text-lg font-semibold">{todo.task}</p>
                                <p className="text-xs text-gray-600">{new Date(todo.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-700">Status : {todo.status}</p>
                            </div>
                            <div className="flex flex-col text-sm justify-center items-start">
                                <button className="text-red-500 cursor-pointer" onClick={() => handleDelete(todo.id)}>Delete</button>
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
    );
};

export default Home;
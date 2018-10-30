// Core
import React, { Component } from "react";
import FlipMove from "react-flip-move";
//components
import Task from "components/Task";
import Spinner from "components/Spinner";
// Instruments
import Styles from "./styles.m.css";
import Checkbox from "theme/assets/Checkbox";
import { api } from "../../REST";
import { sortTasksByGroup } from "../../instruments";

export default class Scheduler extends Component {
    state = {
        tasks:           [],
        isSpinning:      false,
        newTaskMessage:  "",
        tasksFilter:     "",
        isTasksFetching: false,
        allTasksChecked: false,
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);

        const tasks = await api.fetchTasks();

        this.setState({ tasks });
        this._setTasksFetchingState(false);
    };

    _createTaskAsync = async (event) => {
        this._setTasksFetchingState(true);
        event.preventDefault();

        const { newTaskMessage } = this.state;

        if (!newTaskMessage) {
            return null;
        }

        const task = await api.createTask(newTaskMessage);

        this.setState(({ tasks }) => ({
            tasks:          [task, ...tasks],
            newTaskMessage: "",
        }));

        this._setTasksFetchingState(false);
    };

    _updateTaskAsync = async (task) => {
        this._setTasksFetchingState(true);
        const {
            data: [updatedTask],
        } = await api.updateTask(task);

        this.setState(({ tasks }) => ({
            tasks: tasks.map(
                (task) => task.id === updatedTask.id ? updatedTask : task
            ),
        }));
        this._setTasksFetchingState(false);
    };

    _removeTaskAsync = async (id) => {
        this._setTasksFetchingState(true);
        await api.removeTask(id);
        this.setState(({ tasks }) => ({
            tasks: tasks.filter((task) => task.id !== id),
        }));
        this._setTasksFetchingState(false);
    };

    _setTasksFetchingState = (TasksFetchingState) => {
        this.setState({
            isTasksFetching: TasksFetchingState,
        });
    };

    _updateNewTaskMessage = (event) => {
        const { value } = event.target;

        this.setState({
            newTaskMessage: value,
        });
    };

    _updateTasksFilter = (event) => {
        const { value } = event.target;

        this.setState({
            tasksFilter: value.toLowerCase(),
        });
    };

    _completeAllTasksAsync = async () => {
        if (this._getAllCompleted()) {
            return null;
        }

        this._setTasksFetchingState(true);

        const { tasks } = this.state;

        tasks.filter((task) => !task.completed);
        await api.completeAllTasks(tasks);
        tasks.every((task) => task.completed = true);
        this.setState({
            tasks,
            allTasksChecked: true,
        });

        this._setTasksFetchingState(false);
    };

    _getAllCompleted = () => {
        const { tasks } = this.state;

        return tasks.every((task) => task.completed);
    };

    render () {
        const {
            tasks,
            tasksFilter,
            newTaskMessage,
            isTasksFetching,
            allTasksChecked,
        } = this.state;

        const tasksJSX = sortTasksByGroup(tasks)
            .filter(({ message }) => message.includes(tasksFilter))
            .map((task) => {
                return (
                    <Task
                        key = { task.id }
                        { ...task }
                        _removeTaskAsync = { this._removeTaskAsync }
                        _updateTaskAsync = { this._updateTaskAsync }
                    />
                );
            });

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching } />
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = 'Поиск'
                            type = 'search'
                            onChange = { this._updateTasksFilter }
                            value = { tasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                className = 'createTask'
                                maxLength = { 50 }
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                onChange = { this._updateNewTaskMessage }
                                value = { newTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div className = 'overlay'>
                            <ul>
                                <FlipMove duration = { 400 } easing = 'ease-in-out'>
                                    {tasksJSX}
                                </FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { allTasksChecked }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
                        />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}

// Core
import React, { PureComponent } from "react";
import { arrayOf, bool, func, shape, string } from "prop-types";
// Components
// Instruments
import Styles from "./styles.m.css";
import Checkbox from "theme/assets/Checkbox";
import Edit from "theme/assets/Edit";
import Remove from "theme/assets/Remove";
import Star from "theme/assets/Star";

export default class Task extends PureComponent {
    static propTypes = {
        _removeTaskAsync: func.isRequired,
        _updateTaskAsync: func.isRequired,
        tasks:            arrayOf(
            shape({
                completed: bool.isRequired,
                favorite:  bool.isRequired,
                id:        string.isRequired,
                message:   string.isRequired,
            })
        ),
    };

    constructor (props) {
        super(props);
        this.taskInput = React.createRef();
        this.state = {
            isTaskEditing: false,
            newMessage:    this.props.message,
        };
    }

    componentDidMount () {}

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _setTaskEditingState = (TaskEditingState) => {
        this.setState({
            isTaskEditing: TaskEditingState,
        });
        if (TaskEditingState) {
            this.taskInput.current.focus();
        }
    };

    _updateNewTaskMessage = (event) => {
        const { value } = event.target;

        this.setState({
            newMessage: value,
        });
    };
    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();
        } else {
            this._setTaskEditingState(true);
        }
        // this._updateTask();

        return null;
    };

    _cancelUpdatingTaskMessage = () => {
        this.setState({
            newMessage: this.props.message,
        });
        this._setTaskEditingState(false);
    };
    _updateTaskMessageOnKeyDown = (event) => {
        const { newMessage } = this.state;

        if (!newMessage.trim()) {
            return null;
        }

        if (event.key === "Enter") {
            this._updateTask();
        }

        if (event.key === "Escape") {
            this._cancelUpdatingTaskMessage();
        }
    };
    _updateTask = () => {
        const { newMessage } = this.state;
        const { _updateTaskAsync, message } = this.props;

        if (newMessage === message) {
            this._setTaskEditingState(false);

            return null;
        }
        const task = this._getTaskShape({ message: newMessage });

        _updateTaskAsync(task);
        this._setTaskEditingState(false);
    };

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;
        const task = this._getTaskShape({ completed: !completed });

        _updateTaskAsync(task);
    };

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;
        const task = this._getTaskShape({ favorite: !favorite });

        _updateTaskAsync(task);
    };

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    render () {
        const { isTaskEditing, newMessage } = this.state;
        const { completed, favorite } = this.props;

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <Checkbox
                        checked = { completed }
                        inlineBlock
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        className = { Styles.toggleTaskCompletedState }
                        onClick = { this._toggleTaskCompletedState }
                    />
                    <input
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { newMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        checked = { isTaskEditing }
                        className = { Styles.updateTaskMessageOnClick }
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        className = { Styles.removeTask }
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}

import { MAIN_URL, TOKEN } from "./config";

export const api = {
    fetchTasks: async () => {
        const response = await fetch(MAIN_URL, {
            method:  "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
        });
        const { data: tasks } = await response.json();

        return tasks;
    },
    updateTask: async (task) => {
        const response = await fetch(MAIN_URL, {
            method:  "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
            body:    JSON.stringify([task]),
        });

        const { data: [updatedTask] } = await response.json();

        return updatedTask;
    },

    completeAllTasks: async (tasks) => {
        await tasks.map((task) =>
            fetch(MAIN_URL, {
                method:  "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:  TOKEN,
                },
                body:    JSON.stringify([task]),
            }).then((response) => {
                return response.json();
            })
        );
    },
    createTask:       async (message) => {
        const response = await fetch(MAIN_URL, {
            method:  "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:  TOKEN,
            },
            body:    JSON.stringify({ message }),
        });

        const { data: task } = await response.json();

        return task;
    },
    removeTask:       async (id) => {
        const response = await fetch(`${MAIN_URL}/${id}`, {
            method:  "DELETE",
            headers: {
                Authorization: TOKEN,
            },
        });

        // return response.json();
    },
};

module.exports = {
    apps: [
        {
            name: "admin",
            script: "npm",
            args: "start",
            exec_mode: "fork", // 或 "cluster"
        },
    ],
};
// webhook.js
const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 4000;

// 解析 JSON 請求
app.use(express.json());

const exeCommandList = [
    'cd ../zhi-zhao-tech-official-site',
    'docker-compose down',
    'docker-compose up --build -d',
]
// 設定 webhook 路由
app.get('/webhook', (req, res) => {
    console.log('Webhook received:', req.body);

    // 執行 docker-compose 命令
    const command = exeCommandList.join(' && ');
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return res.status(500).send('Error executing command');
        }
        if (stderr) {
            console.error(`Command stderr: ${stderr}`);
            return res.status(500).send('Command error');
        }
        console.log(`Command stdout: ${stdout}`);
        res.status(200).send('Command executed successfully');
    });
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
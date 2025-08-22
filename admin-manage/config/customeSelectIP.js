//特殊命令，使用指定的ip：npm run dev -IP Address
const inquirer = require('inquirer');
const chalk = require('chalk');
const ls = require('child_process');
const server = require('./baseConfig')
const ipList = server['serverList'];

let ip = null

const promptList = [
  {
    type: 'list',
    message: '选择要连接的服务器ip和端口号:',
    name: 'ips',
    choices: ipList.map(item => {
      return `${item.name}(${item.domain})`;
    }),
  }
];
inquirer.prompt(promptList).then(answers => {
  let regex = /\((.+?)\)/g;
  ip = regex.exec(answers.ips)[1];
  console.log(`${chalk.green('选择的服务器ip和端口号是:')}${chalk.red(ip)}`);
  //在windows下npm的执行名不同,win32得用‘npm.cmd’
  ls.spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'serve', `-${ip}`], {
    stdio: 'inherit',
  });
});



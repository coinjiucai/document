module.exports = () => {
  //解析获取命令行中输入的服务端ip(npm run dev -IP address)
  const configArgv = JSON.parse(process?.env?.npm_config_argv || "")
  const original = configArgv?.original?.slice(1) || [];
  const ip = original?.[1]?.replace(/-/g, '') || '';
  return ip
};

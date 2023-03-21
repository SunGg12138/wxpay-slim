const scanner = require('sonarqube-scanner');

// sonarqube 服务地址，默认为本地9000端口
const serverUrl = process.env.SONARQUBE_URL || 'http://localhost:9000';
// sonarqube的项目token
const token = process.env.SONARQUBE_TOKEN;
// 项目的key和name
const projectKey = process.env.SONARQUBE_PROJECTKEY;
const projectName = process.env.SONARQUBE_PROJECTNAME;

const options = {
  'sonar.projectKey': projectKey,
  'sonar.projectName': projectName,
  // 扫码的文件目录
  'sonar.sources': 'src',
  // 语言
  'sonar.language': 'javascript',
  'sonar.javascript.lcov.reportPaths' : 'coverage/lcov.info',
  'sonar.sourceEncoding': 'UTF-8',
  'analysis.mode': 'incremental',
  'sonar.projectVersion': '1.0.1',
};

const params = {
  serverUrl,
  token,
  options
};

const sonarScanner = async () => {
  console.log(serverUrl);

  if (!serverUrl) {
    console.log('SonarQube url not set. Nothing to do...');
    return;
  }

  const callback  = (result) => {
    console.log('Sonarqube scanner result:', result);
  }

  scanner(params, callback);
}

sonarScanner()
  .catch(err => console.error('Error during sonar scan', err));

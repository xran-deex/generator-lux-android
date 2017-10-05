'use strict';

var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {

  constructor(args, opts) {
    super(args, opts);
    this.option('Option');
  }

  prompting() {
    var done = this.async();

    this.log(yosay(
      'Lux Android Create Project ' +
      chalk.red('generator-lux-android') +
      ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'Project Name: ',
      default: this.appname, // Default to current folder name
      validate: function (input) {
        if (/^([a-zA-Z0-9_]*)$/.test(input)) {
          return true;
        }
        return 'Invalid project name: ' + this.appname;
      }
    }, {
      type: 'input',
      name: 'packageName',
      message: 'Package name: ',
      validate: function (input) {
        if (/^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)*)$/.test(input)) {
          return true;
        }
        return 'The package name you have provided is not a valid Java package name.';
      }
    }, {
      type: 'input',
      name: 'supportVersion',
      message: 'Support Version',
      default: '25.2.0',
      store: true
    }, {
      type: 'input',
      name: 'targetSdkVersion',
      message: 'Target SDK Version',
      default: '25',
      store: true
    }, {
      type: 'input',
      name: 'minSdkVersion',
      message: 'Min SDK Version',
      default: '17',
      store: true
    }, {
      type: 'input',
      name: 'buildVersion',
      message: 'Build Version',
      default: '25.0.2',
      store: true
    }, {
      type: 'input',
      name: 'sdkLocation',
      message: 'SDK Location',
      default: '',
      store: true
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;

      done();
    }.bind(this));
  }

  writing() {
    var packageDir = this.props.packageName.replace(/\./g, '/');
    this.props.packageDir = packageDir;

    mkdirp('app/libs');
    mkdirp('app/src/main/lux/' + packageDir);

    this.fs.copy(this.sourceRoot() + '/gradle', 'gradle');
    this.fs.copy(this.sourceRoot() + '/app/src/main/res', 'app/src/main/res');

    this.fs.copy(this.sourceRoot() + '/gradle.properties', 'gradle.properties');
    this.fs.copy(this.sourceRoot() + '/gradlew', 'gradlew');
    this.fs.copy(this.sourceRoot() + '/gradlew.bat', 'gradlew.bat');
    this.fs.copy(this.sourceRoot() + '/settings.gradle', 'settings.gradle');
    this.fs.copy(this.sourceRoot() + '/app/proguard-rules.pro', 'app/proguard-rules.pro');

    this.fs.copyTpl(this.sourceRoot() + '/build.gradle', 'build.gradle', this.props);
    this.fs.copyTpl(this.sourceRoot() + '/app/build.gradle', 'app/build.gradle', this.props);
    this.fs.copyTpl(this.sourceRoot() + '/app/src/main/lux/com/example/luxapp/app.lux', 'app/src/main/lux/' + packageDir + '/app.lux', this.props);
    this.fs.copyTpl(this.sourceRoot() + '/app/src/main/AndroidManifest.xml', 'app/src/main/AndroidManifest.xml', this.props);
    this.fs.copyTpl(this.sourceRoot() + '/app/src/main/res/values', 'app/src/main/res/values', this.props);
    this.fs.copyTpl(this.sourceRoot() + '/app/src/debug/AndroidManifest.xml', 'app/src/debug/AndroidManifest.xml', this.props);
    this.fs.copyTpl(this.sourceRoot() + '/local.properties', 'local.properties', this.props);
  }

  install() {
  }

};

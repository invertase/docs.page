import 'dart:convert';
import 'dart:io';
import 'package:path/path.dart' as path;
import 'package:ansi_styles/extension.dart';
import 'package:yaml/yaml.dart' as yaml;

createFiles() async {
  final indexContent = '# Welcome to your new documentation!';
  final configContent = '''
---
name: ''
logo: ''
logoDark: ''
favicon: ''
socialPreview: ''
twitter: ''
noindex: false
theme: "#00bcd4"
sidebar: [['Home', '/']]
headerDepth: 3
variables: {}
googleTagManager: ''
zoomImages: false
experimentalCodehike: false
experimentalMath: false
''';

  final current = Directory.current;
  final configJson = File(path.joinAll([current.path, 'docs.json']));
  final configYaml = File(path.joinAll([current.path, 'docs.yaml']));
  final configToml = File(path.joinAll([current.path, 'docs.toml']));

  if (configJson.existsSync() ||
      configYaml.existsSync() ||
      configToml.existsSync()) {
    print(
        "Docs.page tried to create a docs.page configuration file, but a docs.json/docs.yaml/docs.toml file already exists."
            .yellow);
  } else if (Platform.environment['DOCS_PAGE_CONFIG_FORMAT'] == 'json') {
    await configJson.create(recursive: true);

    final yamlMap = Map.from(yaml.loadYaml(configContent));

    final jsonString = JsonEncoder.withIndent('  ').convert(yamlMap);

    await configJson.writeAsString(jsonString);

    print('Docs.page created file: \n  ${configJson.path}'.blueBright);
  } else {
    await configYaml.create(recursive: true);
    await configYaml.writeAsString(configContent);
    print('Docs.page created file: \n  ${configYaml.path}'.blueBright);
  }

  final indexPath = path.joinAll([current.path, 'docs', 'index.mdx']);

  if (File(indexPath).existsSync()) {
    print(
        "Docs.page tried to create an docs/index.mdx file, but one already exists."
            .yellow);
  } else {
    File indexFile = await File(indexPath).create(recursive: true);
    await indexFile.writeAsString(indexContent);
    print('Docs.page created file: \n  $indexFile'.blueBright);
  }

  print(
      'To learn more about config file options and how customize your Docs.page project, visit ' +
          "https://use.docs.page".underline.blueBright);
}

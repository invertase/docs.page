import 'dart:io';
import 'package:path/path.dart' as path;
import 'package:ansi_styles/extension.dart';

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
sidebar: []
headerDepth: 3
variables: {}
googleTagManager: ''
zoomImages: false
experimentalCodehike: false
experimentalMath: false
''';

  final current = Directory.current;
  String configPath = path.joinAll([current.path, 'docs.yaml']);
  final configJson = File(path.joinAll([current.path, 'docs.json']));
  final configYaml = File(configPath);
  final configToml = File(path.joinAll([current.path, 'docs.toml']));

  if (configJson.existsSync() ||
      configYaml.existsSync() ||
      configToml.existsSync()) {
    print(
        "Docs.page tries to create a docs.yaml configuration file, but a docs.json/docs.yaml/docs.toml file already exists."
            .yellow);
  } else {
    await configYaml.create(recursive: true);
    await configYaml.writeAsString(configContent);
    print('Docs.page created file: \n  $configPath'.blueBright);
  }

  final indexPath = path.joinAll([current.path, 'docs', 'index.mdx']);

  if (File(indexPath).existsSync()) {
    print(
        "Docs.page tries to create an docs/index.mdx file, but one already exists."
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

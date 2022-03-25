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

  final configPath = path.joinAll([current.path, 'docs.yaml']);

  File configFile = await File(configPath).create(recursive: true);

  await configFile.writeAsString(configContent);

  final indexPath = path.joinAll([current.path, 'docs', 'index.mdx']);

  File indexFile = await File(indexPath).create(recursive: true);

  await indexFile.writeAsString(indexContent);

  print('Docs.page created files: \n  $configPath \n  $indexPath'.blueBright);
  print(
      'To learn more about config file options and how customize your Docs.page project, visit ' +
          "https://use.docs.page".underline.blueBright);
}

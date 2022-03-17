import 'package:args/args.dart';
import 'dart:io';
import 'package:path/path.dart' as path;
import 'package:ansi_styles/extension.dart';

void main(List<String> arguments) async {
  final parser = ArgParser();
  parser.addCommand('init');
  final argResults = parser.parse(arguments);
  if (argResults.command?.name == 'init') {
    await createFiles();
  } else {
    throw UnsupportedError('Only the init command is currently supported.');
  }
}

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

  var indexPath = path.joinAll([current.path, 'docs', 'index.mdx']);

  File indexFile = await File(indexPath).create(recursive: true);

  await indexFile.writeAsString(indexContent);

  print('Docs.page created files: \n  $configPath \n  $indexPath'.blueBright);
  print(
      'To learn more about config file options and how customize your Docs.page project, visit ' +
          "https://use.docs.page".underline.blueBright);
}

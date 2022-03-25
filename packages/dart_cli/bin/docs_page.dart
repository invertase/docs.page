import 'package:args/args.dart';
import 'package:docs_page/create_files.dart';

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

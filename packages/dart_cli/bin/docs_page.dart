import 'package:args/args.dart';
import 'package:docs_page/src/create_files.dart';
import 'package:docs_page/src/typedoc.dart';

void main(List<String> arguments) async {
  final parser = ArgParser();
  parser.addCommand('init');
  parser.addCommand('typedoc');
  final argResults = parser.parse(arguments);

  switch (argResults.command?.name) {
    case 'init':
      await createFiles();
      break;
    case 'typedoc':
      Node ast = await getJson();
      await generate(ast: ast);
      break;

    default:
      throw UnsupportedError('Only the init command is currently supported.');
  }
}

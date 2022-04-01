import 'package:args/args.dart';
import 'package:docs_page/src/init.dart';
import 'package:docs_page/src/typedoc.dart';
import 'package:docs_page/src/help.dart';

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
      Node ast = await getTypedocJson();
      await generate(ast: ast);
      break;
    case 'help':
      displayHelp();
      break;
    default:
      throw UnsupportedError(
          'Only help, init, typedoc commands are currently supported.');
  }
}

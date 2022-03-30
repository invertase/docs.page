import 'package:docs_page/src/typedoc.dart';

void main() async {
  final rootAst = await getJson();

  await generate(ast: rootAst);
}

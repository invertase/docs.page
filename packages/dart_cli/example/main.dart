import 'package:docs_page/src/typedoc.dart';

void main() async {
  final rootAst = await getTypedocJson();

  await generate(ast: rootAst);
}

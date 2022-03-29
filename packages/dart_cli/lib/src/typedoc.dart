import 'package:docs_page/src/docs_page_config.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:path/path.dart' as path;
import 'dart:io';
import 'dart:convert';

part 'typedoc.g.dart';

@JsonSerializable()
class Node {
  /// The generated code assumes these values exist in JSON.
  final int? id;
  final String? name;
  final int? kind;
  final String? kindString;
  final Map<String, bool>? flags;
  final List<Node>? children;
  final List<Group>? groups;
  final List<Source>? sources;
  final Comment? comment;

  Node(
      {this.id,
      this.name,
      this.kind,
      this.flags,
      this.children,
      this.groups,
      this.kindString,
      this.sources,
      this.comment});

  /// Connect the generated [_$NodeFromJson] function to the `fromJson`
  /// factory.
  factory Node.fromJson(Map<String, dynamic> json) => _$NodeFromJson(json);

  /// Connect the generated [_$PersonToJson] function to the `toJson` method.
  Map<String, dynamic> toJson() => _$NodeToJson(this);
}

@JsonSerializable()
class Group {
  final String title;
  final int kind;
  final List<int> children;

  Group({required this.title, required this.kind, required this.children});

  factory Group.fromJson(Map<String, dynamic> json) => _$GroupFromJson(json);

  /// Connect the generated [_GroupToJson] function to the `toJson` method.
  Map<String, dynamic> toJson() => _$GroupToJson(this);
}

@JsonSerializable()
class Source {
  final String fileName;
  final int line;
  final int character;

  Source({required this.fileName, required this.line, required this.character});

  factory Source.fromJson(Map<String, dynamic> json) => _$SourceFromJson(json);

  /// Connect the generated [_$SourceToJson] function to the `toJson` method.
  Map<String, dynamic> toJson() => _$SourceToJson(this);
}

@JsonSerializable()
class Comment {
  final String? shortText;
  final String? text;
  final List<Tag>? tags;

  Comment({this.shortText, this.text, this.tags});

  factory Comment.fromJson(Map<String, dynamic> json) =>
      _$CommentFromJson(json);

  /// Connect the generated [_$CommentToJson] function to the `toJson` method.
  Map<String, dynamic> toJson() => _$CommentToJson(this);
}

@JsonSerializable()
class Tag {
  final String tag;
  final String text;

  Tag({required this.tag, required this.text});

  factory Tag.fromJson(Map<String, dynamic> json) => _$TagFromJson(json);

  /// Connect the generated [_$TagToJson] function to the `toJson` method.
  Map<String, dynamic> toJson() => _$TagToJson(this);
}
// get the typedoc.json from the repo

Future<Node> getJson() async {
  final current = Directory.current;

  final jsonPath = path.joinAll([current.path, 'docs', 'typedoc.json']);

  File typedocFile = File(jsonPath);

  String typedocString = await typedocFile.readAsString();

  Node parsed = Node.fromJson(jsonDecode(typedocString));

  return parsed;
}
// parse it

Future<void> generate(Node ast) async {
  final current = Directory.current;
  final groups = ast.groups;
  final children = ast.children;

  if (groups != null && children != null && children.isNotEmpty) {
    for (final group in groups) {
      String filePath =
          path.joinAll([current.path, 'docs', 'api', group.title + '.mdx']);

      File groupDoc = await File(filePath).create(recursive: true);

      await groupDoc.writeAsString('# ' + group.title + ' \n');
      final groupKind = group.kind;

      for (final child in children) {
        final childKind = child.kind;
        final childName = child.name;
        final childShortText =
            child.comment?.shortText?.replaceAll(RegExp('<.+>'), '');
        final childText = child.comment?.text?.replaceAll(RegExp('<.+>'), '');

        if (childKind != null && childKind == groupKind && childName != null) {
          await groupDoc.writeAsString('## ' + childName + ' \n ',
              mode: FileMode.append);
          if (childShortText != null) {
            await groupDoc.writeAsString('\n  **Description:** \n',
                mode: FileMode.append);
            await groupDoc.writeAsString('\n $childShortText \n',
                mode: FileMode.append);
          }
          if (childText != null) {
            await groupDoc.writeAsString('\n  **Detail:** \n',
                mode: FileMode.append);
            await groupDoc.writeAsString('\n $childText \n',
                mode: FileMode.append);
          }
        }
      }
    }
    await appendToSidebar(ast);
  }
}

Future<void> appendToSidebar(Node rootAst) async {
  final groups = rootAst.groups;
  if (groups == null) {
    throw Exception('No groups found');
  }
  List<Object> refs = [];

  for (final group in groups) {
    final href = Uri.encodeFull(group.title);

    List<String> refItem = [group.title, '/_API/$href'];

    refs.add(refItem);
  }

  final refsPath = path.joinAll([Directory.current.path, 'docs.refs.json']);

  File(refsPath).writeAsStringSync(json.encode(refs));
}

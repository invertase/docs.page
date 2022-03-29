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
  final String name;
  final int? kind;
  final String? kindString;
  final Map<String, bool>? flags;
  final List<Node>? children;
  final List<Group>? groups;
  final List<Source>? sources;
  final Comment? comment;

  Node(
      {this.id,
      required this.name,
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

Future<void> generate(
    {required Node ast, String? docPath, List<Object>? refs}) async {
  DocsPageConfig config = DocsPageConfig.fromDirectory();

  String referenceRoot = config.references ?? '_API';

  String currentPath =
      docPath ?? path.joinAll([Directory.current.path, 'docs', referenceRoot]);

  final children = ast.children;

  File refsFile =
      File(path.joinAll([Directory.current.path, 'docs.refs.json']));

  refsFile.delete(recursive: true);

  if (children != null && children.isNotEmpty) {
    for (final child in children) {
      final childPath = path.joinAll([currentPath, '${child.name}.mdx']);

      final refPath = path.relative(path.joinAll([currentPath, child.name]),
          from: path.joinAll([Directory.current.path, 'docs']));

      await addRef(child, refPath);

      await createDoc(child, childPath);
    }
  }
}

Future<void> addRef(Node node, String filePath) async {
  File refsFile =
      File(path.joinAll([Directory.current.path, 'docs.refs.json']));

  String refsString = "[]";

  if (await refsFile.exists() && refsFile.readAsStringSync() != '') {
    refsString = await refsFile.readAsString();
  }

  List<dynamic> refs = jsonDecode(refsString);

  Map ref = {
    "name": node.name,
    "path": Uri.encodeFull(filePath),
    "kind": node.kindString
  };

  refs.add(ref);

  refsFile.writeAsString(json.encode(refs));
}

Future<void> createDoc(Node node, String childPath) async {
  File file = await File(childPath).create(recursive: true);
  String frontmatter = '''
---
title: ${node.name}
description: ${node.comment?.shortText}
reference: true
referenceKind: ${node.kindString ?? ''}
---
''';

  await file.writeAsString(frontmatter);
  await file.writeAsString('\n \n', mode: FileMode.append);

  await file.writeAsString('# ${node.name} \n \n', mode: FileMode.append);

  final shortText = node.comment?.shortText;
  final text = node.comment?.text;
  // final tags = node.comment?.tags;

  if (shortText != null) {
    await file.writeAsString('$shortText \n \n', mode: FileMode.append);
  }
  if (text != null) {
    await file.writeAsString('$text \n \n', mode: FileMode.append);
  }
}

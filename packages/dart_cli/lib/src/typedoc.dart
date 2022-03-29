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

Future<void> generate({required Node ast, String? docPath}) async {
  String currentPath =
      docPath ?? path.joinAll([Directory.current.path, 'docs', '_API']);
  final groups = ast.groups;
  final children = ast.children;

  List<Object> refs = [];

// If there are more than one group defined, make a subdirectory and continue recursively
  if (groups != null &&
      children != null &&
      children.isNotEmpty &&
      groups.length > 1) {
    for (final group in groups) {
      // Make a directory group.title
      String dirPath = path.joinAll([currentPath, group.title]);

      await Directory(dirPath).create(recursive: true);

      // go through ast.children and call generate on them with new path
      for (final child in children) {
        await generate(ast: child, docPath: dirPath);
      }
    }
  } else {
    // otherwise create file from node
    final filePath = path.joinAll([currentPath, '${ast.name}.mdx']);
    // title
    await File(filePath)
        .writeAsString("# ${ast.name} \n \n", mode: FileMode.append);
    // description
    await File(filePath)
        .writeAsString("**Description**: \n \n", mode: FileMode.append);
    final shortText = ast.comment?.shortText;
    if (shortText != null) {
      await File(filePath)
          .writeAsString("$shortText \n \n", mode: FileMode.append);
    }
    if (children != null && children.isNotEmpty) {
      for (final child in children) {
        final childName = child.name;
        await File(filePath)
            .writeAsString("child: $childName \n", mode: FileMode.append);
      }
    }
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

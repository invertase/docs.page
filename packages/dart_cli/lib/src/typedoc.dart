import 'package:docs_page/src/docs_page_config.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:path/path.dart' as path;
import 'dart:io';
import 'dart:convert';
import 'package:ansi_styles/extension.dart';

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

Future<Node> getTypedocJson() async {
  final current = Directory.current;

  final jsonPath = path.joinAll([current.path, 'docs', 'typedoc.json']);

  File typedocFile = File(jsonPath);

  if (typedocFile.existsSync()) {
    String typedocString = await typedocFile.readAsString();
    Node parsed = Node.fromJson(jsonDecode(typedocString));
    return parsed;
  }
  throw Exception('Missing docs/typedoc.json, please generate this first.');
}

Future<void> generate(
    {required Node ast, String? docPath, List<Object>? refs}) async {
  DocsPageConfig config = DocsPageConfig.fromDirectory();

  String? referenceRoot = config.references;
  if (referenceRoot != null) {
    String currentPath = docPath ??
        path.joinAll([Directory.current.path, 'docs', referenceRoot]);
    if (config.locales != null) {
      currentPath = docPath ??
          path.joinAll([Directory.current.path, 'docs', 'gb', referenceRoot]);
    }
    final children = ast.children;

    File refsFile =
        File(path.joinAll([Directory.current.path, 'docs.refs.json']));
    if (refsFile.existsSync()) {
      refsFile.delete(recursive: true);
    }

    if (children != null && children.isNotEmpty) {
      print('Docs.page created files:'.blueBright);

      for (final child in children) {
        final childPath = path.joinAll([currentPath, '${child.name}.mdx']);

        final refPath = path.relative(path.joinAll([currentPath, child.name]),
            from: path.joinAll([Directory.current.path, 'docs']));

        await addRef(node: child, filePath: refPath);

        await createDoc(node: child, filePath: childPath);
        print(childPath.blue);
      }
    }
    await addRef(
        name: 'Overview', filePath: path.joinAll([currentPath, 'index.mdx']));

    await createIndexFile(filePath: path.joinAll([currentPath, 'index.mdx']));
  } else {
    throw Exception(
        'Missing field "references" in your docs.json or docs.yaml file. This field should be a string which determines the subdirectory in which your API references are generated');
  }
}

Future<void> addRef(
    {Node? node, String? name, required String filePath}) async {
  Map ref;
  if (node != null) {
    ref = {
      "name": node.name,
      "path": Uri.encodeFull(filePath),
      "kind": node.kindString
    };
  } else if (name != null) {
    ref = {"name": name, "path": Uri.encodeFull(filePath), "kind": "Overview"};
  } else {
    throw Exception('need to specify node or name');
  }
  File refsFile =
      File(path.joinAll([Directory.current.path, 'docs.refs.json']));

  String refsString = "[]";

  if (await refsFile.exists() && refsFile.readAsStringSync() != '') {
    refsString = await refsFile.readAsString();
  }

  List<dynamic> refs = jsonDecode(refsString);

  refs.add(ref);

  refsFile.writeAsString(json.encode(refs));
}

Future<void> createDoc(
    {required Node node,
    required String filePath,
    bool frontmatterEnabled = true,
    int depth = 1}) async {
  File file = await File(filePath).create(recursive: true);

  if (frontmatterEnabled) {
    String frontmatter = '''
---
title: ${node.name}
description: ${node.comment?.shortText}
reference: true
referenceKind: ${node.kindString ?? ''}
---
''';

    await file.writeAsString(frontmatter);
  }

  String headerPrefix = '';

  for (int i = 0; i < depth; i++) {
    headerPrefix += '#';
  }
  await appendAllToFile(file, [
    '$headerPrefix ${node.name}',
    node.comment?.shortText,
    node.comment?.text,
  ]);

  List<Source>? sources = node.sources;

  if (sources != null) {
    await appendToFile(file, '**Source**');
    for (final source in sources) {
      DocsPageConfig config = DocsPageConfig.fromDirectory();
      await appendToFile(file, getGithubLink(config: config, source: source));
    }
  }

  List<Node>? children = node.children;

  if (children != null) {
    for (final child in children) {
      await createDoc(
          node: child,
          filePath: filePath,
          frontmatterEnabled: false,
          depth: depth + 1);
    }
  }
}

Future<void> appendToFile(File file, String? content) async {
  if (content != null) {
    await file.writeAsString(content + '\n \n ', mode: FileMode.append);
  }
}

Future<void> appendAllToFile(File file, List<String?> content) async {
  for (final text in content) {
    await appendToFile(file, text);
  }
}

Future<void> createIndexFile({required String filePath}) async {
  if (!File(filePath).existsSync()) {
    File file = await File(filePath).create(recursive: true);

    String frontmatter = '''
---
title: Overview
description: Overview for references
reference: true
referenceKind: null
---
''';

    await file.writeAsString(frontmatter);
    await file.writeAsString('\n \n', mode: FileMode.append);

    await file.writeAsString('# References \n \n', mode: FileMode.append);

    await file.writeAsString('## Overview Page for API references \n \n',
        mode: FileMode.append);
    await file.writeAsString('Edit this page!', mode: FileMode.append);
  }
}

String getGithubLink({required DocsPageConfig config, required Source source}) {
  final typedocEntryDir = config.typedocEntryDir;

  final fileName = source.fileName;
  final line = source.line;

  if (typedocEntryDir != null) {
    final filePath = path.joinAll([typedocEntryDir, fileName]);
    return '<GithubLink title="${source.fileName}" src="$filePath#L${line.toString()}"/>';
  } else {
    throw Exception('Missing typedocEntryDir option in docs.json');
  }
}

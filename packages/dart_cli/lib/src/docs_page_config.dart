import 'dart:convert';
import 'package:json_annotation/json_annotation.dart';
import 'dart:io';
import 'package:yaml/yaml.dart';
import 'package:toml/toml.dart';
import 'package:path/path.dart' as path;

part 'docs_page_config.g.dart';

@JsonSerializable()
class DocsPageConfig {
  final String? name;
  final String? theme;
  final String? twitter;
  final List<Object>? sidebar;
  final DocSearch? docsearch;
  final String? googleTagManager;
  final bool? experimentalCodeHike;
  final bool? experimentalMath;
  final String? references;
  final String? typedocEntryDir;

  DocsPageConfig(
      {this.name,
      this.theme,
      this.docsearch,
      this.twitter,
      this.sidebar,
      this.googleTagManager,
      this.experimentalCodeHike,
      this.experimentalMath,
      this.references,
      this.typedocEntryDir});

  factory DocsPageConfig.fromJson(Map<String, dynamic> json) =>
      _$DocsPageConfigFromJson(json);

  factory DocsPageConfig.fromDirectory({Directory? dir}) {
    final directory = dir ?? Directory.current;

    String configJsonPath = path.joinAll([directory.path, 'docs.json']);
    String configYamlPath = path.joinAll([directory.path, 'docs.yaml']);
    String configTomlPath = path.joinAll([directory.path, 'docs.toml']);

    File configJson = File(configJsonPath);
    File configYaml = File(configYamlPath);
    File configToml = File(configTomlPath);

    if (configJson.existsSync()) {
      return _$DocsPageConfigFromJson(
          jsonDecode(configJson.readAsStringSync()));
    } else if (configYaml.existsSync()) {
      return _$DocsPageConfigFromJson(
          Map.from(loadYaml(configYaml.readAsStringSync())));
    } else if (configToml.existsSync()) {
      return _$DocsPageConfigFromJson(
          TomlDocument.parse(configToml.readAsStringSync()).toMap());
    } else {
      throw Exception("can't find config");
    }
  }

  void overwriteInDirectory({Directory? dir, DocsPageConfig? config}) {
    final directory = dir ?? Directory.current;

    String configJsonPath = path.joinAll([directory.path, 'docs.json']);
    String configYamlPath = path.joinAll([directory.path, 'docs.yaml']);

    File configJson = File(configJsonPath);
    File configYaml = File(configYamlPath);
    final config = this;

    if (configJson.existsSync()) {
      configJson.writeAsStringSync(json.encode(config));
      return;
    } else if (configYaml.existsSync()) {
      configJson.writeAsStringSync(json.encode(config));
      return;
    } else {
      throw UnsupportedError("Can only overwrite yaml and json formats");
    }
  }

  Map<String, dynamic> toJson() => _$DocsPageConfigToJson(this);
}

@JsonSerializable()
class DocSearch {
  final String apiKey;
  final String indexName;

  DocSearch({required this.apiKey, required this.indexName});

  factory DocSearch.fromJson(Map<String, dynamic> json) =>
      _$DocSearchFromJson(json);

  Map<String, dynamic> toJson() => _$DocSearchToJson(this);
}

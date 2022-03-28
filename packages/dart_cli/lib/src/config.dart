import 'dart:convert';
import 'package:json_annotation/json_annotation.dart';
import 'dart:io';
import 'package:yaml/yaml.dart';
import 'package:toml/toml.dart';
import 'package:path/path.dart' as path;

part 'config.g.dart';

@JsonSerializable()
class Config {
  final String? name;
  final String? theme;
  final String? twitter;
  final List<Object>? sidebar;
  final DocSearch? docsearch;
  final String? googleTagManager;
  final bool? experimentalCodeHike;
  final bool? experimentalMath;

  Config(
      {this.name,
      this.theme,
      this.docsearch,
      this.twitter,
      this.sidebar,
      this.googleTagManager,
      this.experimentalCodeHike,
      this.experimentalMath});

  factory Config.fromJson(Map<String, dynamic> json) => _$ConfigFromJson(json);

  factory Config.fromDirectory({Directory? dir}) {
    final directory = dir ?? Directory.current;

    String configJsonPath = path.joinAll([directory.path, 'docs.json']);
    String configYamlPath = path.joinAll([directory.path, 'docs.yaml']);
    String configTomlPath = path.joinAll([directory.path, 'docs.toml']);

    File configJson = File(configJsonPath);
    File configYaml = File(configYamlPath);
    File configToml = File(configTomlPath);

    if (configJson.existsSync()) {
      return _$ConfigFromJson(jsonDecode(configJson.readAsStringSync()));
    } else if (configYaml.existsSync()) {
      return _$ConfigFromJson(jsonDecode(configYaml.readAsStringSync()));
    } else if (configToml.existsSync()) {
      return _$ConfigFromJson(jsonDecode(configToml.readAsStringSync()));
    } else {
      throw Exception("can't find config");
    }
  }

  Map<String, dynamic> toJson() => _$ConfigToJson(this);
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

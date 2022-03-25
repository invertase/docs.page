// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'build_api_mdx.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Node _$NodeFromJson(Map<String, dynamic> json) => Node(
      id: json['id'] as int,
      name: json['name'] as String,
      kind: json['kind'] as int,
      flags: Map<String, bool>.from(json['flags'] as Map),
      children: (json['children'] as List<dynamic>)
          .map((e) => Node.fromJson(e as Map<String, dynamic>))
          .toList(),
      groups: (json['groups'] as List<dynamic>)
          .map((e) => Group.fromJson(e as Map<String, dynamic>))
          .toList(),
      kindString: json['kindString'] as String?,
      sources: (json['sources'] as List<dynamic>?)
          ?.map((e) => Source.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$NodeToJson(Node instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'kind': instance.kind,
      'kindString': instance.kindString,
      'flags': instance.flags,
      'children': instance.children,
      'groups': instance.groups,
      'sources': instance.sources,
    };

Group _$GroupFromJson(Map<String, dynamic> json) => Group(
      title: json['title'] as String,
      kind: json['kind'] as int,
      children:
          (json['children'] as List<dynamic>).map((e) => e as int).toList(),
    );

Map<String, dynamic> _$GroupToJson(Group instance) => <String, dynamic>{
      'title': instance.title,
      'kind': instance.kind,
      'children': instance.children,
    };

Source _$SourceFromJson(Map<String, dynamic> json) => Source(
      fileName: json['fileName'] as String,
      line: json['line'] as int,
      character:
          (json['character'] as List<dynamic>).map((e) => e as int).toList(),
    );

Map<String, dynamic> _$SourceToJson(Source instance) => <String, dynamic>{
      'fileName': instance.fileName,
      'line': instance.line,
      'character': instance.character,
    };
